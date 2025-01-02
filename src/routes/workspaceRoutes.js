import express from "express";
import {
    createWorkspace,
    deleteWorkspace,
    getWorkspace,
    updateWorkspace,
    getWorkSpaceAnalytics
} from "../controllers/workspaceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router=express.Router();

router.get("/getWorkspaces",getWorkspace);
router.get("/getWorkspaceAnalytics/:workspaceId",getWorkSpaceAnalytics);
router.post("/create",createWorkspace);
router.put("/update/:workspaceId",updateWorkspace);
router.delete("/deleteWorkspace/:workspaceId",deleteWorkspace);
export default router;