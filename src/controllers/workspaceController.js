import prisma from "../prismaClient.js";

export const createWorkspace=async (req,res)=>{
console.log("test",req.body);
const {name}=req.body;
if(!name){
    return res.status(400).json({message:'Please provide a workspace name'});
}
try{
const newWorkspace=await prisma.workspace.create({
    data: {
        name,
        users: {
            create:{
                user_id:req.userId,
                role:"Owner"
            }

        }
    }
})
   return  res.status(201).json({message:'Workspace Created Successfully',newWorkspace});
}catch(e){
    console.log(e);
   return  res.status(503).json({message:'Failed to Create the Workspace'});
}
}