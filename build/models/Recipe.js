"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var recipeSchema = new _mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  images: {
    type: Object,
    required: true
  }
}, {
  versionKey: false,
  timestamps: true
});
var _default = (0, _mongoose.model)('Recipes', recipeSchema);
exports["default"] = _default;