//backend/user-service/src/server.ts
import fastify from 'fastify';
import cookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';

import userRoutes from './routes/user.routes';
//import helperUserRoutes from './routes/helperUser.routes';
import { connectToDatabase } from './plugins/sequelize';
import { PORT } from './config/env';
import { User } from './models/user.models';

//  Add imports for WebSocket support
import { Server, Socket } from 'socket.io';
import http from 'http';

const app = fastify({ logger: true });
//  Create raw HTTP server from Fastify
const server = http.createServer(app.server as any);
const io = new Server(server, {
	cors: {
    	origin: '*',
  	},
});
app.register(cookie);
app.register(fastifyMultipart, {
	limits: { fileSize: 5 * 1024 * 1024 },
});
app.register(userRoutes, { prefix: '/api/v1/user' });
//app.register(helperUserRoutes, { prefix: '/api/v1/helperuser' });
app.get('/', async (_req, reply) => {
	return reply.send({ message: 'Welcome to User API' });
});
// Set up Socket.IO
io.on('connection', async (socket: Socket) => {
	const userId = Number(socket.handshake.query.userId);
  	if (!userId) {
    	console.log('No user ID provided in socket connection');
    	return;
  	}
	// Set user online
  	await User.update({ onlineStatus: true }, { where: { id: userId } });
  	console.log(`User ${userId} is now online`);
  	socket.broadcast.emit('userOnline', { userId });
  	socket.on('disconnect', async () => {
		await User.update({ onlineStatus: false }, { where: { id: userId } });
    	console.log(`User ${userId} went offline`);
    	socket.broadcast.emit('userOffline', { userId });
  	});
});
// Start both HTTP and WebSocket servers
const start = async () => {
	try {
    	await connectToDatabase();
    	const port = parseInt(PORT ?? '3001', 10);
    	await app.listen({ port, host: '0.0.0.0' }); // Fastify HTTP server
    	server.listen(3002); // Socket.IO (WebSocket) server
    	app.log.info(`User API is running on http://localhost:${port}`);
    	console.log('Socket.IO server is running on http://localhost:3002');
  	} catch (err) {
    	app.log.error(err);
    	process.exit(1);
  	}
};

start();
export default app;
