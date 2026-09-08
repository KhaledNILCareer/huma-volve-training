import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/users', userRoutes);
app.use('/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});