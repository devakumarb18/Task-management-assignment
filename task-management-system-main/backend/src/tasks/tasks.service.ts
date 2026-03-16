import prisma from '../utils/prisma';
import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    status: z.enum(['OPEN', 'DONE']).optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.enum(['OPEN', 'DONE']).optional(),
});

export const createTask = async (userId: string, data: z.infer<typeof createTaskSchema>) => {
    return prisma.task.create({
        data: {
            ...data,
            userId,
        },
    });
};

export const getTasks = async (
    userId: string,
    status?: string,
    search?: string,
    page: number = 1,
    limit: number = 10
) => {
    const skip = (page - 1) * limit;

    const whereClause = {
        userId,
        status: status ? status : undefined,
        title: search ? { contains: search } : undefined,
    };

    const [tasks, total] = await Promise.all([
        prisma.task.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.task.count({ where: whereClause }),
    ]);

    return {
        tasks,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getTaskById = async (userId: string, taskId: string) => {
    const task = await prisma.task.findUnique({
        where: { id: taskId },
    });

    if (!task || task.userId !== userId) {
        return null;
    }

    return task;
};

export const updateTask = async (userId: string, taskId: string, data: z.infer<typeof updateTaskSchema>) => {
    const task = await getTaskById(userId, taskId);

    if (!task) {
        throw new Error('Task not found');
    }

    return prisma.task.update({
        where: { id: taskId },
        data,
    });
};

export const deleteTask = async (userId: string, taskId: string) => {
    const task = await getTaskById(userId, taskId);

    if (!task) {
        throw new Error('Task not found');
    }

    return prisma.task.delete({
        where: { id: taskId },
    });
};
