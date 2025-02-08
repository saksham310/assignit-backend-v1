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

router.get("/getWorkspaces",getWorkspaces);
router.get("/getWorkspaceAnalytics/:workspaceId",workspaceMiddleware,getWorkSpaceAnalytics);
router.get("/memberList/:workspaceId",workspaceMiddleware, getWorkspaceMembers);
router.post("/create",createWorkspace);
router.put("/update-role/:workspaceId",workspaceMiddleware,updateUserRole);
router.put("/update-workspace/:workspaceId",workspaceMiddleware,updateWorkspace);
router.get("/leave-workspace/:workspaceId",leaveWorkspace);
router.delete("/delete-workspace/:workspaceId",workspaceMiddleware,deleteWorkspace);
router.post("/invite/:workspaceId",inviteMember);
router.post("/join",joinWorkspace);

router.get("/workspaces",getWorkspaces);
router.get("/workspaces/:workspaceId/analytics",workspaceMiddleware,getWorkSpaceAnalytics);
router.get("/workspaces/:workspaceId/members",workspaceMiddleware,getWorkspaceMembers);

router.post("/workspaces",createWorkspace);
router.put("/workspaces/:workspaceId",workspaceMiddleware,updateWorkspace);

router.put("/workspaces/:workspaceId/members/role",workspaceMiddleware,updateUserRole);

router.delete("/workspaces/:workspaceId/members",leaveWorkspace);
router.delete("/workspaces/:workspaceId",workspaceMiddleware,deleteWorkspace);

router.post("/workspaces/:workspaceId/invite",inviteMember);
router.post("/workspaces/members/join",joinWorkspace);

export default router;