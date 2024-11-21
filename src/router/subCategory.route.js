import {Router} from 'express'
import { addSubCategory, getAllSubCategories } from '../controller/subCategory.controller.js';

const subCategoryRoute = Router();

subCategoryRoute.post("/add-sub-category", addSubCategory);
subCategoryRoute.get("/all-sub-category", getAllSubCategories);

export default subCategoryRoute