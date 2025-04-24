import express from "express";
import {
    createProject,
    createSprint,
    getProjects,
    getProjectDetails,
    getSprintTasks, getProjectStatusMembers, getProjectMembers,
    projectRetrospective, createSprintRetrospective, getRetroFeedbacks, updateStatus, updateProject
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/",createProject);
router.get("/:workspaceId",getProjects);
router.put("/:projectId",updateProject);
router.get('/:projectId/members',getProjectMembers);
router.post("/:projectId/status/update",updateStatus);
router.post("/sprint",createSprint);
router.get("/:projectId/details",getProjectDetails);
router.get("/sprint/:sprintId/tasks",getSprintTasks);
router.get("/:projectId/status",getProjectStatusMembers);
router.get(`/:workspaceId/retrospective/`,projectRetrospective);
router.post("/retrospective",createSprintRetrospective);
router.get("/retrospective/:sprintId",getRetroFeedbacks);

export default router;