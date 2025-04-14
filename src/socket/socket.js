import { io } from '../server.js'; // Ensure the import path is correct
import prisma from '../prismaClient.js'; // Prisma client for DB interaction

// Registering all Socket.IO event handlers
export const registerSocketHandlers = () => {
    io.on('connection', (socket) => {
        console.log('🟢 User connected:', socket.id);

        // Handling task status updates
        socket.on('update-task-status', async ({ taskId, newStatus, userId }) => {
            try {
                // Update task status in the database
                await updateTaskStatus(taskId, newStatus, userId);

                // Emit event to update all clients
                io.emit('task-status-updated', { taskId, newStatus });
            } catch (error) {
                console.error('Error updating task status:', error);
                socket.emit('error', 'Failed to update task status');
            }
        });

        // When a user disconnects
        socket.on('disconnect', () => {
            console.log('🔴 User disconnected:', socket.id);
        });
    });
};

// Function for updating the task status in the DB
const updateTaskStatus = async (taskId, newStatus, userId) => {
    try {
        // Fetch the old task to compare its status before updating
        const oldTask = await prisma.tasks.findUnique({
            where: {
                id: taskId,
            },
            include: {
                status: true, // Include the related status to avoid another query later
            }
        });

        if (!oldTask) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        // Only update if the status has actually changed
        if (oldTask.status_id !== parseInt(newStatus)) {
            // Update the task's status
            await prisma.tasks.update({
                where: { id: taskId },
                data: { status_id: parseInt(newStatus) },
            });

            // Create a task comment to record the status change activity
            const oldStatus = oldTask.status.name;
            const newStatusRecord = await prisma.status.findUnique({
                where: { id: parseInt(newStatus) }
            });

            if (!newStatusRecord) {
                throw new Error(`Status with ID ${newStatus} not found`);
            }

            await prisma.task_Comment.create({
                data: {
                    message: `updated the status from ${oldStatus} to ${newStatusRecord.name}`,
                    type: 'activity',
                    task_id: taskId,
                    user_id: parseInt(userId),
                }
            });
        }
    } catch (error) {
        console.error('Error in updating task status:', error);
        throw error; // Rethrow to be handled by the Socket.IO event listener
    }
};
