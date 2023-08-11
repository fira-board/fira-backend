import express from 'express';
import mongoose from 'mongoose';
import aiRoutes from './routes/aiRoutes';
import projectRoutes from './routes/projectRoutes';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;


const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in .env');
    process.exit(1);
}

mongoose.connect(MONGO_URI);

app.use(express.json());
app.use('/projects', projectRoutes);
app.use('/ai', aiRoutes)

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
