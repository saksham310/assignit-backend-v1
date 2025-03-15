import express from "express";
import {createProject, createSprint, getProjects} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/",createProject);
router.get("/",getProjects);
router.post("/sprint",createSprint);

export default router;