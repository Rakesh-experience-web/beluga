import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_ORIGIN || "http://localhost:3000";

export const useAuthStore = create((set, get) => ({
    authUser :null , 
    isCheckingAuth :true , 
    isSigningUp :false ,
    isLoggingIn :false ,
    socket:null , 
    onlineUsers:[] ,
    checkAuth: async()=>{
        try{
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data});
            get().connectSocket();
        }
        catch{
             console.log("User not Authenticated");
             get().disconnectSocket();
             set({authUser:null});
        }
        finally{
            set({isCheckingAuth:false});
        }
    },
    signup: async(data)=>{
        set({isSigningUp:true});
        try{
            const res = await axiosInstance.post("/auth/signup" , data);
            set({authUser:res.data});
            get().connectSocket();
            toast.success("Hey Chatter , Welcome to the Chat Application !!!!");
        }
        catch(err){
             console.log("Signup Failed");
             toast.error(err.response?.data?.message || "OOPs!! , Signup Failed");
             get().disconnectSocket();
             set({authUser:null});
        }
        finally{
            set({isSigningUp:false});
        }
    } , 
    login: async(data)=>{
        set({isLoggingIn:true});
        try{
            const res = await axiosInstance.post("/auth/login" , data);
            set({authUser:res.data});
            get().connectSocket();
            toast.success("Welcome Back Chatter !!!!");
        }
        catch(err){
             console.log("Login Failed");
             toast.error(err.response?.data?.message || "OOPs!! , Login Failed");
             get().disconnectSocket();
             set({authUser:null});
        }
        finally{
            set({isLoggingIn:false});
    }
    
    },
    updateProfile:async(file)=>{
        try{
            const formData = new FormData();
            formData.append("profilePic", file);

            const res = await axiosInstance.put("/auth/updateProfile" , formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            set({authUser:res.data.user});
            toast.success("Profile Updated Successfully !!!!");
        }
        catch(err){
             toast.error(err.response?.data?.message || "OOPs!! , Profile Update Failed");
        }
    },
    logout:async()=>{
        try{
            await axiosInstance.post("/auth/logout");
            get().disconnectSocket();
            set({authUser:null});
            toast.success("Logged Out Successfully !!!!");
        }
        catch(err){
             console.log("Logout Failed");
             toast.error(err.response?.data?.message || "OOPs!! , Logout Failed");
        }
    },
    connectSocket: ()=>{
        const { authUser } = get();
        const existingSocket = get().socket;

        if (!authUser) return;
        if (existingSocket?.connected || existingSocket?.active) return;

        if (existingSocket) {
            existingSocket.removeAllListeners();
            existingSocket.disconnect();
        }

        const socket = io(SOCKET_URL, {
            withCredentials:true,
            autoConnect: false,
        });

        socket.on("getOnlineUsers", (users)=>{
            set({onlineUsers:users});
        });
        socket.on("connect_error", (error) => {
            console.error("Socket connection failed:", error.message);
        });

        set({socket});
        socket.connect();
    } , 
    disconnectSocket:()=>{
        const {socket} = get();
        if(socket){
            socket.removeAllListeners();
            socket.disconnect();
            set({socket:null , onlineUsers:[]});
        }
    }

}));
