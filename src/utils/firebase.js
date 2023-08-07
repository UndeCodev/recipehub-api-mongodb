import { initializeApp } from 'firebase-admin/app';
import { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } from './config';
import { credential } from 'firebase-admin';

initializeApp({
    credential: credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: FIREBASE_CLIENT_EMAIL
    }) 
})
