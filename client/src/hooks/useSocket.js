import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

/**
 * useSocket Hook:
 * Manages the Socket.io connection lifecycle.
 * Automatically authenticates with the current JWT token
 * and joins the active workspace room.
 */
const useSocket = (workspaceId) => {
    const socketRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || !workspaceId) return;

        // Initialize socket with authentication
        socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
            auth: { token }
        });

        // Join the workspace room upon connection
        socketRef.current.on('connect', () => {
            console.log('Connected to socket server');
            socketRef.current.emit('join_workspace', workspaceId);
        });

        // Cleanup on unmount or workspace change
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [workspaceId]);

    return socketRef.current;
};

export default useSocket;
