import { config } from 'dotenv';
config();

export const MONGODB_URI = process.env.MONGODB_URI;

export const  PUBLIC_KEY   = process.env.PUBLIC_KEY;
export const  PRIVATE_KEY  = process.env.PRIVATE_KEY;
export const  URL_ENDPOINT = process.env.URL_ENDPOINT;

export const  SECRET = process.env.SECRET;

export const  FIREBASE_PROJECT_ID   = process.env.FIREBASE_PROJECT_ID;
export const  FIREBASE_PRIVATE_KEY  = process.env.FIREBASE_PRIVATE_KEY;
export const  FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;

export const  EMAIL = process.env.EMAIL;
export const  PASSWORD = process.env.PASSWORD;

export const  BASE_URL = process.env.BASE_URL;