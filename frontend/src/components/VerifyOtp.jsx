import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

const VerifyOtp = () => {

  

  const [otp, setOtp] = useState(["", "", "", "","",""]);
  const [loading,setLoading]=useState(false)
  const navigate=useNavigate();

  const inputRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)
      const otpString = otp.join("");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/verifyOtp`,
        { otp: otpString },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/reset-password");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="h-screen w-screen  flex flex-col  items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6 border border-gray-200"
      >
        <p className="text-2xl font-bold text-blue-500/90">Verify OTP</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-around">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center border-2 rounded-lg text-xl font-bold focus:outline-none focus:border-blue-500"
              />
            ))}
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold tracking-wide rounded-lg transition">
            {loading?"Please wait":"Verify OTP"}
            
          </Button>
        </form>
        <Link to="/login" className="text-indigo-600 hover:underline">
          Back to Login
        </Link>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
