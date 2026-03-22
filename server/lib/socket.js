import {Server} from 'socket.io';
import http from "http";
import express from "express";
import dotenv from "dotenv";
import {socketAuthMiddleware} from '../middleware/socket.auth.middleware.js';
dotenv.config();

const app = express();
const server = http.createServer(app);
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"] , 
        credentials: true
    }
});
//
io.use(socketAuthMiddleware);
// storing online users in memory
const userSocketMap = {};

export const getReceiverSocketId = (userId) => userSocketMap[userId];

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.fullName} (${socket.userId})`);
    userSocketMap[socket.userId] = socket.id;
    //to send to other users that this user is online
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.user.fullName} (${socket.userId})`);
        delete userSocketMap[socket.userId];
        //to send to other users that this user is offline
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});
export {server, io, app};
