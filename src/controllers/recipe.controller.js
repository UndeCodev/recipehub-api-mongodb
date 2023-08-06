import { isValidObjectId } from "mongoose";
import { uploadImage } from "../utils/imagekit";

// Models
import Recipe from "../models/Recipe";
import Category from "../models/Category";

const validateFields = (req, res, fields) => {
  for (const field of fields) {
    if (!req.body[field]) {
      return res.status(404).json({message: `El campo ${field} es obligatorio para crear una receta.`,});
    }
  }
};

const parseAndValidateArrays = (req, res, fields) => {
  const parsedFields = {};

  for (const field of fields) {
      parsedFields[field] = JSON.parse(req.body[field]);
      if (!Array.isArray(parsedFields[field])) {
          return res.status(400).json({ message: `El campo ${field} debe de ser un arreglo de objetos.` });
      }
  }

  return parsedFields;
}

export const createRecipe = async (req, res) => {
  const { 
    title, description, category, videoURL, 
    servings, yieldRecipe, totalTime
  } = req.body;

  const { file } = req;

  try {
    // Validations
    validateFields(req, res, ["title", "description", "category", "servings", "totalTime", "ingredients", "steps", "times", ]);
    const { ingredients, steps, times } = parseAndValidateArrays(req, res, ['ingredients', 'steps', 'times']);

    if(!file) return res.status(404).json({ message: 'Imagen de portada de receta necesaria.' });
    if(!isValidObjectId(category)) return res.status(404).json({ message: 'Id de la categoría no válido.' });
  
    const categoryFound = await Category.findById(category);
    if(!categoryFound) return res.status(404).json({ message: 'Categoría no encontrada.' }); 

    // Body of the new recipe
    const newRecipe = new Recipe({
      title,
      description,
      category: categoryFound._id,
      servings,
      totalTime,
      ingredients,
      steps,
      times,
    });

    // Optional parameters
    newRecipe.yieldRecipe ??= yieldRecipe;
    newRecipe.videoURL    ??= videoURL;

    // Upload cover recipe
    const { fileId, photoURL, thumbnailUrl } = await uploadImage({
      folder: 'recipes',
      filePath: file.path,
      fileName: file.filename,
    });

    newRecipe.images = {
      fileId,
      photoURL,
      thumbnailUrl
    };

    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
