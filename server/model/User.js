import  mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    email:{
        type:String , 
        required:true , 
        unique:true ,
    },
    fullName:{
        type:String , 
        required:true 
    },
    password:{
        type:String , 
        required:true 
    },
    profilePic:{
        type:String , 
        default:""
    }

} , {
    timestamps:true // created , updated time , it can be used to dispalay user since 
});
const User = mongoose.model("User" , UserSchema); 
export default User ; 
