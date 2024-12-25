import { mongoose } from "mongoose";
import OrderModel from "../model/order.model.js";
import CartProductModel from "../model/cartPoduct.model.js";
import UserModel from "../model/user.model.js";
import Stripe from "../config/stripe.js";



export const cashOnDelivery = async (req, res) => {
    try {
        const {id} = req.params;
        const {list_items ,subTotalAmt , totalAmt , addressId } = req.body;

        const paylaod = list_items.map(el => {
            return {
                userId : id,
                orderId :`ORD -${new mongoose.Types.ObjectId()}`,
                productId : el.productId._id,
                product_details : {
                    name : el.productId.name,
                    image : el.productId.image,
                },
                paymentId : "" ,
                payment_status : "CASH ON DELIVERY",
                delivery_address :addressId,
                subTotalAmt :subTotalAmt,
                totalAmt :totalAmt
            }
        })

        const generateOrder =  await OrderModel.insertMany(paylaod)

        // remove form cart
        const removeItem = await CartProductModel.deleteMany({ userId : id });
        const updateInUser = await UserModel.updateOne({_id : id},{$set : {shopping_cart : [] }});
        
        return res.status(201).json({
            msg: " Order Placed Successfully",
            error: false,
            success: true,
            data: generateOrder,
        });

    } catch (error) {
        console.log(error);
        
        return res
        .status(500)
        .json({ msg: error.message || error, error: true, success: false });
    }
}


const calculateDiscountedPrice = (price, discount = 0) => {
    // Ensure inputs are valid numbers
    const numericPrice = Number(price);
    const numericDiscount = Number(discount);

    if (isNaN(numericPrice) || isNaN(numericDiscount)) {
        throw new Error("Both price and discount must be valid numbers.");
    }

    if (numericDiscount === 0 ) return numericPrice;

    // Calculate the discount amount
    const discountAmount = (numericPrice * numericDiscount) / 100;

    // Return the discounted price, rounded to two decimal places
    return (Number((numericPrice - discountAmount)).toFixed(2));
};


export const stripePayment = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ msg: "User not found", success: false });
        }

        const { list_items, addressId , totalAmt} = req.body;

        // Validate list_items
        if (!list_items || !Array.isArray(list_items)) {
            return res.status(400).json({ msg: "Invalid list_items data", success: false });
        }

        // Filter and map valid items
        const line_items = list_items
            .filter(item => item.productId && item.productId.name)
            .map(item => {
                const { productId, quantity } = item;                
                const discountedPrice = calculateDiscountedPrice(productId.price, productId.discount);                

                // Convert price to smallest unit and enforce minimum amount
                const unitAmount = Math.round(discountedPrice * 100); // Convert to smallest currency unit

                return {
                    price_data: {
                        currency: 'bdt',
                        product_data: {
                            name: productId.name || "Unknown Product",
                            images: Array.isArray(productId.image) ? productId.image : [productId.image],
                            metadata: {
                                productId: productId._id?.toString() || "N/A",
                            },
                        },
                        unit_amount: unitAmount *  110,
                    },
                    adjustable_quantity: {
                        enabled: true,
                        minimum: 1,
                    },
                    quantity,
                };
            });

        // Validate that at least one valid item exists
        if (line_items.length === 0) {
            return res.status(400).json({ msg: "No valid items found", success: false });
        }

        // Prepare Stripe session parameters
        const params = {
            mode: 'payment',
            submit_type: 'pay',
            payment_method_types: ['card'],
            customer_email: user.email,
            metadata: {
                userId: user._id.toString(),
                addressId: addressId?.toString() || "N/A",
            },
            line_items,
            success_url: `${process.env.URL}/success`,
            cancel_url: `${process.env.URL}/cancel`,
        };

        // Create Stripe checkout session
        const session = await Stripe.checkout.sessions.create(params);


        const paylaod = list_items.map(el => {
            return {
                userId : id,
                orderId :`OP -${new mongoose.Types.ObjectId()}`,
                productId : el.productId._id,
                product_details : {
                    name : el.productId.name,
                    image : el.productId.image,
                },
                paymentId :session.id ,
                payment_status : "ONLINE PAYMENT",
                delivery_address :addressId,
                totalAmt :totalAmt
            }
        })
        
        
        const generateOrder =  await OrderModel.insertMany(paylaod)

        // remove form cart
        const removeItem = await CartProductModel.deleteMany({ userId : id });
        const updateInUser = await UserModel.updateOne({_id : id},{$set : {shopping_cart : [] }})

         

        // Send response
        res.status(201).json(session);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ msg: error.message || error, error: true, success: false });
    }
};



export const  getOrderDetails = async(req,res) => {
    try {
        const {id} = req.params // order id

        const orderlist = await OrderModel.find({ userId : id }).sort({ createdAt : -1 }).populate('delivery_address userId')

        return res.json({
            message : "order list",
            data : orderlist,
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}