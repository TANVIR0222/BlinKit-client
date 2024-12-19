import {Router} from 'express'
import { addAddrress } from '../controller/address.controller.js';
const addressRouter = Router()

addressRouter.post('/add-address/:id' , addAddrress)

export default addressRouter;

