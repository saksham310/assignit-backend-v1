import express from "express";
import {
    createProject,
    createSprint,
    getProjects,
    getProjectTasks,
    getSprintTasks
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/",createProject);
router.get("/:workspaceId",getProjects);
router.post("/sprint",createSprint);
router.get("/:projectId/tasks",getProjectTasks);
router.get("/sprint/:sprintId/tasks",getSprintTasks);
export default router;