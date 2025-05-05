import express from "express";
import {updateUser, userProfileAnalytics, deleteUser} from "../controllers/user.controller.js";
import { upload } from '../middleware/multer.middleware.js';
const router = express.Router();

router.put(`/profile/update`,upload.single('image'),updateUser);
router.get(`/:projectId/analytics/:id/:sprintId?`,userProfileAnalytics);
router.delete('/delete', deleteUser);
export default router;