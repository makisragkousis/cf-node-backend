import express from 'express';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import { setupSwagger } from './swagger';

const app = express();
app.use(express.json());

setupSwagger(app);
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes);
// app.use('/api/roles', roleRoutes);


export default app;