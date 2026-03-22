import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../model/User.js';
dotenv.config();
export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.headers.cookie
            ?.split(';')
            .find((row)=> row.trim().startsWith('jwt='))
            ?.split('=')[1];

        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded._id) {
            return next(new Error('Authentication error: Invalid token'));
        }

        const user = await User.findById(decoded._id).select("-password");
        if (!user) {
            return next(new Error('Authentication error: Invalid token'));
        }

        socket.user = user;
        socket.userId = user._id.toString();
        next();
    } catch (error) {
        return next(new Error('Authentication error: Invalid token'));
    }
};
