import { Router } from "express";
import { multerUpload } from "../utils/multer.js";

import * as authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/signup', multerUpload.single('fileImage'), authController.signUp);
router.post('/signup-provider', authController.signUpWithProvider);

router.post('/signin', authController.signIn);
router.post('/signin-provider', authController.signInWithProvider);

router.get('/verify-token', authController.verifyToken);
router.get('/verify-reset-token', authController.verifyResetToken);

router.post('/password-reset', authController.passwordReset);
router.post('/reset-password/:token', authController.resetPassword);

export default router;  