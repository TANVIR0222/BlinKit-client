import {Router} from 'express'
import { createProduct, getAllProducts } from '../controller/product.controller.js';

const productRouter = Router();

productRouter.post('/add-product' , createProduct)
productRouter.get('/all-product' , getAllProducts)

export default productRouter;  //exportando o router para ser usado em outro arquivo.  //export