import express from "express";
import {updateUser} from "../controllers/user.controller.js";
import { upload } from '../middleware/multer.middleware.js';
const router = express.Router();

router.put(`/profile/update`,upload.single('image'),updateUser);
export default router;