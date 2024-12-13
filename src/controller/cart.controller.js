import CartProductModel from "../model/cartPoduct.model.js";
import UserModel from "../model/user.model.js";

export const addToCartItem = async(req,res) =>{
    try {
        const {id} = req.params;        
        const {productId} = req.body;

        if (!productId) {
            return res.status(400).json({ msg: "product id is required", error: true });
        }


        const cheackItemCart = await CartProductModel.findOne({userId:id,productId :productId});

        if(cheackItemCart){
            return res.status(400).json({ msg: "product is already in cart", error:true });
        }



        const cartItem = new CartProductModel({
            quantity: 1,
            productId: productId,
            userId : id
        })

        const cartSave = await cartItem.save();
        const updateCartUser = await UserModel.updateOne({_id: id} , {$push: {shopping_cart : productId}})

        res.status(201).json({
            data: cartSave,
            message: "Item add successfull",
            error: false,
            success: true,
        });
    } catch (error) {
        console.log(error);
        res
        .status(500)
        .json({ msg: error.message || error, error: true, success: false });
    }
}