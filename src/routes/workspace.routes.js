import express from "express";
import {
    createWorkspace,
    deleteWorkspace,
    getWorkspaces,
    updateWorkspace,
    getWorkSpaceAnalytics, getWorkspaceMembers, leaveWorkspace, updateUserRole, inviteMember, joinWorkspace
} from "../controllers/workspace.controller.js";
import workspaceMiddleware from "../middleware/workspace.middleware.js";

const router=express.Router();

router.get("/",getWorkspaces);
router.get("/:workspaceId/analytics",workspaceMiddleware,getWorkSpaceAnalytics);
router.get("/:workspaceId/members",workspaceMiddleware,getWorkspaceMembers);

router.post("/",createWorkspace);
router.put("/:workspaceId",workspaceMiddleware,updateWorkspace);

router.put("/:workspaceId/members/role",workspaceMiddleware,updateUserRole);

router.delete("/:workspaceId/members",leaveWorkspace);
router.delete("/:workspaceId",workspaceMiddleware,deleteWorkspace);

router.post("/:workspaceId/invite",inviteMember);
router.post("/members/join",joinWorkspace);

export default router;