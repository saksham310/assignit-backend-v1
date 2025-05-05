import express from "express";
import {addComment, createTask, deleteComment, getAllComments, getTaskDetails, updateTask} from "../controllers/task.controller.js";
import {upload} from "../middleware/multer.middleware.js";

const router = express.Router();

router.post('/',createTask)
router.get('/:id',getTaskDetails)
router.get('/:id/all/comments',getAllComments)
router.put('/:id',updateTask)
router.post('/:id/comment',upload.single('attachment'),addComment)
router.delete('/:taskId/comment/:commentId',deleteComment)

export default router;

