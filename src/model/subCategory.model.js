import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    name : {
        type : String,
        default : ""
    },
    image : {
        type : String,
        default : ""
    },
    category : {
        type : String,
        default : ""
    }
},{
    timestamps : true
})

const SubCategoryModel = mongoose.model('SubCategory',subCategorySchema)

export default SubCategoryModel