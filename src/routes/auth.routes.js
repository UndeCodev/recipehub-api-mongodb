import { Router } from "express";
import { multerUpload } from "../utils/multer.js";

import * as authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/signup', multerUpload.single('fileImage'), authController.signUp);
router.post('/signin', authController.signIn);

export default router;  