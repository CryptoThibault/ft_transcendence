import Fastify, {FastifyInstance ,FastifyReply, FastifyRequest } from "fastify"
import jwt from '@fastify/jwt';

export async function registerAuth(fastify: FastifyInstance) {
  fastify.register(jwt, {
    secret: 'secret',
  });

  fastify.decorate("authenticate", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: "Unauthorized" });
    }
  });
}
