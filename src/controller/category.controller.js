import CategoryModel from "../model/category.model.js";

export const addCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      throw new Error("Please fill in all fields");
    }

    const newCategory = new CategoryModel({ name, image });
    await newCategory.save();
    res.status(201).json({
      message: "Category created successfully",
      error: false,
      success: true,
      newCategory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categorys = await CategoryModel.find();
    res.status(201).json({
      categorys,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    const updateCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { name, image },
      { new: true }
    );
    res.status(201).json({
      message: "Category updated successfully",
      error: false,
      success: true,
      updateCategory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ msg: "Category id is required", error: true });
    }

    const deleteProduct = await CategoryModel.findByIdAndDelete(id);

    res.status(201).json({
      message: "Category Delete successfully",
      error: false,
      success: true,
      deleteProduct,
    });
    
  } catch (error) {
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
};
