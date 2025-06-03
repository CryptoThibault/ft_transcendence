// backend/user-service/src/middlewares/auth.middleware.ts
import { verifyToken } from '../utils/verify.token';
import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../models/user.models';

interface JwtPayload {
    userId: number;
    //twoFactor?: boolean;
}
declare module 'fastify' {
    interface FastifyRequest {
        user: User;
    }
}

export const authorize = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            //console.log('No or malformed auth header');
            return res.status(401).send({ message: 'Unauthorized: Missing or invalid authorization header.' });
        }
        const token = authHeader.split(' ')[1];
        //console.log('Auth header:', authHeader);
        //console.log('Token:', token);
        //console.log('Calling verifyToken...');
        const decoded = await verifyToken(token);
        //console.log('Decoded via Auth Service:', decoded);
        //console.log('Looking for user in DB with ID:', decoded.userId);
        if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
            //console.log('Auth Service returned invalid payload: Missing userId');
            return res.status(401).send({ message: 'Unauthorized: Invalid token payload from auth service.' });
        }
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            //console.log('No user found in DB for userId:', decoded.userId);
            return res.status(401).send({ message: 'Unauthorized: User does not exist in User Service DB.' });
        }
        //console.log('Authorized user:', user.id);
        req.user = user;
    } catch (error) {
        console.error('Error during authorization:', error);
        const statusCode = (error as any).statusCode || 500;
        return res.status(statusCode).send({
            message: 'Unauthorized',
            error: (error as Error).message,
        });
    }
};
