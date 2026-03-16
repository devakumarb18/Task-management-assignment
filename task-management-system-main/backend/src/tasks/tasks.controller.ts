import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as taskService from './tasks.service';
import { z } from 'zod';

export const create = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const data = taskService.createTaskSchema.parse(req.body);
        const task = await taskService.createTask(userId, data);
        res.status(201).json(task);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
};

export const getAll = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { status, search, page, limit } = req.query;

        const pageNum = page ? parseInt(page as string) : 1;
        const limitNum = limit ? parseInt(limit as string) : 10;

        const result = await taskService.getTasks(
            userId,
            status as string,
            search as string,
            pageNum,
            limitNum
        );
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getOne = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const task = await taskService.getTaskById(userId, req.params.id as string);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const update = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const data = taskService.updateTaskSchema.parse(req.body);
        const task = await taskService.updateTask(userId, req.params.id as string, data);
        res.json(task);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        } else if (error.message === 'Task not found') {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
};

export const remove = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        await taskService.deleteTask(userId, req.params.id as string);
        res.status(204).send();
    } catch (error: any) {
        if (error.message === 'Task not found') {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
