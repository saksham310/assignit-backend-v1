import {uploadImage} from "../utils/image.uploader.js";
import prisma from "../prismaClient.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res) => {
    const {username, email, password,} = req.body;
    let updatedProfile;
    try {
        let imageUrl;
        if (req.file) {
            const fileBuffer = req.file.buffer;
            imageUrl = await uploadImage(fileBuffer);
        }
        if (password) {
            const hashedPassword = bcrypt.hashSync(password, 10);
            updatedProfile = await prisma.user.update({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    imageUrl,
                },
                where: {
                    id: req.userId,
                }
            })
        } else {
            updatedProfile = await prisma.user.update({
                data: {
                    username,
                    email,
                    imageUrl,
                },
                where: {
                    id: req.userId,
                }
            })
        }

        return res.status(200).json({
            id: updatedProfile.id,
            username: updatedProfile.username,
            email: updatedProfile.email,
            image: updatedProfile.imageUrl
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

const userTaskCountByStatus = async (id, userId, sprintId,statusType) => {
    if(sprintId) {
        const count = await prisma.tasks.count({
            where: {
                sprint: {
                    project_id: id,
                    id: parseInt(sprintId),
                },
                Task_User: {
                    some: {
                        user_id: userId,
                    },
                },
                status: {
                    type: statusType
                }
            }
        });
        return count
    }
    const count = await prisma.tasks.count({
        where: {
            sprint: {
                project_id: id
            },
            Task_User: {
                some: {
                    user_id: userId,
                },
            },
            status: {
                type: statusType
            }
        }
    });
    return count;
}

export const userProfileAnalytics = async (req, res) => {
    try {
        const {projectId,id,sprintId} = req.params;
        const userId = parseInt(id)
        const sprint = await prisma.sprint.count({
            where: {
                project_id: parseInt(projectId),
            }
        })
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                username: true,
                imageUrl: true,
                avatarColor: true
            }
        })
        const role = await prisma.project_User.findUnique({
            where: {
                project_id_user_id: {
                    user_id: userId,
                    project_id: parseInt(projectId),
                }
            },
            select: {
                role: true
            }
        })
        let taskUsers
        if(sprintId){
            taskUsers = await prisma.task_User.findMany({
                where: {
                    user_id: userId,
                    task: {
                        sprint: {
                            project_id: parseInt(projectId),
                            id: parseInt(sprintId)
                        },
                    },
                },
                select: {
                    task: {
                        select: {
                            frontendBugCount: true,
                            backendBugCount: true,
                            databaseBugCount: true,
                        },
                    },
                },
            });
        }
        else {
            taskUsers = await prisma.task_User.findMany({
                where: {
                    user_id: userId,
                    task: {
                        sprint: {
                            project_id: parseInt(projectId),
                        },
                    },
                },
                select: {
                    task: {
                        select: {
                            frontendBugCount: true,
                            backendBugCount: true,
                            databaseBugCount: true,
                        },
                    },
                },
            });
        }

        const totalBugs = taskUsers.reduce((acc, { task }) => {
            if (!task) return acc;
            return acc + task.frontendBugCount + task.backendBugCount + task.databaseBugCount;
        }, 0);
        const project = await prisma.project.findUnique({
            where: {
                id: parseInt(projectId),
            },
            select: {
                idealTaskCount: true,
            }
        })
        console.log(project)
        const details = {
            ...user,
            sprintCount: sprint,
            idealTaskCount: project.idealTaskCount,
            ...role,
            tasks: {
                total: sprintId ? await prisma.tasks.count({
                    where: {
                        Task_User: {
                            some: {
                                user_id: userId,
                            }
                        },
                        sprint: {
                            id: parseInt(sprintId)
                        }
                    }
                }) : await prisma.tasks.count({
                    where: {
                        Task_User: {
                            some: {
                                user_id: userId,
                            }
                        }
                    }
                }),
                completed: await userTaskCountByStatus(parseInt(projectId), userId, sprintId, 'Completed'),
                inProgress: await userTaskCountByStatus(parseInt(projectId), userId, sprintId, 'In_Progress'),
                todo: await userTaskCountByStatus(parseInt(projectId), userId, sprintId, 'To_Do'),
                bugs: totalBugs,
            },
            sprints: await prisma.sprint.findMany({
                where: {
                    project_id: parseInt(projectId)
                },
                select: {
                    id: true,
                    name: true
                }
            })
        }
        res.status(200).json({details})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}
