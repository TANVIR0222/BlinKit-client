import {Router} from 'express'
import { addToCartItem } from '../controller/cart.controller.js'

const cartRouter = Router()
cartRouter.post('/add-cart/:id' , addToCartItem)

export default cartRouter;  //export the router to use in other files 