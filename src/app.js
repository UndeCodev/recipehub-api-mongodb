import express from 'express';
import morgan from 'morgan';
import { createRoles } from './libs/initialSetup';

// Routes
import authRouter from './routes/auth.routes.js';

const app = express();
createRoles();

app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/auth', authRouter)

export default app;