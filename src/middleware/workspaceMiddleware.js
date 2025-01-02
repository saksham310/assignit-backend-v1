import prisma from "../prismaClient.js";

const workspaceMiddleware=async (req, res, next) => {
    const {workspaceId} = req.params;
    const w_id =parseInt(workspaceId);
    const user=await prisma.workspace_User.findFirst({
        where:{
            workspace_id:w_id,
            user_id:req.userId
        }
    });
    if(!user){
        return res.status(404).json({message:'Something went wrong'});
    }
    req.isOwner=user.role==="Owner";
    req.w_id=w_id;
    next();
}

export default workspaceMiddleware;