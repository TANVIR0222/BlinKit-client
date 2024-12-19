import {Router} from 'express'
import { addAddrress, getAddressSingleUser } from '../controller/address.controller.js';
const addressRouter = Router()

addressRouter.post('/add-address/:id' , addAddrress)
addressRouter.get('/get-single-address/:id' , getAddressSingleUser)

export default addressRouter;

