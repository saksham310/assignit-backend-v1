import express from 'express';
import 'dotenv/config';
import authRoute from './routes/authRoutes.js';
const app = express();
const PORT = process.env.PORT || 3000;
import cors from 'cors';
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
}));

app.use(express.json());
app.use('/api/auth', authRoute)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});