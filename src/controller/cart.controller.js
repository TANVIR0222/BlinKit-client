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

export const getCartItem = async(req,res) =>{
    try {
        
        const {id} =  req.params;
        const cartItem = await CartProductModel.find({userId:id}).populate('productId')

        res.status(200).json({
            data: cartItem,
            message: "cart item get successfull",
            error: false,
            success: true,
        });

    } catch (error) {
        res.status(500).json({ msg: error.message || error, error: true, success: false }); 
    }
}

export const updateCartItemQty = async(req,res)=>{
    try {
        // const {userId} = req.params;
        const { id,qty } = req.body

        if(! id ||  !qty){
            return res.status(400).json({
                message : "provide _id, qty"
            })
        }

        const updateCartitem = await CartProductModel.updateOne({
            _id : id,
        },{
            quantity : qty
        })

        return res.json({
            message : "Update cart",
            success : true,
            error : false, 
            data : updateCartitem
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


export const deleteCartItemQty = async(req,res)=>{
    try {
      const { id  , qty} = req.body 
      if(! id ||  !qty){
        return res.status(400).json({
            message : "provide _id, qty"
        })
    }
      
      if(!id){
        return res.status(400).json({
            message : "Provide _id",
            error : true,
            success : false
        })
      }

      const deleteCartItem  = await CartProductModel.updateOne({
        _id : id,
    },{
        quantity : qty
    })

      return res.json({
        message : "Item remove",
        error : false,
        success : true,
        data : deleteCartItem
      })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// delete cart item
export const deleteCart = async (req, res) => {
    try {
      const { id } = req.params; // User ID
      const { productId } = req.body; // Product to be removed from the cart
  
      if (!id) {
        return res.status(400).json({
          message: "User ID is required",
          error: true,
          success: false,
        });
      }
  
      if (!productId) {
        return res.status(400).json({
          message: "Product ID is required",
          error: true,
          success: false,
        });
      }
      const deleteProduct = await CartProductModel.deleteOne({productId});
  
      // Update user's shopping cart: Remove the specific product
      const updateCart = await UserModel.updateOne(
        { _id: id },
        { $pull: { shopping_cart: productId } } // Use $pull to remove a specific product
      );
  
      if (updateCart.modifiedCount === 0) {
        return res.status(404).json({
          message: "Product or User not found in the cart",
          error: true,
          success: false,
        });
      }
  
      res.status(200).json({
        message: "Product removed from cart successfully",
        error: false,
        success: true,
        updateCart,
        deleteProduct,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Server error",
        error: true,
        success: false,
      });
    }
  };
  