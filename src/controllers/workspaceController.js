import prisma from "../prismaClient.js";

export const createWorkspace=async (req,res)=>{
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

export const getWorkspace=async (req,res)=>{
    try{
console.log(req.headers);
    const workspaces=await prisma.workspace.findMany({
        where:{
            users:{
               some:{
                   user_id :req.userId,
               }
            }
        }
    });
        return res.status(200).json({workspaces});
    }catch(e){
        console.log(e);
        return  res.status(503).json({message:'Failed to fetch the Workspaces'});
    }
}