import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db/connectDB.js";
import {app , server } from "./lib/socket.js";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
