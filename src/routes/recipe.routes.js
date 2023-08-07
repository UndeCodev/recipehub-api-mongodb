import { Router } from 'express';

import * as recipeController from '../controllers/recipe.controller';
import { multerUpload } from '../utils/multer';

const router = Router();

router.get('/', recipeController.getRecipes);
router.get('/:id', recipeController.getRecipeById);
router.get('/author/:id', recipeController.getRecipesByAuthor);

router.post('/', multerUpload.any(), recipeController.createRecipe);
router.delete('/:id', recipeController.deleteRecipe);

export default router; 