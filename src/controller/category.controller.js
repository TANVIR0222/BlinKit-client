import CategoryModel from "../model/category.model.js";

export const addCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    console.log(name, image);

    if (!name || !image) {
      throw new Error("Please fill in all fields");
    }

    const newCategory = new CategoryModel({ name, image });
    await newCategory.save();
    res
      .status(201)
      .json({
        message: "Category created successfully",
        error: false,
        success: true,
        newCategory,
      });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
};
