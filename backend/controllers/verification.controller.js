import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendEmail } from "../config/mailer.js";

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Email is not registered!",
        success: false,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    await OTP.deleteMany({ email });

    await OTP.create({ email, otp, status: "sent" });

     const otpToken = jwt.sign({ email, }, process.env.SECRET_KEY, { expiresIn: "5m" });
    await sendEmail({
      to: email,
      sub: "Your OTP Code",
      template: "otpEmail.ejs",
      data: { name: user.username, otp, expiresMinutes: 5 }
    });
   

    return res.cookie("otpToken", otpToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 5 * 60 * 1000,
    }).json({
      success: true,
      message: "OTP sent to the email",
    });
  } catch (error) {
    console.log("sendOtp error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const token = req.cookies.otpToken;

    if (!token) {
      return res.status(401).json({ success: false, message: "OTP expired" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const email = decoded.email;

    const record = await OTP.findOne({ email, status: "sent" });
    if (!record) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(401).json({ success: false, message: "Wrong OTP" });
    }

    record.status = "verified";
    await record.save();

    return res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("verifyOtp error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const token = req.cookies.otpToken;

    if (!token) {
      return res.status(400).json({ success: false, message: "OTP expired!" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const email = decoded.email;

    const otpRecord = await OTP.findOne({ email, status: "verified" });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP not verified" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Password and Confirm Password must be same" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ success: false, message: "New password cannot be same as old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await OTP.deleteMany({ email });
    res.clearCookie("otpToken");

    return res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("updatePassword error:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};
