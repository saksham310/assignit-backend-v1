import express from "express";
import {loginUser, registerUser, sendOTP} from '../controllers/auth.controller.js';
const router = express.Router();

router.post("/register", registerUser)
router.post("/login", loginUser);
router.post('/send-otp', sendOTP);

export default router;