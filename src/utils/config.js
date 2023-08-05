import { config } from 'dotenv';

config();

export const MONGODB_URI = process.env.MONGODB_URI;

export const  PUBLIC_KEY   = process.env.PUBLIC_KEY;
export const  PRIVATE_KEY  = process.env.PRIVATE_KEY;
export const  URL_ENDPOINT = process.env.URL_ENDPOINT;

export const  SECRET = process.env.SECRET;