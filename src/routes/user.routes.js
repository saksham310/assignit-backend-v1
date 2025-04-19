import express from "express";
import {updateUser, userProfileAnalytics} from "../controllers/user.controller.js";
import { upload } from '../middleware/multer.middleware.js';
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

router.put(`/profile/update`,upload.single('image'),updateUser);
router.get(`/:projectId/analytics/:id`,authMiddleware,userProfileAnalytics);
export default router;