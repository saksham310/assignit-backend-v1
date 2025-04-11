import express from "express";
import {createTask, getTaskDetails, updateTask} from "../controllers/task.controller.js";

const router = express.Router();

router.post('/',createTask)
router.get('/:id',getTaskDetails)
router.put('/:id',updateTask)

export default router;

