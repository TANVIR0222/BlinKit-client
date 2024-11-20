import {Router} from 'express'
import { addSubCategory } from '../controller/subCategory.controller.js';

const subCategoryRoute = Router();

subCategoryRoute.post("/add-sub-category", addSubCategory);

export default subCategoryRoute