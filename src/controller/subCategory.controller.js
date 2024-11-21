import SubCategoryModel from "../model/subCategory.model.js";

export const addSubCategory = async (req, res) => {
  try {
    const { name, image, category } = req.body;

    console.log(name, image, category);

    if (!name && !image && !category[0]) {
      return res.status(400).json({
        message: "Provide name, image, category",
        error: true,
        success: false,
      });
    }

    const payload = {
      name,
      image,
      category,
    };

    const createSubCategory = new SubCategoryModel(payload);
    const save = await createSubCategory.save();

    return res.json({
      message: "Sub Category Created",
      data: save,
      error: false,
      success: true,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getAllSubCategories = async (req, res) => {
  try {
    const categorys = await SubCategoryModel.find();
    res.status(201).json({
      categorys,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;    
    if (!id) {
      return res.status(400).json({
        message: "Id not found",
        error: true,
        success: false,
      });
    }

    const deleteSubCategory = await SubCategoryModel.findByIdAndDelete(id);
    res.status(201).json({
      message: "Delete Sub Category SuccessFull",
      deleteSubCategory,
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
};
