import { Router } from 'express';

import * as recipeController from '../controllers/recipe.controller';
import { multerUpload } from '../utils/multer';

const router = Router();

router.get('/', recipeController.getRecipes);
router.get('/search', recipeController.searchTerm);
router.get('/:id', recipeController.getRecipeById);
router.get('/category/:category', recipeController.getRecipeByName);
router.get('/author/:id', recipeController.getRecipesByAuthor);

router.post('/', multerUpload.single('fileImage'), recipeController.createRecipe);
router.delete('/:id', recipeController.deleteRecipe);

export default router;