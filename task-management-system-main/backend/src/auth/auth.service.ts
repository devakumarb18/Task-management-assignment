import prisma from '../utils/prisma';
import bcrypt from 'bcrypt';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const registerUser = async (data: z.infer<typeof registerSchema>) => {
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
        },
    });

    const tokens = generateTokens(user);

    await prisma.refreshToken.create({
        data: {
            token: tokens.refreshToken,
            userId: user.id,
        },
    });

    return tokens;
};

export const loginUser = async (data: z.infer<typeof loginSchema>) => {
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const tokens = generateTokens(user);

    await prisma.refreshToken.create({
        data: {
            token: tokens.refreshToken,
            userId: user.id,
        },
    });

    return tokens;
};

export const refreshToken = async (token: string) => {
    const decoded = verifyRefreshToken(token) as any;

    const existingToken = await prisma.refreshToken.findUnique({
        where: { token },
    });

    if (!existingToken) {
        throw new Error('Invalid refresh token');
    }

    await prisma.refreshToken.delete({
        where: { token },
    });

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
        throw new Error('User not found');
    }

    const newTokens = generateTokens(user);

    await prisma.refreshToken.create({
        data: {
            token: newTokens.refreshToken,
            userId: user.id,
        },
    });

    return newTokens;
};

export const logoutUser = async (token: string) => {
    await prisma.refreshToken.delete({
        where: { token },
    });
};
