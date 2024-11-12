import {Router} from 'express'
import { loginUser, register, verifyEmail } from '../controller/user.controller.js';

const userRoute = Router();

userRoute.post('/register', register)
userRoute.post('/login', loginUser)
userRoute.post('/verifyEmail/:id', verifyEmail)

export default userRoute;