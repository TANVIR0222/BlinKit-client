import {Router} from 'express'
import { addAddrress, getAddressSingleUser, updateAddrress } from '../controller/address.controller.js';
const addressRouter = Router()

addressRouter.post('/add-address/:id' , addAddrress)
addressRouter.get('/get-single-address/:id' , getAddressSingleUser)
addressRouter.put('/update-address/:id' , updateAddrress)

export default addressRouter;

