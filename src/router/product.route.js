import {Router} from 'express'
import { createProduct, getAllProducts, getProductByCategory, getSingleProductById, searchProduc , getSubcategoryProductByCategory, updateProductDeatils } from '../controller/product.controller.js';

const productRouter = Router();

productRouter.post('/add-product' , createProduct)
productRouter.get('/all-product' , getAllProducts)
productRouter.post('/get-product-by-category' , getProductByCategory)
productRouter.get('/get-sub-category-product-by-category/:id' , getSubcategoryProductByCategory)
productRouter.get('/get-single-product-by-id/:id' , getSingleProductById)
productRouter.get('/search-product' , searchProduc)
productRouter.put('/update-product-deatils/:id' , updateProductDeatils)

export default productRouter;  //exportando o router para ser usado em outro arquivo.  //export