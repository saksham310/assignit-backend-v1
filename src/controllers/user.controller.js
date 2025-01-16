import {uploadImage} from "../utils/image.uploader.js";
import prisma from "../prismaClient.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res) => {
    const {username, email, password,} = req.body;
    let updatedProfile;
    try {
        let imageUrl;
        if (req.file) {
            const fileBuffer = req.file.buffer;
            imageUrl=await uploadImage(fileBuffer);
        }
        if(password){
            const hashedPassword = bcrypt.hashSync(password, 10);
            updatedProfile=await prisma.user.update({
                data:{
                    username,
                    email,
                    password:hashedPassword,
                    imageUrl,
                },
                where:{
                    id: req.userId,
                }
            })
        }else{
            updatedProfile=await prisma.user.update({
                data:{
                    username,
                    email,
                    imageUrl,
                },
                where:{
                    id: req.userId,
                }
            })
        }

        return res.status(200).json(updatedProfile);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to update profile',
            error: error.message,
        });
    }
};
