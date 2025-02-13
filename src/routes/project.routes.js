import express from "express";
import {createProject} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/",createProject);

export default router;