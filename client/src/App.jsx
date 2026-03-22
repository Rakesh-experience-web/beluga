import { useEffect } from "react";
import {Navigate ,Routes , Route} from "react-router";
import ChatPage from "./pages/ChatPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import PageLoader from "./components/PageLoader";
import {useAuthStore} from "./store/useAuthStore.js";
import {Toaster} from "react-hot-toast";

export default function App() {
  const {authUser , checkAuth , isCheckingAuth} = useAuthStore() ;
  
  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

if(isCheckingAuth){
  return <PageLoader/>;
}
console.log({authUser});
  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
 
    {/* {decoratoes} */}
   <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
   <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
   <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />
   <Routes>
    <Route path ="/" element = {authUser?<ChatPage/>:<Navigate to={"/login"}/>}/>
    <Route path ="/login" element = {!authUser?<LoginPage/>:<Navigate to={"/"}/>}/>
    <Route path ="/signup" element = {!authUser?<SignUpPage/>:<Navigate to={"/"}/>}/>
   </Routes>
   <Toaster/>
   </div>
  )
}
