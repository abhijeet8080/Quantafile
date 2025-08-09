import express from'express';
import dotenv  from'dotenv';
import cors  from'cors';
import connectDB  from'./config/db.js';
import authRoutes  from'./routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'
import questionRoutes from './routes/questionRoutes.js'
import answerRoutes from './routes/answerRoutes.js'
import voteRoutes from "./routes/voteRoutes.js"
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/votes', voteRoutes);



export default app;