import jwt from "jsonwebtoken";
import User from "../models/User";
import Roles from "../models/Role";

import { uploadImage } from '../utils/imagekit';
import { SECRET } from "../utils/config";

import { getAuth } from 'firebase-admin/auth';
import '../utils/firebase';

export const verifyToken = async(req, res) => {
    // const { providerId } = req.body
    const token = req.headers['x-access-token'];
    
    try {
        if(!token) return res.status(404).json({ message: 'Ningún token proporcionado.' });
        // if(!providerId) return res.status(404).json({ message: 'Ningún proveedor proporcionado.' });

        const { user } = jwt.verify(token, SECRET);

        const userFound = await User.findOne({ email: { $in: user.email } });
        if(!userFound) return res.status(409).json({ message: `Usuario no encontrado.` });

        res.sendStatus(204);
    }catch(error) {
        console.log(error);
        res.status(409).json({ message: error.message });
    }
}

export const signIn = async(req, res) => {
    const { email, password } = req.body;

    try {

        const userFound = await User.findOne({ email: { $in: email } })
                                    .select({ createdAt: 0, updatedAt: 0 })
                                    .populate('rol')
                                    .lean();

        if(!userFound) return res.status(404).json({ message: 'Usuario no encontrado.' });

        const matchPassword = await User.comparePassword(password, userFound.password);
        if(!matchPassword) return res.status(401).json({ message: 'El correo electrónico o la contraseña no coinciden.' });

        delete userFound.password

        const token = jwt.sign(
            { user: userFound },
            SECRET,
            { expiresIn: 86400 }
        );
        
        res.json({ token });

    }catch(error) {
        res.status(409).json({ message: error.message })   
    }
}

export const signUp = async(req, res) => {
    const { name, email, password, rol } = req.body;
    const { file } = req;

    try {
        if(!file) return res.status(404).json({ message: 'Imagen de perfil necesaria.' });

        const userFound = await User.findOne({ email: { $in: email } })
        if(userFound) return res.status(409).json({ message: `El correo electrónico ${email} ya está registrado.` });
        
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
            { user: userSaved },
            SECRET,
            { expiresIn: 86400 }
        );
        
        res.json({ token });
        
    }catch(error) {
        res.status(409).json({ message: error.message });
    }
}

export const signInWithProvider = async(req, res) => {
    const { uid } = req.body;

    try {
        const userFound = await User.findOne({ 'providerInformation.uid': uid });
        if(!userFound) return res.status(409).json({ message: `El usuario aún no está registrado.` });

        const token = jwt.sign(
            { user: userFound },
            SECRET,
            { expiresIn: 86400 }
        );
        
        res.json({ token });
    }catch(error) {
        res.status(409).json({ message: error.message });   
    }
}

export const signUpWithProvider = async(req, res) => {
    const { uid, name, email, photoURL, providerId, rol } = req.body;

    try {
        const userFound = await User.findOne({ email: { $in: email } })
        if(userFound) return res.status(409).json({ message: `El correo electrónico ${email} ya está registrado.` });

        const newUser = new User({
            name,
            email,
            images: {
                photoURL
            },
            providerInformation: {
                providerId,
                uid
            },
        });

        if(rol){
            const foundRol = await Roles.findOne({ name: { $in: rol } });
            if(!foundRol) return res.status(404).json({ message: 'Rol no encontrado.' });

            newUser.rol = foundRol._id;
        }else{
            const role = await Roles.findOne({ name: 'Usuario' });
            newUser.rol = role._id;
        }

        const userSaved = await newUser.save();

        const token = jwt.sign(
            { user: userSaved },
            SECRET,
            { expiresIn: 86400 }
        );
        
        res.json({ token });
    }catch(error) {
        res.status(409).json({ message: error.message });   
    }
}