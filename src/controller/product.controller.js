import ProductModel from "../model/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = req.body;

    if (
      !name ||
      !image[0] ||
      !category[0] ||
      !subCategory[0] ||
      !unit ||
      !price ||
      !description
    ) {
      return res.status(400).json({
        message: "Enter required fields",
        error: true,
        success: false,
      });
    }

    const product = await ProductModel({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    });
    await product.save();
    res.status(201).json({
      message: "Product created successfully",
      error: false,
      success: true,
      product,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
};

export const getAllProducts = async (req, res) => {
  // API to fetch all products with pagination and search
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Build search query
    const searchQuery = search
      ? {name: { $regex: search, $options: "i" }} // Case-insensitive search
      : {};

    // Fetch products with pagination
    const products = await ProductModel.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Total count for pagination
    const total = await ProductModel.countDocuments(searchQuery);

    res.json({
      products,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
};

export const  getProductByCategory = async(req,res) => {
  try {
    
    const { id } = req.body 

    if(!id){
        return res.status(400).json({
            message : "provide category id",
            error : true,
            success : false
        })
    }

    const product = await ProductModel.find({ 
        category : { $in : id }
    }).limit(15)

    return res.json({
        message : "category product list",
        data : product,
        error : false,
        success : true
    })

  } catch (error) {
    console.log(error);
    
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
}

export const  getSubcategoryProductByCategory = async(req,res) => {
  try {
    
    const { id } = req.params 

    if(!id){
        return res.status(400).json({
            message : "provide category id",
            error : true,
            success : false
        })
    }

    const product = await ProductModel.find({ 
        category : { $in : id }
    }).limit(15)

    return res.json({
        message : "category product list",
        data : product,
        error : false,
        success : true
    })

  } catch (error) {
    console.log(error);
    
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
}

export const  getSingleProductById = async(req,res) => {
  try {
    const { id } = req.params 

    if(!id){
        return res.status(400).json({
            message : "provide category id",
            error : true,
            success : false
        })
    }

    const product = await ProductModel.findById(id)

    return res.json(product)
  } catch (error) {
    console.log(error);

     res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
}

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

export const searchProduc = async (req, res) => {
  try {
    const {search = '' , page = 1 , limit = 12 } = req.query;

    const product =  await ProductModel.find({name: {$regex : search , $options: 'i'} })
    .limit(parseInt(limit))
    .skip((page - 1) * limit )
    .exec();

    const total = await ProductModel.countDocuments();
    

    res.status(201).json({product , totalPage: Math.ceil(total / limit) , currentPage: parseInt(page) ,success: true , error:false});

  } catch (error) {
    res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
}
