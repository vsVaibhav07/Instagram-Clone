import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const ForgetPassword = () => {
  const [email,setEmail]=useState("");
  const navigate=useNavigate();
  const [loading,setLoading]=useState(false);

  const submitHandler=async(e)=>{
    e.preventDefault();

    try {
      setLoading(true)
       const res= await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/forgetPassword`,
        {email},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if(res.data.success){
          toast.success(res.data.message)
          navigate('/verify-email');

        }
      
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred")
    }
  
    setLoading(false);
  }

  return (
    <div className="h-screen w-screen  flex flex-col  items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6 border border-gray-200"
      >
        <p className="text-2xl font-bold text-blue-500/90">Enter Email</p>
        <form onSubmit={submitHandler} className="flex flex-col gap-4">
            <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Enter Your email"
            autoComplete="email"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition duration-200"
          />
          <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold tracking-wide rounded-lg transition">{loading?"Sending":"Send OTP"}</Button>
        </form>
        <Link to="/login" className="text-indigo-600 hover:underline">Back to Login</Link>
        
      </motion.div>
    </div>
  );
};

export default ForgetPassword;
