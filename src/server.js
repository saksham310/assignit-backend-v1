import express from 'express';
import 'dotenv/config';
import authRoute from './routes/authRoutes.js';
import cors from 'cors';
import authMiddleware from "./middleware/authMiddleware.js";
import workspaceRoute from "./routes/workspaceRoutes.js";

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors({
    origin: 'http://localhost:5173',  // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/workspace', authMiddleware, workspaceRoute)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});