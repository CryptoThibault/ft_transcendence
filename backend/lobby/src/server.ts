import Fastify, { FastifyRequest } from "fastify"
import lobbiesRoutes from "./lobbiesRoutes";

async function buildServer() {
    const fastify = Fastify()
    fastify.register(lobbiesRoutes)
    fastify.get("/", (req,res) =>
    {
        res.send({message:"hello from tournament api!"})
    })
    await fastify.listen({
        port: 6003,
        host: "0.0.0.0"
    })
}

buildServer()