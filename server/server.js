import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import workspaceRoutes from './routes/workspace.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const httpServer = http.createServer(app);

// Socket.io Setup
const io = new Server(httpServer, {
    cors: {
        origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);

app.get('/', (req, res) => {
    res.send('SaaS Analytics API is running...');
});

// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);
//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });

// Error Handling (to be implemented)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
