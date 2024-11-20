import SubCategoryModel from "../model/subCategory.model.js";

export const addSubCategory = async(req,res)=>{
    try {
        const { name, image ,category} = req.body 

        console.log(name,image,category);
        
        if(!name && !image && !category[0]){
            return res.status(400).json({
                message : "Provide name, image, category",
                error : true,
                success : false
            })
        }

        const payload = {
            name,
            image,
            category
        }

        const createSubCategory = new SubCategoryModel(payload)
        const save = await createSubCategory.save()

        return res.json({
            message : "Sub Category Created",
            data : save,
            error : false,
            success : true
        })

    } catch (error) {
        // console.log(error);
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


  