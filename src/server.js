import express from 'express';
import 'dotenv/config';
import authRoute from './routes/auth.routes.js';
import cors from 'cors';
import authMiddleware from './middleware/auth.middleware.js';
import http from 'http';
import { Server } from 'socket.io';
import workspaceRoute from './routes/workspace.routes.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import { registerSocketHandlers } from './socket/socket.js';

const app = express();
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: 'https://assignit-frontend.vercel.app', // frontend URL
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    },
});

app.use(cors({
    origin: ['http://localhost:5173','https://assignit-frontend.vercel.app','https://assignit.sharmasaksham.com.np'],  // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/workspaces', authMiddleware, workspaceRoute);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);

registerSocketHandlers();  // Register Socket.IO event handlers
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
