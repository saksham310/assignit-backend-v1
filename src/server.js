import express from 'express';
import 'dotenv/config';
import authRoute from './routes/auth.routes.js';
import cors from 'cors';
import authMiddleware from "./middleware/auth.middleware.js";
import workspaceRoute from "./routes/workspace.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors({
    origin: 'http://localhost:5173',  // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/workspaces', authMiddleware, workspaceRoute);
app.use('/api/user', authMiddleware, userRoutes)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});