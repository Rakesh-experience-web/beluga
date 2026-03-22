import { signup, login, logout, update, checkAuth } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import express from "express";
import { upload } from "../middleware/upload.js";
import {arcjetProtection} from "../middleware/arcjet.middleware.js";
const router = express.Router();
// router.use(arcjetProtection);
router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.put(
  "/updateProfile",
  protectRoute,
  upload.single("profilePic"), // MUST match Postman key
  update
);
router.get("/check", checkAuth);
export default router;
