import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { createRoles } from './libs/initialSetup';

// Routes
import authRouter from './routes/auth.routes.js';
import categoryRouter from './routes/category.routes';
import recipeRouter from './routes/recipe.routes';

const app = express();
createRoles();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/auth', authRouter);
app.use('/category', categoryRouter);
app.use('/recipe', recipeRouter);

export default app;