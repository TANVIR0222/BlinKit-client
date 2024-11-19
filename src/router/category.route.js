import {Router} from 'express'
import { addCategory } from '../controller/category.controller.js'

const categoryRouter = Router()
categoryRouter.post('/add-category',addCategory)


export default categoryRouter;  //exporting the router to use in other files  //exporting the router