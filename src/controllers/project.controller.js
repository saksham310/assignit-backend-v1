import prisma from "../prismaClient.js";

const defaultValues = [
    {name:'To Do', type:'To_Do', color : '#90a9d0' },
    {name:'In Progress', type:'In_Progress', color : '#f9d171' },
    {name:'Completed', type:'Completed', color : '#008844' },
]

export const createProject = async (req,res) =>{
  try {
      const {name,dueDate,workspaceId,customStatus} = req.body
      const project = await prisma.project.create({
          data: {
              name,
              dueDate,
              workspace_id: workspaceId,
          }
      });
      if(!project) return res.status(400).send({message:'Error creating project'})
      const statusList = (customStatus && customStatus.length > 0 ? customStatus : defaultValues).map(status => ({
          project_id: project.id,
          ...status
      }));
      await prisma.status.createMany({
          data: statusList
      })

      await prisma.project_User.create({
          data:{
              project_id:project.id,
              user_id: req.userId,
              role:"Project_Manager"
          }
      })
      return res.status(200).send({
          message:'Successfully created project',
          statusList,
          project
      })
  }
  catch(err){
      console.error(err)
      return res.status(500).send({message:'Failed to create project'})
  }
}
