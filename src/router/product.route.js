import {Router} from 'express'
import { createProduct } from '../controller/product.controller.js';

const productRouter = Router();

productRouter.post('/add-product' , createProduct)

export default productRouter;  //exportando o router para ser usado em outro arquivo.  //export