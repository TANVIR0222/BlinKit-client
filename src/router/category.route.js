import {Router} from 'express'
import { addCategory, getAllCategories, updateCategory } from '../controller/category.controller.js'

const categoryRouter = Router()
categoryRouter.post('/add-category',addCategory)
categoryRouter.get('/all-category',getAllCategories)
categoryRouter.put('/update-category/:id',updateCategory)


export default categoryRouter;  //exporting the router to use in other files  //exporting the router