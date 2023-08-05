import jwt from "jsonwebtoken";
import User from "../models/User";
import Roles from "../models/Role";

import { uploadImage } from '../utils/imagekit';
import { SECRET } from "../utils/config";

export const signUp = async(req, res) => {
    const { name, email, password, rol } = req.body;
    const { file } = req;

    try {
        if(!file) return res.status(404).json({ message: 'Imagen de perfil necesaria.' });

        const userFound = await User.findOne({ email: { $in: email } })
        if(userFound) return res.status(409).json({ message: 'Este correo electrónico ya está en uso.' });
        
        const newUser = new User({
           name,
           email,
           password: await User.encryptPassword(password)
        });      

        if(rol){
            const foundRol = await Roles.findOne({ name: { $in: rol } });
            if(!foundRol) return res.status(404).json({ message: 'Rol no encontrado.' });

            newUser.rol = foundRol._id;
        }else{
            const role = await Roles.findOne({ name: 'Usuario' });
            newUser.rol = role._id;
        }

        const { fileId, photoURL, thumbnailUrl } = await uploadImage({
            folder: 'profiles',
            filePath: file.path,
            fileName: file.filename,
        });

        newUser.images = {
            fileId,
            photoURL,
            thumbnailUrl
        };

        const userSaved = await newUser.save();

        const token = jwt.sign(
            { id: userSaved._id },
            SECRET,
            { expiresIn: 86400 }
        );
        
        res.json({ token });
        
    }catch(error) {
        res.status(409).json({ message: error.message });
    }
}

export const signIn = async(req, res) => {
    const { email, password } = req.body;

    try {

        const userFound = await User.findOne({ email: { $in: email } })
        if(!userFound) return res.status(404).json({ message: 'Usuario no encontrado.' });

        const matchPassword = await User.comparePassword(password, userFound.password);
        if(!matchPassword) return res.status(401).json({ message: 'El correo electrónico o la contraseña no coinciden.' });

        const token = jwt.sign(
            { id: userFound._id },
            SECRET,
            { expiresIn: 86400 }
        );
        
        res.json({ token });

    }catch(error) {
        res.status(409).json({ message: error.message })   
    }
}