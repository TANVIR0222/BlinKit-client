import uploadeImageCloudinary from "../utils/uploadeImageCloudinary.js";

const uploadeImage = async(req,res) => {

    try {
        const file = req.file;        
        const uploadImage = await uploadeImageCloudinary(file)
        return res.json({
            message : "Upload done",
            data: uploadImage,
            success : true,
            error : false
        })
        
    } catch (error) {        
        return res
        .status(500)
        .json({ msg: error.message || error, error: true, success: false });
    }
}

export default uploadeImage;