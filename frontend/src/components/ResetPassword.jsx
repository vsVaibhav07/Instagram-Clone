import React, { useState } from "react";
import { motion } from "framer-motion";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Eye, EyeOff, Lock } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";

const ResetPassword = () => {
   const hasOtpToken = document.cookie.includes("otpVerified=")
   

  if (!hasOtpToken) {
    return <Navigate to="/forget-password" replace />;
  }

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault(); 
  try {
    setLoading(true);
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/updatePassword`,
      { newPassword, confirmPassword },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    if (res.data.success) {
      toast.success(res.data.message);
      // Redirect to login after reset
      navigate("/login");
    } else {
      toast.error(res.data.message);
    }
  } catch (error) {
    console.error("Update password error:", error);
    toast.error(error.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="newPassword" className="mb-2 block">
              New Password
            </Label>
            <div className="relative focus:ring-0 focus:outline-indigo-400 ">
              <Input
                id="newPassword"
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                className="pl-10 pr-10 border-indigo-300 outline-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
              />
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              {showNew ? (
                <EyeOff
                  size={18}
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  onClick={() => setShowNew(false)}
                />
              ) : (
                <Eye
                  size={18}
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  onClick={() => setShowNew(true)}
                />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="mb-2 block">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                className="pl-10 pr-10 border-indigo-300 outline-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
              />
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              {showConfirm ? (
                <EyeOff
                  size={18}
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  onClick={() => setShowConfirm(false)}
                />
              ) : (
                <Eye
                  size={18}
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  onClick={() => setShowConfirm(true)}
                />
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold py-2 rounded-xl shadow-md hover:opacity-90 transition"
          >
            {loading ? "Please wait" : " Reset Password"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
