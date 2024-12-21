import { mongoose } from "mongoose";
import OrderModel from "../model/order.model.js";
import CartProductModel from "../model/cartPoduct.model.js";
import UserModel from "../model/user.model.js";



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
