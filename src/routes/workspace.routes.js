import express from "express";
import {
    createWorkspace,
    deleteWorkspace,
    getWorkspace,
    updateWorkspace,
    getWorkSpaceAnalytics, taskList, memberList, leaveWorkspace
} from "../controllers/workspace.controller.js";
import workspaceMiddleware from "../middleware/workspace.middleware.js";

const router=express.Router();

router.get("/getWorkspaces",getWorkspace);
router.get("/getWorkspaceAnalytics/:workspaceId",workspaceMiddleware,getWorkSpaceAnalytics);
router.get("/allTasks/:workspaceId",workspaceMiddleware,taskList);
router.get("/memberList/:workspaceId",workspaceMiddleware,memberList);
router.post("/create",createWorkspace);
router.put("/update-workspace/:workspaceId",workspaceMiddleware,updateWorkspace);
router.get("/leave-workspace/:workspaceId",leaveWorkspace);
router.delete("/delete-workspace/:workspaceId",workspaceMiddleware,deleteWorkspace);
export default router;