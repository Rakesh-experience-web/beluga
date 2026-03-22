import express from "express" ; 
const router = express.Router() ; 
import { upload } from "../middleware/upload.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { getAllContact  , getMessagesByUserId , sendMessage , getChatpartner } from "../controller/message.controller.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
// router.use(arcjetProtection);
router.get("/contacts" ,protectRoute , getAllContact);
router.get("/chats", protectRoute ,  getChatpartner);
router.get("/:id" ,protectRoute ,  getMessagesByUserId);
router.post(
  "/send/:id",
  protectRoute,
  upload.single("image"), 
  sendMessage
);
export default router ; 