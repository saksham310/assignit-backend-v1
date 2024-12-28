import express from "express";
import {createWorkspace, deleteWorkspace, getWorkspace, updateWorkspace} from "../controllers/workspaceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router=express.Router();

router.get("/getWorkspaces",authMiddleware,getWorkspace);
router.post("/create",authMiddleware,createWorkspace);
router.put("/update/:workspaceId",authMiddleware,updateWorkspace);
router.delete("/deleteWorkspace/:workspaceId",authMiddleware,deleteWorkspace);
export default router;