import express from "express";
import {
    createWorkspace,
    deleteWorkspace,
    getWorkspace,
    updateWorkspace,
    getWorkSpaceAnalytics, taskList, memberList
} from "../controllers/workspace.controller.js";
import workspaceMiddleware from "../middleware/workspaceMiddleware.js";

const router=express.Router();

router.get("/getWorkspaces",getWorkspace);
router.get("/getWorkspaceAnalytics/:workspaceId",workspaceMiddleware,getWorkSpaceAnalytics);
router.get("/allTasks/:workspaceId",workspaceMiddleware,taskList);
router.get("/memberList/:workspaceId",workspaceMiddleware,memberList);
router.post("/create",createWorkspace);
router.put("/update/:workspaceId",workspaceMiddleware,updateWorkspace);
router.delete("/deleteWorkspace/:workspaceId",workspaceMiddleware,deleteWorkspace);
export default router;