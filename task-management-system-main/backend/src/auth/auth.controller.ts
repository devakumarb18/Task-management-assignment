import { Request, Response } from 'express';
import * as authService from './auth.service';
import { registerSchema, loginSchema } from './auth.service';
import { z } from 'zod';

export const register = async (req: Request, res: Response) => {
    try {
        const data = registerSchema.parse(req.body);
        const tokens = await authService.registerUser(data);
        res.status(201).json(tokens);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const data = loginSchema.parse(req.body);
        const tokens = await authService.loginUser(data);
        res.status(200).json(tokens);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        } else {
            res.status(401).json({ error: error.message });
        }
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token required' });
        }
        const tokens = await authService.refreshToken(refreshToken);
        res.json(tokens);
    } catch (error: any) {
        res.status(403).json({ error: error.message });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await authService.logoutUser(refreshToken);
        }
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
