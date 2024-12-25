import {Router} from 'express'
import { cashOnDelivery, getOrderDetails, stripePayment } from '../controller/order.controller.js';

const orderRouter = Router()

orderRouter.post('/cash-on-delivery/:id' , cashOnDelivery)
orderRouter.post('/checkout/:id' , stripePayment)
orderRouter.get('/order-details/:id' , getOrderDetails)

export default orderRouter;