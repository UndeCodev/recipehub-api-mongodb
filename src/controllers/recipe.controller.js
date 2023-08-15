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
                                  select: ({ _id: 0 })
                                })

                                
    if(!recipes.length) return res.status(404).json({ message: 'No hay recetas por mostrar.' });

    res.json(recipes);
  }catch(error) {
    res.status(409).json({ message: error.message });
  }
}

export const getRecipeByName = async(req, res) => {
  const { category } = req.params;

  try {
    if(!category) return res.status(400).json({ message: 'Falta la categoría a buscar.' });

    const categoryFound = await Category.findOne({ category: { $in: category } });
    if(!categoryFound) return res.status(404).json({ message: 'No se encontró ninguna categoría con este nombre.' });

    const recipesFound = await Recipe.find({ category: { $in: categoryFound._id } })
                                     .select('title category totalTime images')
                                     .populate({ path: 'category', select: ({ _id: 0 }) })
                                     .populate({
                                        path: 'author',
                                        select: 'name images rol',
                                        populate: { path: 'rol', select: ({ _id: 0 }) },                                      
                                      })
    if(!recipesFound) return res.status(404).json({ message: 'No se encontraron recetas con esta categoría.' });

    res.json(recipesFound);
  }catch(error){
    res.status(409).json({ message: error.message });
  }
}

export const getRecipeById = async(req, res) => {
  const { id } = req.params;

  try {
    if(!id) return res.status(400).json({ message: 'Falta la categoría a buscar.' });

    const recipeFound = await Recipe.findById(id)
                                    .populate({ path: 'category', select: ({ _id: 0 }) })
                                    .populate({
                                      path: 'author',
                                      select: 'name images rol',
                                      populate: { path: 'rol', select: ({ _id: 0 }) },                                      
                                    })
    if(!recipeFound) return res.status(404).json({ message: 'No se encontró ninguna receta con este ID.' });

    res.json(recipeFound);
  }catch(error){
    res.status(409).json({ message: error.message });
  }
}

export const searchTerm = async(req, res) => {
  const { searchTerm } = req.query 
  
  try {
    if(!searchTerm) return res.json(null)

    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { category: await Category.findOne({ category: { $regex: searchTerm, $options: 'i' } }).select('_id') }
      ]
    }).select('_id title').limit(5);
    
    res.json(recipes);
  } catch (error) {
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

export const createRecipe = async(req, res) => {
  const {
    title, description, category, servings, yieldRecipe,
    totalTime, ingredients, steps, times, 
    videoURL, userId
  } = req.body

  const { file } = req

  try {
    // Validations
    if(!file) return res.status(404).json({ message: 'Imagen de portada de receta necesaria.' });
    if(!isValidObjectId(category)) return res.status(404).json({ message: 'Id de la categoría no válido.' });

    const recipeFound = await Recipe.findOne({ title: { $in: title } });
    if(recipeFound) return res.status(404).json({ message: 'Ya existe una receta con este nombre.' }); 

    const categoryFound = await Category.findById(category);
    if(!categoryFound) return res.status(404).json({ message: 'Categoría no encontrada.' }); 

    if(!isValidObjectId(userId)) return res.status(404).json({ message: 'Id del usuario no válido.' });

    const authorFound = await User.findOne({ _id: { $in: userId } });
    if(!authorFound) return res.status(404).json({ message: 'Autor no encontrado.' });   
    
    // Body of the new recipe
    const newRecipe = new Recipe({
      title,
      description,
      category: categoryFound._id,
      servings,
      totalTime,
      ingredients: JSON.parse(ingredients),
      steps: JSON.parse(steps),
      times: JSON.parse(times),
      author: authorFound._id
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

    const recipeSaved = await newRecipe.save();
    
    const userUpdated = await User.findByIdAndUpdate(newRecipe.author, {
      $push: { recipes: recipeSaved._id }
    });

    if(!userUpdated) return res.status(404).json({ message: 'No se pudo guardar la receta con el usuario.' });   

    res.json(recipeSaved);
  }catch(error) {
    res.status(409).json({ message: error.message });
  }
}
