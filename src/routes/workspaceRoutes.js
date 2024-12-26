import express from "express";
import {createWorkspace, getWorkspace} from "../controllers/workspaceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router=express.Router();

router.post("/create",createWorkspace);
router.get("/getWorkspaces",authMiddleware,getWorkspace);

export default router;