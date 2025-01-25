import express from "express";
import {loginUser, registerUser, resetPassword, sendOTP, verifyOTP} from '../controllers/auth.controller.js';
const router = express.Router();

router.post("/register", registerUser)
router.post("/login", loginUser);
router.post('/send-otp', sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;