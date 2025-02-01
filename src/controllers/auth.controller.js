import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import prisma from '../prismaClient.js';
import {generateOTP} from "../utils/otp.generator.js";
import {generateResetPasswordEmail} from "../utils/email-template.generator.js";
import {sendEmail} from "../utils/email.service.js";

export const registerUser = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: 'Email already exists' });
            } else {
                return res.status(400).json({ message: 'Username already exists' });
            }
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword
            }
        });
        const token = jwt.sign({
            id: user.id
        },
            process.env.JWT_SECRET,
            { expiresIn: '1d' })

        res.status(201).json({
            token, user: {
                id: user.id,
                username: user.username,
                email: user.email,
                image:user.imageUrl
            }
        })
    }
    catch (err) {
        console.log(err.message);
        res.status(503).json({message:'Failed to register'});
    }
}

export const loginUser=async(req,res)=>{
    const {email,password}=req.body;

    try{
        const user=await prisma.user.findUnique({
            where:{email
            }
        })
        if(!user){
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const passwordValid=bcrypt.compareSync(password, user.password);
        if(!passwordValid){
            return res.status(401).json({message:'Invalid credentials'})
        }
        const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{ expiresIn: '1d' });
        return res.status(200).json({
            token, user: {
                id: user.id,
                username: user.username,
                email: user.email,
                image:user.imageUrl
            }
        })
    }catch (err) {
        console.log(err.message);
       return res.sendStatus(503);
    }
}

export const sendOTP=async (req,res)=> {
    const {email}=req.body;
    try{
            const otp = generateOTP();
            const otp_expiry =  new Date(Date.now() + 10 * 60 * 1000);
            const verifyuser = await prisma.user.findUnique({
            where:{
                email
            }
        });
            const user=await prisma.user.update({
                data:{
                    otp,
                    otp_expiry
                },
                where:{
                    email
                }
            })
        const emailTemplate=generateResetPasswordEmail(user.username,user.otp);
       const status=await sendEmail(' AssignIt Password Reset OTP',emailTemplate,email);
       if(status.success){
         return  res.status(200).json({message:"Verification has been sent to your email"});
       }
       else{
           return  res.status(500).json("Something went wrong");
       }
    }catch (err){
        console.error("Error in sending OTP:", err.message);
        return  res.status(200).json({message:"Verification has been sent to your email"});
    }

}

export const  verifyOTP=async(req,res)=>{
    const {otp,email}=req.body;
    try{
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!user){
            return res.status(401).json({message:'Invalid OTP'});
        }
        if(user.otp===otp){
            if(user.otp_expiry > new Date()){
                return res.status(200).json({message:"OTP Verified Successfully! You can now proceed to change your password."});
            }
            return res.status(500).json({message:"OTP expired!"});
        }
        return res.status(500).json({message:"Invalid OTP!"});

    }catch(err){
        console.log(err.message);
    }
}

export const resetPassword=async(req,res)=>{
  try{
      const {email,password}=req.body;
      const hashedPassword = bcrypt.hashSync(password, 10);
      await prisma.user.update({
          data:{
              password:hashedPassword,
          },where:{
             email
          }
      })
      return res.status(200).json({ message: 'Password reset successfully!' });
  }catch(err){
      console.log(err.message);
      return res.status(500).json({ message: 'Something went wrong' });
  }

}