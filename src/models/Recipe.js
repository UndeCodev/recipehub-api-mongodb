import { Schema, model } from 'mongoose';

const recipeSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  description: {
    type: String,
    required: true
  },
  videoURL: String,
  ingredients: {
    type: Array,
    required: true
  },
  steps: {
    type: Array,
    required: true
  },
  times: {
    type: Array,
    required: true
  },
  totalTime: {
    type: String,
    required: true
  },
  servings: {
    type: String,
    required: true
  },
  yieldRecipe: String,
  coverRecipe: {
    type: String,
    required: true
  },
  images: {
    type: Object,
    required: true
  },
}, {
  versionKey: false,
  timestamps: true
});

export default model('Recipes', recipeSchema);