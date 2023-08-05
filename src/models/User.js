import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    images: {
        type: Object,
        required: true
    },
    rol: {
        type: Schema.Types.ObjectId,
        ref: "Role",
    } 
}, {
    versionKey: false,
    timestamps: true
});

userSchema.statics.encryptPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
userSchema.statics.comparePassword = async(password, receivedPassword) => await bcrypt.compare(password, receivedPassword); 

export default model('User', userSchema);