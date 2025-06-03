//backend/tournament-service/src/middleware/auth.middleware.ts
import { verifyToken } from '../utils/verify.token';
import { FastifyRequest, FastifyReply } from 'fastify';

interface AuthVerifyResponseData { 
    userId: number;
    email: string;
}
interface AuthenticatedUser {
    id: number;
    email: string;
}
declare module 'fastify' {
    interface FastifyRequest {
        user: AuthenticatedUser;
    }
}

export const authorize = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer '))
            return res.status(401).send({ message: 'Unauthorized: Missing or invalid authorization header.' });
        const token = authHeader.split(' ')[1];
        const decoded = await verifyToken(token) as AuthVerifyResponseData;
        if (!decoded || typeof decoded !== 'object' || !('userId' in decoded))
            return res.status(401).send({ message: 'Unauthorized: Invalid data received from authentication service.' });
        req.user = {
            id: decoded.userId,
            email: decoded.email,
        };
    } catch (error) {
        console.error('Error during authorization:', error);
        const statusCode = (error as any).statusCode || 401;
        return res.status(statusCode).send({
            message: 'Unauthorized',
            error: (error as Error).message,
        });
    }
};
