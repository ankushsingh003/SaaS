import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

/**
 * Socket.io Configuration:
 * This module initializes the socket server and handles authentication.
 * It also sets up 'rooms' based on Workspace IDs for multi-tenant isolation.
 */
const initSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5174',
            methods: ['GET', 'POST']
        }
    });

    // Middleware to authenticate socket connections using JWT
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // Attach user info to socket
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.id}`);

        // Join a 'room' for the specific workspace
        // This ensures real-time updates only go to members of that workspace
        socket.on('join_workspace', (workspaceId) => {
            socket.join(workspaceId);
            console.log(`User ${socket.user.id} joined workspace ${workspaceId}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    return io;
};

export default initSocket;
