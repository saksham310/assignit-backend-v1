import prisma from "../prismaClient.js";
import {uploadImage} from "../utils/image.uploader.js";

export const createTask = async (req, res) => {
    try{
        const {name,description,priority,status_id,assignees,sprint_id}=req.body;
        if(!name ||  !priority || !status_id ||  !sprint_id){
            return res.status(400).send({error: 'Missing required field.'});
        }
        const result = await prisma.$transaction(async(prisma) =>{
            const task = await prisma.tasks.create({
                data:{
                    name,
                    description,
                    priority,
                    status_id:status_id,
                    sprint_id:parseInt(sprint_id),
                }
            })
            if(!task) throw new Error("Error creating task");
            const assigneesList = assignees.map((id)=> ({
                task_id:task.id,
                user_id:id
            }))
            const assignee = await prisma.task_User.createMany({
                data:assigneesList,
            })
            
            // Get the username of the user who created the task
            const user = await prisma.user.findUnique({
                where: {
                    id: req.userId
                },
                select: {
                    username: true
                }
            });
            
            // Add activity comment showing who created the task
            await prisma.task_Comment.create({
                data: {
                    message: `created the task`,
                    type: 'activity',
                    task_id: task.id,
                    user_id: req.userId
                }
            });
            
            return {task,assignee}
        })
        return res.status(200).send({
            message: 'Successfully created task',
            project: result.task,
            statusList: result.assignee
        });
    }catch(err){
        console.log(err);
        res.status(400).send({
            message:'Failed to create the task',
        })
    }
}

export const getTaskDetails =  async (req, res) => {
  try {
      const {id} = req.params;
      if(!id){
          return res.status(400).send({error: 'Missing required field.'});
      }
      const result = await prisma.$transaction(async(prisma) =>{
          const task = await prisma.tasks.findUnique({
              where:{
                  id:parseInt(id),
              },
              include:{
                  Task_User: {
                      include:{
                          user:true
                      }
                  }
              }
          })
          if(!task){
              return res.status(404).send({error: 'No task with this id'});
          }
          const status = await prisma.status.findUnique({
              where:{
                  id:task.status_id,
              }
          })
          if(!status){
              return res.status(404).send({error: 'No task with this id'});
          }
          const formattedTask = {
              id:task.id,
              name:task.name,
              description:task.description,
              priority:task.priority,
              status:status,
              FrontendBugCount: task.frontendBugCount,
              BackendBugCount: task.backendBugCount,
              DatabaseBugCount: task.databaseBugCount,
              assignees: task.Task_User.map((taskUser) => ({
                  id: taskUser.user.id,
                  username: taskUser.user.username,
                  image: taskUser.user.imageUrl,
                  avatarColor: taskUser.user.avatarColor
              })),
          }
            return {formattedTask}
      })


      return res.status(200).send(result.formattedTask)
  }catch(err){
      console.log(err);
      res.status(400).send({message: 'Error getting task details'});
  }
}

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignees, ...taskData } = req.body;

        const oldTask = await prisma.tasks.findUnique({
            where:{
                id:parseInt(id),
            }
        })

        const task = await prisma.tasks.update({
            where: { id: parseInt(id) },
            data: { ...taskData },
        });
        const activityLog = [];
        if (taskData.name && taskData.name !== oldTask.name) {
            activityLog.push(`updated the task title.`);
        }

        if (taskData.description && taskData.description !== oldTask.description) {
            activityLog.push(`updated the task description.`);
        }


        if (taskData.status_id && taskData.status_id !== oldTask.status_id) {
            const oldStatus = await prisma.status.findUnique({
                where:{
                    id:oldTask.status_id
                }
            })
            const newStatus = await prisma.status.findUnique({
                where:{
                    id:taskData.status_id
                }
            })
            activityLog.push(` updated the status from ${oldStatus.name} to ${newStatus.name}.`);

        }

        if (taskData.priority && taskData.priority !== oldTask.priority) {
            activityLog.push(`updated the priority from ${oldTask.priority} to ${taskData.priority}.`);
        }

        //  Handle assignee changes if provided
        if (assignees) {
            await prisma.$transaction(async (prisma) => {
                // Delete existing assignees for this task
                const deleted = await prisma.task_User.deleteMany({
                    where: { task_id: parseInt(id) },
                });


                // Add new assignees if provided
                if (assignees.length > 0) {
                    const assigneesList = assignees.map((userId) => ({
                        task_id: parseInt(id),
                        user_id: parseInt(userId),
                    }));

                    const result = await prisma.task_User.createMany({
                        data: assigneesList,
                    });
                    activityLog.push(` updated the  users assigned to the task.`);


                }
            });
        }
        const activityData = activityLog.map((taskLog) => ({
            message: taskLog,
            type: 'activity',
            task_id: parseInt(id),
            user_id: req.userId
        }));
        if (activityData.length > 0) {
            await prisma.task_Comment.createMany({
                data: activityData
            });
        }
        // Return success response
        return res.status(200).send({ message: 'Task updated successfully', task });
    } catch (err) {
        console.error("Error in task update:", err);
        res.status(400).send({ message: 'Error updating task' });
    }
};

export const addComment = async (req, res) => {
    try{
        const {message,type,comment_id} = req.body;
        const {id} = req.params;
        let attachment;
        if(req.file){
            const fileBuffer = req.file.buffer;
            attachment=await uploadImage(fileBuffer);
        }
        if(comment_id){
            const comment = await prisma.task_Comment.update({
                where:{
                    id :parseInt(comment_id),
                },
                data:{
                    message,
                    type,
                    attachment:attachment ?? null,
                }
            })
            return res.status(200).send({message: 'Comment updated successfully',comment});
        }
        const comment = await prisma.task_Comment.create({
            data:{
                message,
                type,
                task_id: parseInt(id),
                user_id:req.userId,
                attachment:attachment ?? null,
            }
        })
        return res.status(200).send({message: 'Comment added successfully',comment});
    }
catch(err){
        console.error("Error in task addComment:", err);
        res.status(400).send({message: 'Error adding comment'});
}
}

export const getAllComments = async (req, res) => {
    try{
        const {id} = req.params;
        const comments = await prisma.task_Comment.findMany({
            where:{
                task_id: parseInt(id),
            },
            include:{
                user:true
            },
            orderBy: {
                createdAt: 'asc' // ascending: oldest to newest
            }
        })

        const formattedComments = comments.map((comment) => ({
            id: comment.id,
            name: comment.user.username,
            message:comment.message,
            createdAt: comment.createdAt,
            type: comment.type,
            userImage: comment.user.imageUrl ?? "",
            avatarColor: comment.user.avatarColor ?? null,
            attachment: comment.attachment ?? null,
            userId: comment.user.id,
        }))

        return res.status(200).send(formattedComments);
    }catch(err){
        console.error("Error in task getAllComments:", err);
        res.status(400).send({message: 'Error fetching all comments'});
    }
}

export const deleteComment = async (req, res) => {
    try {
        const {taskId, commentId} = req.params;
        
        const comment = await prisma.task_Comment.findUnique({
            where: {
                id: parseInt(commentId),
    
            }
        });

        if (!comment) {
            return res.status(404).send({message: 'Comment not found'});
        }

        if (comment.user_id !== req.userId) {
            return res.status(403).send({message: 'You are not authorized to delete this comment'});
        }

        await prisma.task_Comment.delete({
            where: {
                id: parseInt(commentId)
            }
        });

        return res.status(200).send({message: 'Comment deleted successfully'});
    } catch (err) {
        console.error("Error in deleteComment:", err);
        res.status(400).send({message: 'Error deleting comment'});
    }
}