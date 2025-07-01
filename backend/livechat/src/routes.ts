import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { BlockUserBody, blockUserSchema } from "./schemas/blockUser.schemas";
import { GetMessagesBody, getMessagesSchema } from "./schemas/createMessage.schemas";
import { findAllDbAsync, getDbAsync, runDbAsync } from "./databaseServices";
import { blockUser } from "./services/msgCmdServices";
import { CommandResult } from "./interfaces/types";

export async function registerRoutes(fastify: FastifyInstance)
{
    fastify.get("/", (req,res) => {
        return ({message: "hello"})
    })

fastify.get('/messages/:user1/:user2', async (req: FastifyRequest, reply: FastifyReply) => {
  const { user1, user2 } = req.params as { user1: string; user2: string };
  try {
    const messages: Message[] = await findAllDbAsync(`SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? and receiver_id = ?)`, [user1,user2,user2,user1])
    reply.send(messages);
  } catch (err) {
    console.error(err);
    reply.status(500).send({ error: 'Database error' });
  }
});

fastify.get("/chat", (req, reply) => {
  reply.type('text/html').sendFile('index.html')
})

fastify.post("/blockuser",{schema: blockUserSchema}, async (req: FastifyRequest,reply: FastifyReply) => {
    const { user, blocked_user } = req.body as { user: string, blocked_user: string };
    const blocker_user = user
    
    const result: CommandResult = await blockUser(blocker_user,blocked_user)

    if (result.error)
    {
      reply.send({message: result.error})
    }
    else
    {
      reply.send({message:result.replyMessage})
    }
})
}