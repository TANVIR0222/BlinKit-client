import {Router} from 'express'
import { addToCartItem, getCartItem, updateCartItemQty } from '../controller/cart.controller.js'

const cartRouter = Router()
cartRouter.post('/add-cart/:id' , addToCartItem)
cartRouter.get('/single-user-cart/:id' , getCartItem)
cartRouter.put('/single-user-cart-qty-update' , updateCartItemQty)

export default cartRouter;  //export the router to use in other files 