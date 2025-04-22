import express from "express";
import {
    createProject,
    createSprint,
    getProjects,
    getProjectDetails,
    getSprintTasks, getProjectStatusMembers, getProjectMembers,
    projectRetrospective, createSprintRetrospective
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/",createProject);
router.get("/:workspaceId",getProjects);
router.get('/:projectId/members',getProjectMembers);
router.post("/sprint",createSprint);
router.get("/:projectId/details",getProjectDetails);
router.get("/sprint/:sprintId/tasks",getSprintTasks);
router.get("/:projectId/status",getProjectStatusMembers);
router.get(`/:workspaceId/retrospective/`,projectRetrospective);
router.post("/retrospective",createSprintRetrospective);
export default router;