// backend/auth-service/src/controllers/google-auth.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { OAuth2Client } from 'google-auth-library';
import jwt, { SignOptions } from 'jsonwebtoken';

import { createUser, findUserByEmail, findUserByEmailWithSensitiveData } from '../services/user.service.js';
import { JWT_SECRET } from '../config/env.js';
import { userServiceClient } from '../utils/userServiceClient.js';
import { AuthUser, NewAuthUser, SafeAuthUser } from '../models/auth.models.js';

const client = new OAuth2Client();
const getJwtSecret = (): string => {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return JWT_SECRET;
};

export const googleAuth = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const { idToken } = req.body as { idToken: string };
        if (!idToken)
            return res.status(400).send({ message: 'Missing Google ID Token' });
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.name)
            return res.status(400).send({ message: 'Invalid Google token payload' });
        const { email, name } = payload;
        let user: SafeAuthUser | null = null;
        let createdNewUser = false;
        user = await findUserByEmail(email);
        if (!user) {
            const newUserInput: NewAuthUser = {
                name,
                email,
                password: '',
                twoFactorEnabled: false,
                twoFactorSecret: null
            };
            user = await createUser(newUserInput);
            createdNewUser = true;
            if (!user)
                throw new Error('Failed to create new user during Google auth.');
        }
        if (createdNewUser) {
            try {
                await userServiceClient.post('/', {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                });
            } catch (syncError: any) {
                console.error('User-service sync failed:', syncError.message);
                return res.status(502).send({ message: 'Failed to sync with user-service' });
            }
        }
        const secret = getJwtSecret();
        const signOptions: SignOptions = {
            expiresIn: '1h',//JWT_SECRET || '1h',
        };
        const token = jwt.sign({ userId: user.id }, secret, signOptions);
        return res.send({
            success: true,
            message: 'Google sign-in successful',
            data: {
                token,
                user,
            }
        });
    } catch (err: any) {
        console.error('Google auth error:', err);
        if (err.message === 'Failed to create new user during Google auth.')
            return res.status(500).send({ message: err.message });
        return res.status(err.statusCode || 500).send({
            success: false,
            message: 'Google authentication failed',
            error: err.message,
        });
    }
};
