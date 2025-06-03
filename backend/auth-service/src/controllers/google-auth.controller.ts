// backend/auth-service/src/controllers/google-auth.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { AuthUser } from '../models/auth.models';
import { JWT_SECRET } from '../config/env';
import { userServiceClient } from '../utils/userServiceClient';

const client = new OAuth2Client();

export const googleAuth = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const { idToken } = req.body as { idToken: string };
        if (!idToken)
            return res.status(400).send({ message: 'Missing Google ID Token' });
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID, // define in .env
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.name)
            return res.status(400).send({ message: 'Invalid Google token payload' });
        const { email, name } = payload;
        let user = await AuthUser.findOne({ where: { email } });
        if (!user) {
            user = await AuthUser.create({
                name: String,
                email: String,
                password: String,
                twoFactorEnabled: false,
                twoFactorSecret: null
            });
            try {
                await userServiceClient.post('/', {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                });
            } catch (err) {
                console.error('User-service sync failed:', err);
                return res.status(502).send({ message: 'Failed to sync with user-service' });
            }
        }
        if (!JWT_SECRET) throw new Error('JWT_SECRET not set');
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        return res.send({
            success: true,
            message: 'Google sign-in successful',
            data: {
                token,
                user,
            }
        });
    } catch (err) {
        console.error('Google auth error:', err);
        return res.status(500).send({ message: 'Google authentication failed', error: (err as Error).message });
    }
};
