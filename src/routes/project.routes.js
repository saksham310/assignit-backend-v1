import express from "express";
import {createWorkspace} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/",createWorkspace);

export default router;