//backend/user-service/src/routes/helperUser.routes.ts
/*import { FastifyInstance } from 'fastify';
import { getUser, getUsers } from '../controllers/user.controllers';
import { authorize } from '../middleware/auth.middleware';

async function helperUserRoutes(fastify: FastifyInstance) {
	// GET / - all users
	fastify.get('/', { preHandler: authorize }, getUsers);
	// GET /:id - single user (protected)
	fastify.get<{
		Params: { id: string };
	}>('/:id', { preHandler: authorize }, getUser);
}

export default helperUserRoutes;*/