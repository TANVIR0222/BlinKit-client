import {Router} from 'express'
import { loginUser, logoutUser, register, verifyEmail } from '../controller/user.controller.js';
import auth from '../middleware/aurh.middleware.js';

const userRoute = Router();

userRoute.post('/register', register)
userRoute.post('/verifyEmail/:id', verifyEmail)
userRoute.post('/login', loginUser)
userRoute.get('/logout', auth , logoutUser)

export default userRoute;