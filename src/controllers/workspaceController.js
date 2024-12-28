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
export const updateWorkspace=async (req,res)=>{
    const {name}=req.body;
    const {workspaceId} = req.params;
    if(!name){
        return res.status(400).json({message:'Please provide a workspace name'});
    }
    try{
        const updatedWorkspace=await prisma.workspace.update({
            data: {
                name,
                },
            where:{
                id:parseInt(workspaceId)
            }
            })
        return  res.status(201).json({message:'Workspace Updated Successfully',updatedWorkspace});
    }catch(e){
        console.log(e);
        return  res.status(503).json({message:'Failed to Update the Workspace'});
    }
}
export const getWorkspace=async (req,res)=>{
    try{
    const workspaces=await prisma.workspace.findMany({
        where:{
            users:{
               some:{
                   user_id :req.userId,
               }
            }
        },
        include:{
            users: {
                select: {role:true}
            }
        }
    });
    const data=workspaces.map((w)=>{
        return {
            id:w.id,
            name:w.name,
            role:w.users[0].role
        }
    })
        return res.status(200).json({data});
    }catch(e){
        console.log(e);
        return  res.status(503).json({message:'Failed to fetch the Workspaces'});
    }
}

export const deleteWorkspace=async (req,res)=>{
    try{
        const workspaceId =parseInt(req.params.workspaceId);
        const workspace=await prisma.workspace.findUnique(
            {
                where:{
                    id:workspaceId,
                }
            });
        if(!workspace){
            return res.status(404).json({message:'Workspace not found'});
        }
        const user=await prisma.workspace_User.findFirst({
            where:{
                workspace_id:workspaceId,
                user_id:req.userId,
                role:"Owner"
            }
        });
        if(!user){
            return res.status(404).json({message:'You are not authorized to delete this workspace'});
        }
        await prisma.workspace_User.deleteMany({
            where:{
                workspace_id:workspaceId,
            }
        })
        await prisma.project_User.deleteMany(
            {
                where:{
                    project:{
                        workspace_id:workspaceId,
                    }
                }
            }
        );
        await prisma.project.deleteMany({
            where:{
                workspace_id:workspaceId,
            }
        });

        await prisma.workspace.delete({
            where:{
                id:workspaceId,
            }
        });

        return res.status(200).json({message:'Workspace deleted successfully'});
    }catch (e){
        console.log(e);
        return  res.status(500).json({message:'Failed to delete workspace'});
    }
}