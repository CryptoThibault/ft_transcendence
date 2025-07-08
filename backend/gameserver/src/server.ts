import Fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import {Server} from "socket.io"
import newPlayerJoined, { createRoom } from './roomService.js';
import { keys, rightPaddle} from './serversidegame/state.js';
import { initSocket, io } from './initSocket.js';
import fastifyCors from '@fastify/cors';

const PORT = 6001;

export const rooms = new Map()

async function buildServer() 
{
  const fastify = Fastify();
  await fastify.register(fastifyCors, {
  origin: ["http://127.0.0.1:5500"],
  methods: ["GET", "POST"],
});
  fastify.get('/api/ping', async (req, reply) => {
  return { pong: true };
  });

  fastify.get('/create-room', (req, reply) => {
    const roomName = createRoom();
    reply.send({"roomName": roomName})
  })

  fastify.listen({ port: PORT }, (err, address) => {

  initSocket(fastify)

  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
  });  
}
buildServer()