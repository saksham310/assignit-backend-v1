import express from "express";
import {
    createProject,
    createSprint,
    getProjects,
    getProjectDetails,
    getSprintTasks, getProjectStatusMembers
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/",createProject);
router.get("/:workspaceId",getProjects);
router.post("/sprint",createSprint);
router.get("/:projectId/details",getProjectDetails);
router.get("/sprint/:sprintId/tasks",getSprintTasks);
router.get("/:projectId/status",getProjectStatusMembers);
export default router;