import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
  photoURL: {
    type: String,
    required: true
  }
}, {
  versionKey: false
});

export default model('Category', categorySchema);