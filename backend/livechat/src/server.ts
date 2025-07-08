import Fastify, { FastifyRequest } from "fastify"
import fastifyStatic from "@fastify/static"
import path from "path"
import { registerRoutes } from "./routes"
import { initSockets } from "./sockets"
import { db } from "./initDatabase"

async function buildServer() {
    
    const fastify = Fastify({logger: true})
    fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../frontend'),
    prefix: '/'
    })

    try {
        await fastify.register(registerRoutes)
        await fastify.ready()
        console.log("Registering sockets...")
        initSockets(fastify)
        await fastify.listen({
        port: 6002,
        host: "0.0.0.0"
    })
    } catch (error) {
        console.error('Server error:', error);
        process.exit(1);
    }
    
}

buildServer()