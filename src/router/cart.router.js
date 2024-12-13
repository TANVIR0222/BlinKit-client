import {Router} from 'express'
import { addToCartItem, deleteCartItemQty, getCartItem, updateCartItemQty } from '../controller/cart.controller.js'

const cartRouter = Router()
cartRouter.post('/add-cart/:id' , addToCartItem)
cartRouter.get('/single-user-cart/:id' , getCartItem)
cartRouter.put('/single-user-cart-qty-update' , updateCartItemQty)
cartRouter.put('/single-user-cart-qty-delete' , deleteCartItemQty)

export default cartRouter;  