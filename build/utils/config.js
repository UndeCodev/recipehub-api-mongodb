"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.URL_ENDPOINT = exports.SECRET = exports.PUBLIC_KEY = exports.PRIVATE_KEY = exports.MONGODB_URI = exports.FIREBASE_PROJECT_ID = exports.FIREBASE_PRIVATE_KEY = exports.FIREBASE_CLIENT_EMAIL = void 0;
var _dotenv = require("dotenv");
(0, _dotenv.config)();
var MONGODB_URI = process.env.MONGODB_URI;
exports.MONGODB_URI = MONGODB_URI;
var PUBLIC_KEY = process.env.PUBLIC_KEY;
exports.PUBLIC_KEY = PUBLIC_KEY;
var PRIVATE_KEY = process.env.PRIVATE_KEY;
exports.PRIVATE_KEY = PRIVATE_KEY;
var URL_ENDPOINT = process.env.URL_ENDPOINT;
exports.URL_ENDPOINT = URL_ENDPOINT;
var SECRET = process.env.SECRET;
exports.SECRET = SECRET;
var FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
exports.FIREBASE_PROJECT_ID = FIREBASE_PROJECT_ID;
var FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY;
exports.FIREBASE_PRIVATE_KEY = FIREBASE_PRIVATE_KEY;
var FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
exports.FIREBASE_CLIENT_EMAIL = FIREBASE_CLIENT_EMAIL;