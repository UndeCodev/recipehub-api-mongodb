import { isValidObjectId } from 'mongoose';
import Category from '../models/Category';

export const getCategories = async(req, res) => {
  try {
    const categories = await Category.find();
    if(!categories.length) return res.status(404).json({ message: 'No se encontraron las categorías.' })
    
    res.json(categories);
  }catch(error) {
    res.status(409).json({ message: error.message });
  }
}

export const getCategoryById = async(req, res) => {
  const { id } = req.params;

  try {
    if(!isValidObjectId(id)) return res.status(400).json({ message: 'El id proporcionado no es válido.' });

    const categoryFound = await Category.findById(id);
    if(!categoryFound) return res.status(404).json({ message: 'No se encontró ninguna categoría con este id.' });

    res.json(categoryFound);
  }catch(error){
    res.status(409).json({ message: error.message });
  }
}

export const createCategory = async(req, res) => {
  const { category } = req.body;
  
  try {    
    if(!category) return res.status(400).json({ message: 'Falta la categoría a insertar.' }); 

    const categoryFound = await Category.findOne({ category });
    if(categoryFound) return res.status(409).json({ message: 'Esta categoría ya existe.' }); 

    await new Category({ category }).save();

    res.sendStatus(201);
  }catch(error) {
    res.status(409).json({ message: error.message });
  }
}

export const updateCategory = async(req, res) => {
  const { id } = req.params;
  const { category, photoURL } = req.body;
 
  try {
    if(!isValidObjectId(id)) return res.status(400).json({ message: 'El id proporcionado no es válido.' });
    // if(!category || !photoURL) return res.status(400).json({ message: 'Falta el campo de la categoría a modificar.' });

    const categoryUpdated = await Category.findByIdAndUpdate(id, { category, photoURL }, { new: true });
    if(!categoryUpdated) return res.status(404).json({ message: 'No se encontró ninguna categoría con este id.' });

    res.json(categoryUpdated);
  }catch(error) {
    res.status(409).json({ message: error.message });
  }
}

export const deleteCategory = async(req, res) => {
  const { id } = req.params;

  try {
    if(!isValidObjectId(id)) return res.status(400).json({ message: 'El id proporcionado no es válido.' });
    
    const categoryDeleted = await Category.findByIdAndDelete(id);
    if(!categoryDeleted) return res.status(404).json({ message: 'No se encontró ninguna categoría con este id.' });

    res.sendStatus(204);
  }catch(error) {
    res.status(409).json({ message: error.message });
  }
}
