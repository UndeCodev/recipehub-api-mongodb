import { Router } from 'express';

import * as recipeController from '../controllers/recipe.controller';
import { multerUpload } from '../utils/multer';

const router = Router();

router.get('/', recipeController.getRecipes);
router.get('/:category', recipeController.getRecipeByName);
router.get('/author/:id', recipeController.getRecipesByAuthor);

router.post('/', multerUpload.single('fileImage'), recipeController.createRecipe);
router.delete('/:id', recipeController.deleteRecipe);

export default router;