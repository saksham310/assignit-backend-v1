import prisma from "../prismaClient.js";

const defaultValues = [
    {name: 'To Do', type: 'To_Do', color: '#90a9d0'},
    {name: 'In Progress', type: 'In_Progress', color: '#f9d171'},
    {name: 'Completed', type: 'Completed', color: '#008844'},
]

export const createProject = async (req, res) => {
    try {
        const {name, startDate, dueDate, workspaceId, customStatus} = req.body;

        if (!name || !startDate || !dueDate || !workspaceId) {
            return res.status(400).send({message: 'Missing required fields'});
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

            return {project, statusList};
        });

        return res.status(200).send({
            message: 'Successfully created project',
            project: result.project,
            statusList: result.statusList
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Failed to create project'});
    }
};

export const getProjects = async (req, res) => {
    const {workspaceId} = req.params;
    try {
        const projects = await prisma.project.findMany({
            where: {
                workspace_id: parseInt(workspaceId),
                users: {
                    some: {
                        user_id: req.userId,
                    }
                }
            }, include: {
                sprint: true
            }
        })
        const projectsWithTaskCounts = await Promise.all(
            projects.map(async (project) => {
                const totalTasks = await prisma.tasks.count({
                    where: {
                        sprint: {
                            project_id: project.id
                        }
                    }
                });

                const toDoTasks = await prisma.tasks.count({
                    where: {
                        sprint: {
                            project_id: project.id
                        },
                        status: {
                            type: "To_Do"
                        }
                    }
                });

                const inProgressTasks = await prisma.tasks.count({
                    where: {
                        sprint: {
                            project_id: project.id
                        },
                        status: {
                            type: "In_Progress"
                        }
                    }
                });

                const completedTasks = await prisma.tasks.count({
                    where: {
                        sprint: {
                            project_id: project.id
                        },
                        status: {
                            type: "Completed"
                        }
                    }
                });

                return  {
                    ...project,
                    toDo: toDoTasks,
                    inProgress: inProgressTasks,
                    completed: completedTasks,
            tasks: totalTasks,
                };
            })
        );
        return res.status(200).send(projectsWithTaskCounts)
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Failed to get projects'});
    }
}

export const createSprint = async (req, res) => {
    try {
        const {name, startDate, dueDate, project_id} = req.body;
        const projectId = parseInt(project_id);
        // Check for missing fields
        if (!name || !startDate || !dueDate || !project_id) {
            return res.status(400).json({message: 'Missing required fields'});
        }

        // Validate date range
        if (new Date(startDate) >= new Date(dueDate)) {
            return res.status(400).json({message: 'Start date must be before due date'});
        }

        // Check if the project exists
        const project = await prisma.project.findUnique({where: {id: projectId}});
        if (!project) {
            return res.status(404).json({message: 'Project not found'});
        }

        // Create the sprint
        const sprint = await prisma.sprint.create({
            data: {name, startDate, endDate: dueDate, project_id: projectId},
        });

        return res.status(201).json({
            message: 'Successfully created project',
            sprint
        });

    } catch (err) {
        console.error('Error creating sprint:', err);
        return res.status(500).json({message: 'Failed to create Sprint', error: err.message});
    }
};
