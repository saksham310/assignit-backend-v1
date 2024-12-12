import express from 'express';
import 'dotenv/config';
import authRoute from './routes/authRoutes.js';
const app = express();
const PORT = process.env.PORT || 8080;
import cors from 'cors';
app.use(cors({
    origin: 'http://localhost:5173',  // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api/auth', authRoute)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});