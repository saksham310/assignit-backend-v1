import prisma from "../prismaClient.js";

const workspaceMiddleware = async (req, res, next) => {
    try {
        const { workspaceId } = req.params;
        const w_id = parseInt(workspaceId);
        const user = await prisma.workspace_User.findFirst({
            where: {
                workspace_id: w_id,
                user_id: req.userId
            }
        });
        if (!user) {
            return res.status(422).json({ message: 'User not found in this workspace' });
        }
        req.isOwner = user.role === "Owner";
        req.isAdmin = user.role === "Admin";
        req.w_id = w_id;
        next();
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'An error occurred while checking workspace access' });
    }
}

export default workspaceMiddleware;
