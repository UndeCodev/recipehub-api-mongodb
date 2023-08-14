import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  }
}, {
  versionKey: false
});

export default model('Category', categorySchema);