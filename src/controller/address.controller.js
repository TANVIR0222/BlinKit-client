import AddressModel from "../model/address.model.js";
import UserModel from "../model/user.model.js";

export const addAddrress = async(req,res) => {

    try {
        const {id} = req.params;        
        const {addressline,city,state,pincode,country,mobile} = req.body;
        if (!addAddrress || !city || !state || !pincode || !country || !mobile) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }        
        const newAddress = new AddressModel({
            address_line: addressline,
            city,
            state,
            pincode,
            country,
            mobile,
            userId:id
        })

        const userAddress = await newAddress.save();
        const updateUserAddress = await UserModel.updateOne(
            { _id: id },
            { $push: { address_details: userAddress._id } } // Use $push to remove a specific product
        );


        return res.status(201).json({
            msg: "Address Create Success",
            error: false,
            success: true,
            data: userAddress,
            user: updateUserAddress,
        });

    } catch (error) {
        res
        .status(500)
        .json({ msg: error.message || error, error: true, success: false });
    }
}

export const getAddressSingleUser = async(req,res) =>{
    try {
        
        const {id} =  req.params;
        const userAddress = await AddressModel.find({userId:id}).sort({createdAt : -1});

        res.status(200).json({
            data: userAddress,
            message: "cart item get successfull",
            error: false,
            success: true,
        });

    } catch (error) {
        res.status(500).json({ msg: error.message || error, error: true, success: false }); 
    }
}

export const updateAddrress = async(req,res) => {

    try {
        const {id} = req.params;        
        const {addressline,city,state,pincode,country,mobile} = req.body;
              
        const updateAddress = await AddressModel.updateOne({_id : id},{
            address_line: addressline,
            city,
            state,
            pincode,
            country,
            mobile,
        })

        return res.status(201).json({
            msg: "Address Create Success",
            error: false,
            success: true,
            data: updateAddress,
        });

    } catch (error) {
        res
        .status(500)
        .json({ msg: error.message || error, error: true, success: false });
    }
}

export const deleteAddress = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message: "Id not found",
          error: true,
          success: false,
        });
      }
  
      const addressDelete = await AddressModel.findByIdAndDelete(id);
      res.status(201).json({
        message: "Delete Address SuccessFull",
        data: addressDelete,
        error: false,
        success: true,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: error.message || error, error: true, success: false });
    }
  };