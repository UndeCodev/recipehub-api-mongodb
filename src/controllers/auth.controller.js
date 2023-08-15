import jwt from "jsonwebtoken";
import User from "../models/User";
import Roles from "../models/Role";

import { uploadImage } from '../utils/imagekit';
import { SECRET, EMAIL, BASE_URL } from "../utils/config";

import transporter from '../utils/nodemailers';

export const verifyToken = async(req, res) => {
    const token = req.headers['x-access-token'];
    
    try {
        if(!token) return res.status(404).json({ message: 'Ningún token proporcionado.' });
        const { user } = jwt.verify(token, SECRET);

        const userFound = await User.findOne({ email: { $in: user.email } });
        if(!userFound) return res.status(409).json({ message: `Usuario no encontrado.` });

        res.sendStatus(204);
    }catch(error) {
        if (error.name === 'TokenExpiredError') {
            res.status(400).json({ message: 'El token proporcionado ha experido.' });
        }else if(error instanceof jwt.JsonWebTokenError){
            res.status(400).json({ message: 'El token es inválido.' });
        }else {
            res.status(409).json({ message: error.message });   
        }
    }
}

export const verifyResetToken = async(req, res) => {
    const token = req.headers['x-access-token'];
    
    try {
        if(!token) return res.status(404).json({ message: 'Ningún token proporcionado.' });
        const { id } = jwt.verify(token, SECRET);
        
        const userFound = await User.findById(id);
        if (!userFound) return res.status(404).json({ message: `No se encontró un usuario con este ID` });

        res.sendStatus(200);
    }catch(error) {
        if (error.name === 'TokenExpiredError') {
            res.status(400).json({ message: 'El token proporcionado ha experido.' });
        }else if(error instanceof jwt.JsonWebTokenError){
            res.status(400).json({ message: 'El token es inválido.' });
        }else {
            res.status(409).json({ message: error.message });   
        }
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

        const user = await User.findOne({ _id: { $in: userSaved._id } })
                                      .select({ createdAt: 0, updatedAt: 0, password: 0, recipes: 0 })
                                      .populate({
                                        path: 'rol',
                                        select: ({ _id: 0 })
                                      })
                                      .lean();

        const token = jwt.sign(
            { user },
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

export const passwordReset = async(req, res) => {
    const { email } = req.body
    
    try {
        const userFound = await User.findOne({ email });
        if (!userFound) return res.status(404).json({ message: `No se encontró un usuario con el correo ${email}` });
    
        const token = jwt.sign(
            { id: userFound._id },
            SECRET,
            { expiresIn: '15m' }
        );
        
        const sendEmail = await transporter.sendMail({
            from: `RecipeHub ${EMAIL}`,
            to: email,
            subject: 'Restablecimiento de contraseña',
            text: `Para restablecer su contraseña, haga clic en el siguiente enlace: \n${BASE_URL}/#/autenticacion/reset-password/${token}\n
            Este enlace es válido solo dentro de los 15 minutos.\n
            Si usted no ha solicitado el restablecimiento de su contraseña, haga caso omiso de este correo electrónico.    
            `
        })    

        if (!sendEmail) return res.status(404).json({ message: 'No se pudo enviar el correo electónico.' });

        res.sendStatus(204)
    }catch(error) {
        res.status(409).json({ message: error.message });   
    }
}


export const resetPassword = async(req, res) => {
    const { password } = req.body
    const { token }    = req.params
    
    try {
        if(!token) return res.status(404).json({ message: 'Ningún token proporcionado.' });
        if(!password) return res.status(404).json({ message: 'Nueva contraseña necesaria.' });

        const { id } = jwt.verify(token, SECRET);
        
        const userFound = await User.findById(id);
        if (!userFound) return res.status(404).json({ message: `No se encontró un usuario con este ID` });

        const hashedPassword = await User.encryptPassword(password)
        const userUpdated = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
        if(!userUpdated) return res.status(409).json({ message: 'No se pudo actualizar la contraseña.' });

        res.sendStatus(204)
    }catch(error) {
        if (error.name === 'TokenExpiredError') {
            res.status(400).json({ message: 'El enlace para restablecer su contraseña ha expirado' });
        }else if(error instanceof jwt.JsonWebTokenError){
            res.status(400).json({ message: 'El token es inválido.' });
        }else {
            res.status(409).json({ message: error.message });   
        }
    }
}