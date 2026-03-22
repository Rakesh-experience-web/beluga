import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../lib/utils.js";
import {sendWelcomeEmail} from "../emails/emailHandler.js";
import "dotenv/config"
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    generateToken(newUser._id, res);

    // try{
    //     await sendWelcomeEmail(savedUser.email , savedUser.fullName , process.env.CLIENT_URL) ;
    // }
    // catch(err){
    //      console.error("failed to send email ");
    // }
     res.status(201).json({
      message: "User created successfully",
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email
    });
  } catch (err) {

  console.error("SIGNUP ERROR:", err);
   return res.status(500).json({
    error: err.message,
    stack: err.stack
  });
  }
};

export const login = async (req, res) => {
    const {email , password} = req.body ; 
    try{
        const userFind = await User.findOne({email});
        if(!userFind){
              return res.status(400).json({message:"Invalid credential "});
        }
        const match = await bcrypt.compare(password , userFind.password ) ; 
        if(!match){
            return res.status(400).send({message:"Invalid Creadential"});
        }
        generateToken(userFind._id , res);
        return  res.status(200).json({
            message:"Login Successful" , 
            _id: userFind._id,
            fullName: userFind.fullName , 
            email:userFind.email , 
            profilePic: userFind.profilePic,
        })

    }
    catch(err){
        return res.status(500).json({error:"Internal Server Error"});
    }
};

export const logout = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(200).json(null);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?._id) {
      return res.status(200).json(null);
    }

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(200).json(null);
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(200).json(null);
  }
};

export const update = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No profile picture uploaded"
      });
    }

    const userId = req.user._id;

    const profilePicPath = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: profilePicPath },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};
