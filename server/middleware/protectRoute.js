import User from "../model/User.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded._id) {
            return res.status(401).json({
                message: "Unauthorized - Invalid token"
            });
        }

        const user = await User.findById(decoded._id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized - Token verification failed"
        });
    }
};
