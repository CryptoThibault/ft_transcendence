//backend/auth-service/src/routes/verifyToken.route.ts
import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import { AuthUser } from '../models/auth.models';

export default async function verifyTokenRoute(app: FastifyInstance) {
	app.post('/verify-token', async (req, reply) => {
    	try {
      		const { token } = req.body as { token: string };
			if (!token)
				return reply.status(400).send({ message: 'Token is required' });
			const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; twoFactor?: boolean };
			if (decoded.twoFactor)
				return reply.status(401).send({ message: '2FA required' });
			const user = await AuthUser.findByPk(decoded.userId);
      		if (!user)
				return reply.status(401).send({ message: 'User not found' });
			return {
        		userId: user.id,
        		email: user.email,
      		};
    	} catch (err) {
      		return reply.status(401).send({ message: 'Unauthorized', error: (err as Error).message });
    	}
  	});
}
