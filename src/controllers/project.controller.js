import prisma from "../prismaClient.js";

const defaultValues = [
    {name:'To Do', type:'To_Do', color : '#90a9d0' },
    {name:'In Progress', type:'In_Progress', color : '#f9d171' },
    {name:'Completed', type:'Completed', color : '#008844' },
]

export const createProject = async (req, res) => {
    try {
        const { name, startDate, dueDate, workspaceId, customStatus } = req.body;

        if (!name || !startDate || !dueDate || !workspaceId) {
            return res.status(400).send({ message: 'Missing required fields' });
        }

        // Start a transaction
        const result = await prisma.$transaction(async (prisma) => {
            // Create project
            const project = await prisma.project.create({
                data: {
                    name,
                    dueDate: new Date(dueDate),
                    startDate: new Date(startDate),
                    workspace_id: parseInt(workspaceId),
                },
            });

            if (!project) throw new Error("Error creating project");

            // Prepare statuses
            const statusList = (customStatus && customStatus.length > 0 ? customStatus : defaultValues).map(status => ({
                project_id: project.id,
                ...status,
            }));

            // Create statuses
            await prisma.status.createMany({
                data: statusList
            });

            // Assign Project Manager
            await prisma.project_User.create({
                data: {
                    project_id: project.id,
                    user_id: req.userId,
                    role: "Project_Manager"
                }
            });

            return { project, statusList };
        });

        return res.status(200).send({
            message: 'Successfully created project',
            project: result.project,
            statusList: result.statusList
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Failed to create project' });
    }
};

export const getProjects = async (req, res) => {
try {
    const project = await prisma.project.findMany({
        where:{
            users:{
                some:{
                    user_id : req.userId,
                }
            }
        },include: {
            sprint : true
        }
    })
    res.status(200).send(project);
}catch(err){
    console.error(err);
    return res.status(500).send({ message: 'Failed to get projects' });
}
}