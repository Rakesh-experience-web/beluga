import Message from "../model/Message.js";
import User from "../model/User.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getAllContact = async( req , res)=>{
    try {
       const UserId = req.user._id ; 
       const users = await User.find({
       _id: { $ne: UserId }
    }).select("-password");

     res.status(200).json(users);

    }
    catch(err){
       res.status(500).json({ message: "Failed to load contacts" });
    }}
export const getMessagesByUserId = async( req , res)=>{
    try{
        const UserId = req.user._id; 
        const {id : usertochat} = req.params ; 
        const message = await Message.find(
            {
                $or:[
                    {senderId: UserId , receiverId: usertochat} , 
                    {senderId: usertochat , receiverId: UserId}
                ] 
            }
        ).sort({ createdAt: 1 }) ; 
        res.status(200).json(message) ;
    }

    catch(err){
        console.log("Error Found:" , err);
        res.status(500).json({ message: "Message getter error" });
    }
}

export const sendMessage = async (req, res) => {
  try {
    const {id:receiverId} = req.params;
    const senderId = req.user._id;

    const text = req.body.text;

    // Single image
    const image = req.file
      ? {
          url: `/uploads/${req.file.filename}`,
          type: req.file.mimetype
        }
      : null;

    const message = await Message.create({
      senderId: senderId,
      receiverId: receiverId,
      text,
      image
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getChatpartner = async(req , res) =>{
  try{
  const UserId = req.user._id ; 
 
  const messages = await Message.find(
            {
                $or:[
                    {senderId: UserId} , 
                    {receiverId:UserId}
                ] 
            }
        ) ; 

   const partners = [
    ...new Set(
      messages.map((message) =>
        String(message.senderId) === String(UserId)
          ? String(message.receiverId)
          : String(message.senderId)
      )
    ),
   ] 
   
   const chatPartners = await User.find({_id:{$in: partners}}).select("-password");
   res.status(200).json(chatPartners);}
   catch(err){
    res.status(500).json({"message":"Sorry couldn't fetch your Partners "});
   }
  
}
