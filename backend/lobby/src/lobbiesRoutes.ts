import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { FastifyPluginAsync } from "fastify";
import { createLobby, getLobbies, joinLobby } from "./lobbyService";
import { joinLobbySchema, JoinLobbyBody } from './schemas/joinLobby.schemas'
import { CreateLobbyBody, createLobbySchema } from "./schemas/createLobby.schemas";
const lobbiesRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) =>
{

//to create lobbies, requries lobby name, capacity, user (admin)
fastify.post('/create-lobby', {
    schema: createLobbySchema,
  },
  async (request: FastifyRequest<{ Body: CreateLobbyBody }>, reply: FastifyReply) => {
    const { name, capacity, creator_id } = request.body as { name: string; capacity: number; creator_id: number };
    try {
      await createLobby(name,capacity,creator_id)
      reply.send({message: "Lobby created, creator added", name, capacity, creator_id})
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({message: error.message})
    }
  })


fastify.post('/join-lobby',  {
    schema: joinLobbySchema,
  },
  async (request: FastifyRequest<{ Body: JoinLobbyBody }>, reply: FastifyReply) => 
  {
    const { lobby_id, user_id } = request.body as { lobby_id: number; user_id: number;}
    try {
      await joinLobby(user_id, lobby_id)
      reply.send({message: "User succesfully joined to lobby",user_id,lobby_id})
    } catch (error: any) {
      reply.code(error.statusCode || 500).send({message: error.message})
    }
  })

fastify.get('/get-lobby/:lobbyId', async (request: any, reply: any) => 
{
  const {lobby_id} = request.params as {lobby_id: string}
  const lobbyIdInt = parseInt(lobby_id, 10)
  try {
    const lobbyInfos = await getLobbies(lobbyIdInt)
    reply.send(lobbyInfos)
  } catch (error: any) {
    reply.code(500).send({message: error.message})
  }
})

}

export default lobbiesRoutes