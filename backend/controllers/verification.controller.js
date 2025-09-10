import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import  { sendEmail } from "../config/mailer.js";


export const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        message: "Email is not registered!",
        success: false
      })
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const record = await OTP.findOne({ email });
    if (record) {
        await OTP.deleteMany({ email })
    }

    await OTP.create({
      email, otp
    })

    await sendEmail({
      to:email,
      sub:"Your OTP Code",
      template:"otpEmail.ejs",
      data:{name:user.username, otp, expiresMinutes: 5}
    })

    const otpToken = await jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '5m' })
    res.cookie("otpSent", true, {
      httpOnly: false,
      sameSite: "strict",
      maxAge: 5 * 60 * 1000,
    });

    return res.cookie('otpToken', otpToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 1 * 5 * 60 * 1000 }).json({
      success: true,
      message: "OTP sent to the email"
    }
    )
  } catch (error) {
    console.log('error:', error)
    return res.error
  }
}


export const verifyOtp = async (req, res) => {



  try {
    const { otp } = req.body;
    const token = req.cookies.otpToken;

    if (!token) {
      return res.status(401).json({ success: false, message: "OTP expired" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);



    const email = decoded.email;

    const record = await OTP.findOne({ email });
    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP expired ",
      });
    }


    if (record.otp !== otp) {
      return res.status(401).json({
        success: false,
        message: "Wrong OTP",
      });
    }
    await OTP.deleteOne({ _id: record._id });
       res.clearCookie("otpSent");
       res.cookie("otpVerified", true, {
      httpOnly: false,
      sameSite: "strict",
      maxAge: 5 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("verifyOtp error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const updatePassword = async (req, res) => {


  try {
    const { newPassword, confirmPassword } = req.body;

    const token = req.cookies.otpToken;
     const otpVerified = req.cookies.otpVerified;
    if (!token || !otpVerified) {
      return res.status(400).json({
        success: false,
        message: "OTP expired!"
      })
    }


    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password must be same",
      });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired OTP token",
      });
    }
    const email = decoded.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as old password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.clearCookie("otpToken");
    res.clearCookie("otpVerified");

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
