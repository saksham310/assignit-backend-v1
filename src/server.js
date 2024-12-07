import express from 'express';
import 'dotenv/config';
import authRoute from './routes/authRoutes.js';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/auth', authRoute)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});