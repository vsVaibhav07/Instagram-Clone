import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ['GET', 'POST']
    }
})


const userSocketMap = {};   // stores {userId: Set<socketId>}

export const getUserSocketId = (receiverId) => {
    return userSocketMap[receiverId] || new Set();
};


io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
   
    if (userId) {
        if (!userSocketMap[userId]) {
            userSocketMap[userId] = new Set();
        }
        userSocketMap[userId].add(socket.id);
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
    socket.on('disconnect', () => {
    
        if (userId && userSocketMap[userId]) {
            userSocketMap[userId].delete(socket.id);
            if (userSocketMap[userId].size === 0) {
                delete userSocketMap[userId];
            }
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));

    })
})

export { app, io, server };
