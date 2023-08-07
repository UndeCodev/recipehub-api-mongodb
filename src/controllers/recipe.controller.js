import { isValidObjectId } from "mongoose";
import { uploadImage } from "../utils/imagekit";

// Models
import Recipe from "../models/Recipe";
import Category from "../models/Category";
import User from "../models/User";

export const getRecipes = async(req, res) => {
  try {
    const recipes = await Recipe.find()
                                .select('title category totalTime images')
                                .populate({
                                  path: 'author',
                                  select: 'name rol images',
                                  populate: [
                                    { path: 'rol', select: ({ _id: 0 }) }
                                  ]
                                })
                                .populate({
                                  path: 'category',
                                  select: ({ _id: 0, photoURL: 0 })
                                })

                                
    if(!recipes.length) return res.status(404).json({ message: 'No hay recetas por mostrar.' });

    res.json(recipes);
  }catch(error) {
    res.status(409).json({ message: error.message });
  }
}

export const getRecipeById = async(req, res) => {
  const { id } = req.params;

  try {
    if(!isValidObjectId(id)) return res.status(400).json({ message: 'El id proporcionado no es válido.' });

    const recipeFound = await Recipe.findById(id);
    if(!recipeFound) return res.status(404).json({ message: 'No se encontró ninguna receta con este id.' });

    res.json(recipeFound);
  }catch(error){
    res.status(409).json({ message: error.message });
  }
}

export const getRecipesByAuthor = async(req, res) => {
  const { id } = req.params;
  
  try {
    if(!id) return res.status(404).json({ message: 'Falta el ID del autor.' });
    if(!isValidObjectId(id)) return res.status(400).json({ message: 'El ID del autor proporcionado no es válido.' });

    const userFound = await User.findOne({ _id: { $in: id } })
                                .populate({
                                  path: 'recipes',
                                  select: 'title category totalTime author images',
                                  populate: [
                                    {
                                      path: 'author',
                                      select: 'name images rol',
                                      populate: { path: 'rol', select: ({ _id: 0 }) },                                      
                                    },
                                    { path: 'category', select: ({ _id: 0 }) },
                                  ]
                                })
                                .select('recipes')

    if(!userFound) return res.status(404).json({ message: 'No se encontró ningún usuario con este ID.' });

    res.json(userFound.recipes);
  }catch(error){
    res.status(409).json({ message: error.message });
  }
}

export const updateRecipe = async(req, res) => {
  const { id } = req.params;
  const { category } = req.body;
 
  try {
    if(!isValidObjectId(id)) return res.status(400).json({ message: 'El id proporcionado no es válido.' });
    if(!category) return res.status(400).json({ message: 'Falta el campo de la categoría a modificar.' });

    const categoryUpdated = await Category.findByIdAndUpdate(id, { category }, { new: true });
    if(!categoryUpdated) return res.status(404).json({ message: 'No se encontró ninguna categoría con este id.' });

    res.json(categoryUpdated);
  }catch(error) {
    res.status(409).json({ message: error.message });
  }
}

export const deleteRecipe = async(req, res) => {
  const { id } = req.params;

  try {
    if(!isValidObjectId(id)) return res.status(400).json({ message: 'El id proporcionado no es válido.' });
    
    const recipeDeleted = await Recipe.findByIdAndDelete(id);
    if(!recipeDeleted) return res.status(404).json({ message: 'No se encontró ninguna receta con este id.' });

    await User.findByIdAndUpdate(recipeDeleted.author, {
      $pull: { recipes: recipeDeleted._id }
    });

    res.sendStatus(204);
  }catch(error) {
    res.status(409).json({ message: error.message });
  }
}

// Create recipe 
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
    title, description, userId, category, videoURL, 
    servings, yieldRecipe, totalTime, 
  } = req.body;

  const { files } = req;

  try {
    // Validations
    validateFields(req, res, ["title", "description", "userId", "category", "servings", "totalTime", "ingredients", "steps", "times", ]);
    const { ingredients, steps, times } = parseAndValidateArrays(req, res, ['ingredients', 'steps', 'times']);

    if(!files[0]) return res.status(404).json({ message: 'Imagen de portada de receta necesaria.' });
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

    const authorFound = await User.findOne({ _id: { $in: userId } });
    if(!authorFound) return res.status(404).json({ message: 'Autor no encontrado.' });   
    
    newRecipe.author = authorFound._id;

    // Optional parameters
    newRecipe.yieldRecipe ??= yieldRecipe;
    newRecipe.videoURL    ??= videoURL;

    // Upload cover recipe
    const { fileId, photoURL, thumbnailUrl } = await uploadImage({
      folder: 'recipes',
      filePath: files[0].path,
      fileName: files[0].filename,
    });

    newRecipe.images = {
      fileId,
      photoURL,
      thumbnailUrl
    };

    const recipeSaved = await newRecipe.save();
    
    const res = await User.findByIdAndUpdate(newRecipe.author, {
      $push: { recipes: recipeSaved._id }
    });
    if(!res) return res.status(404).json({ message: 'No se pudo guardar.' });   

    res.json({ recipeSaved });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}