import express from "express";
import {createWorkspace, deleteWorkspace, getWorkspace} from "../controllers/workspaceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router=express.Router();

router.post("/create",authMiddleware,createWorkspace);
router.get("/getWorkspaces",authMiddleware,getWorkspace);
router.delete("/deleteWorkspace/:workspaceId",authMiddleware,deleteWorkspace);
export default router;