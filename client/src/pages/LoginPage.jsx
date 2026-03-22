import {useState} from 'react';
import { useAuthStore } from '../store/useAuthStore';
import BorderAnimated from '../components/BorderAnimated';
import {MessageCircleIcon , UserIcon , MailIcon ,KeyIcon , LoaderIcon} from "lucide-react";
const LoginPage = () => {
  const[formData , setFormData] =useState({ email:"" , password:""});
  const {login , isLoggingIn} = useAuthStore();
  const handleSubmit = (e)=>{
    e.preventDefault();
    login(formData);
  }
  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[90-vh] h-[90vh]">
          <BorderAnimated>
             <div className="w-full flex flex-col md:flex-row">
              {/* FORM CLOUMN - LEFT SIDE */}
              <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">
                {/* HEADING TEXT */}
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">Create Account</h2>
                  <p className="text-slate-400">Sign up for a new account</p>
                </div>
                 {/* FORM */}
                 <form onSubmit={handleSubmit} className="space-y-6">
                   <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                   <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <KeyIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>
                  <div className="auth-btn" onClick={handleSubmit} disabled={isLoggingIn}>
                    {isLoggingIn?
                    <LoaderIcon className="animate-spin h-5 w-full  text-center"/>:
                    "Login"}
                  </div>
                  </form>
                  <div className="text-center mt-4">
                    <p className="text-slate-400">
                      Don't have an account?{" "}
                      <a href="/signup" className="text-blue-500 hover:underline">
                        Sign up here
                      </a>
                    </p>
                 </div>
                 </div>
                 </div>
                 <div className="md:w-1/2 p-8 flex flex-col items-center justify-center">
                   <h2 className="text-2xl font-bold text-slate-200 mt-4">Beluga Chat</h2>
                  <p className="text-slate-400 mt-2 text-center">Connect with your friends and the world around you with Beluga Chat.</p>
                  <img src="../../public/beluga-signup.png" alt="Beluga Illustration" className="w-full h-auto"/>
                </div>
                 </div>
        </BorderAnimated>
      </div>
      </div>
  )
}   

export default LoginPage;
