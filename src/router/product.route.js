import {Router} from 'express'
import { createProduct, getAllProducts, getProductByCategory, getSingleProductById, searchProduc } from '../controller/product.controller.js';

const productRouter = Router();

productRouter.post('/add-product' , createProduct)
productRouter.get('/all-product' , getAllProducts)
productRouter.post('/get-product-by-category' , getProductByCategory)
productRouter.get('/get-single-product-by-id/:id' , getSingleProductById)
productRouter.get('/search-product' , searchProduc)

export default productRouter;  //exportando o router para ser usado em outro arquivo.  //export