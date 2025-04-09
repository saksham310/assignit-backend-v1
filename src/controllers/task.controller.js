import prisma from "../prismaClient.js";

export const createTask = async (req, res) => {
    try{
        const {name,description,priority,status,assignees,sprint_id}=req.body;
        if(!name || !description || !priority || !status || !assignees || !sprint_id){
            return res.status(400).send({error: 'Missing required field.'});
        }
        const result = await prisma.$transaction(async(prisma) =>{
            const task = await prisma.tasks.create({
                data:{
                    name,
                    description,
                    priority,
                    status_id:status,
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