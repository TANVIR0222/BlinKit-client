import {Router} from 'express'
import { addSubCategory, deleteSubCategory, getAllSubCategories, updateSubCategory } from '../controller/subCategory.controller.js';

const subCategoryRoute = Router();

subCategoryRoute.post("/add-sub-category", addSubCategory);
subCategoryRoute.get("/all-sub-category", getAllSubCategories);
subCategoryRoute.delete("/delete-sub-category/:id", deleteSubCategory);
subCategoryRoute.put("/update-sub-category/:id", updateSubCategory);

export default subCategoryRoute