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
    password: String,
    images: {
        type: Object,
        required: true
    },
    rol: {
        type: Schema.Types.ObjectId,
        ref: "Role",
    },
    recipes: [{
        type: Schema.Types.ObjectId,
        ref: "Recipes",
    }],
    providerInformation: Object
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