// backend/auth-service/src/server.ts
import fastify from 'fastify';
import cookie from '@fastify/cookie';

import authRoutes from './routes/auth.routes';
import { connectToDatabase } from './plugins/sequelize.js';
//import { Sequelize, DataTypes, Model } from 'sequelize';
import { PORT } from './config/env';
/*---- adding this*/
import verifyTokenRoute from './routes/verifyToken.route';

const app = fastify({ logger: true });

app.register(cookie);
app.register(authRoutes, { prefix: '/api/v1/auth' });
app.register(verifyTokenRoute, { prefix: '/api/v1/auth' });

app.get('/', async (_req, reply) => {
	return reply.send({ message: 'Welcome to Authentication API' });
});

const start = async () => {
	try {
		await connectToDatabase();
    	const port = parseInt(PORT ?? '3000', 10);
    	await app.listen({ port, host: '0.0.0.0' });
    	app.log.info(`Auth API is running on http://localhost:${port}`);
  	} catch (err) {
    	app.log.error(err);
    	process.exit(1);
  	}
};

start();
export default app;