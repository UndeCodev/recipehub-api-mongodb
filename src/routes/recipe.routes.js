import { Router } from 'express';

import * as recipeController from '../controllers/recipe.controller';
import { multerUpload } from '../utils/multer';

const router = Router();

router.post('/', multerUpload.single('fileImage'), recipeController.createRecipe);

export default router; 