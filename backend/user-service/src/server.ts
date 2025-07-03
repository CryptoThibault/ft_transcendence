//backend/user-service/src/server.ts
import fastify from 'fastify';
import cookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';

import userRoutes from './routes/user.routes.js';
import { connectToUserDatabase } from './plugins/sqlite.js';
import { PORT } from './config/env.js';
import { User } from './models/user.models.js';

import { Server, Socket } from 'socket.io';
import http from 'http';

const app = fastify({ /*logger: true*/ });
const server = http.createServer(app.server);
const io = new Server(server, {
    cors: {
        origin: '*', // Adjust CORS origin as per frontend URL
        methods: ["GET", "POST"] // Specify allowed methods
    },
});
app.register(cookie);
app.register(fastifyMultipart, {
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

app.register(userRoutes, { prefix: '/api/v1/user' });

app.get('/', async (_req, reply) => {
    return reply.send({ message: 'Welcome to User API' });
});
io.on('connection', async (socket: Socket) => {
    const userId = Number(socket.handshake.query.userId);
    if (isNaN(userId)) {
        console.log('Invalid or no user ID provided in socket connection query');
        socket.disconnect(true);
        return;
    }
    try {
        const updatedOnline = await User.update(userId, { onlineStatus: true });
        if (updatedOnline) {
            console.log(`User ${userId} is now online`);
            socket.broadcast.emit('userOnline', { userId });
        } else {
            console.log(`User ${userId} could not be marked online (maybe not found or already online).`);
        }
    } catch (error) {
        console.error(`Error setting user ${userId} online:`, error);
    }
    socket.on('disconnect', async () => {
        try {
            const updatedOffline = await User.update(userId, { onlineStatus: false });
            if (updatedOffline) {
                console.log(`User ${userId} went offline`);
                socket.broadcast.emit('userOffline', { userId });
            } else {
                 console.log(`User ${userId} could not be marked offline (maybe not found or already offline).`);
            }
        } catch (error) {
            console.error(`Error setting user ${userId} offline:`, error);
        }
    });
});

const start = async () => {
    try {
        await connectToUserDatabase();
        const port = parseInt(PORT ?? '3001', 10);
        await app.listen({ port, host: '0.0.0.0' });
        app.log.info(`User API (HTTP) is running on http://localhost:${port}`);
        server.listen(3002, () => {
            console.log('Socket.IO server (WebSocket) is running on http://localhost:3002');
        });

    } catch (err) {
        app.log.error('Failed to start server:', err);
        process.exit(1);
    }
};

start();
export default app;
