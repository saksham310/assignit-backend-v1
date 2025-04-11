import prisma from "../prismaClient.js";

export const createTask = async (req, res) => {
    try{
        const {name,description,priority,status_id,assignees,sprint_id}=req.body;
        if(!name || !description || !priority || !status_id || !assignees || !sprint_id){
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

        // Step 1: Update the task
        const task = await prisma.tasks.update({
            where: { id: parseInt(id) },
            data: { ...taskData },
        });


        // Step 2: Handle assignee changes if provided
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


                }
            });
        }

        // Return success response
        return res.status(200).send({ message: 'Task updated successfully', task });
    } catch (err) {
        console.error("Error in task update:", err);
        res.status(400).send({ message: 'Error updating task' });
    }
};
