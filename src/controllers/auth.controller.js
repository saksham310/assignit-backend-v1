import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import prisma from '../prismaClient.js';

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