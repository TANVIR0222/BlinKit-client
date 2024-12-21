import {Router} from 'express'
import { cashOnDelivery } from '../controller/order.controller.js';

const orderRouter = Router()

orderRouter.post('/cash-on-delivery/:id' , cashOnDelivery)

export default orderRouter;