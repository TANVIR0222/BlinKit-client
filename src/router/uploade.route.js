import {Router} from 'express'
import uploadeImage from '../controller/uploadeImage.controller.js';
import uploade from '../middleware/multer.js';

const uploadeImageRouter = Router();

uploadeImageRouter.post('/uploade/:id', uploade.single("image"),uploadeImage)

export default uploadeImageRouter;  //export the router to use it in app.js file