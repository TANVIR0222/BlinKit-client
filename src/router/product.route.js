import {Router} from 'express'
import { createProduct, getAllProducts, getProductByCategory } from '../controller/product.controller.js';

const productRouter = Router();

productRouter.post('/add-product' , createProduct)
productRouter.get('/all-product' , getAllProducts)
productRouter.post('/get-product-by-category' , getProductByCategory)

export default productRouter;  //exportando o router para ser usado em outro arquivo.  //export