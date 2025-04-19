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

const userTaskCountByStatus = async (id, userId, statusType) => {
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

const userTaskCountByPriority = async (priority) => {
    const count = await prisma.tasks.count({
        where: {
            priority: priority
        }
    })
    return count;
}
export const userProfileAnalytics = async (req, res) => {
    try {
        const {projectId,id} = req.params;
        const userId = parseInt(id)
        const sprint = await prisma.sprint.count({
            where: {
                project_id: parseInt(projectId),
            }
        })
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id:true,
                email: true,
                username: true,
                imageUrl: true,
                avatarColor:true

            }
        })
            const role = await prisma.project_User.findUnique({
                where: {
                   project_id_user_id:{
                       user_id: userId,
                       project_id: parseInt(projectId),
                   }
                },select:{
                    role:true
                }
            })
        const taskUsers = await prisma.task_User.findMany({
            where: {
                user_id: userId,
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

        const totalBugs = taskUsers.reduce((acc, { task }) => {
            if (!task) return acc;
            return acc + task.frontendBugCount + task.backendBugCount + task.databaseBugCount;
        }, 0);
        const details = {
            ...user,
            sprintCount: sprint,
            ...role,
            tasks: {
                total: await prisma.tasks.count({
                    where: {
                        Task_User:{
                            some:{
                                user_id:userId,
                            }
                        }
                    }
                }),
                completed:await userTaskCountByStatus(parseInt(projectId), userId, 'Completed') ,
                inProgress:await userTaskCountByStatus(parseInt(projectId), userId, 'In_Progress'),
                todo: await userTaskCountByStatus(parseInt(projectId), userId, 'To_Do'),
                bugs: totalBugs,

            }
        }
        res.status(200).json({details})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}