import {Router} from 'express'
import { addToCartItem, getCartItem } from '../controller/cart.controller.js'

const cartRouter = Router()
cartRouter.post('/add-cart/:id' , addToCartItem)
cartRouter.get('/single-user-cart/:id' , getCartItem)

export default cartRouter;  //export the router to use in other files 