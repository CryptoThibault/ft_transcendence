//backend/user-service/src/src/user.routes.ts
import { FastifyInstance } from 'fastify';

import { currentUser, /*userByEmail,*/ updateCurrentUserName,
        onlineStatus, /*lastSeen,*/ uploadAvatar, addFriend, 
        getFriendsList, recordMatch, getCurrentUserMatches,
        getUserMatchHistory, getLeaderboard
} from "../controllers/session.controller";

import { createUser } from '../controllers/user.controllers';
import { authorize } from '../middleware/auth.middleware';
import { deleteCurrentUser } from '../controllers/session.controller';

interface UpdateUserRoute {
  Body: {
    name: string;
  };
}

async function userRoutes(fastify: FastifyInstance) {
    fastify.post('/', createUser);    
    fastify.get('/me', { preHandler: authorize }, currentUser);
    //fastify.put('/me',  { preHandler: authorize }, updateCurrentUserName);
    fastify.put<UpdateUserRoute>('/me', { preHandler: authorize }, updateCurrentUserName);
    fastify.post('/me/avatar', { preHandler: authorize }, uploadAvatar);
    fastify.get('/me/status', { preHandler: authorize }, onlineStatus);  
    fastify.post('/me/friends', { preHandler: authorize }, addFriend);
    fastify.get('/me/friends', { preHandler: authorize }, getFriendsList);
    fastify.post('/matches', { preHandler: authorize }, recordMatch);
    fastify.get('/me/matches', { preHandler: authorize }, getCurrentUserMatches);
    fastify.get('/:id/matches', { preHandler: authorize }, getUserMatchHistory);
    fastify.get('/leaderboard', { preHandler: authorize }, getLeaderboard);
    fastify.delete('/me', { preHandler: authorize }, deleteCurrentUser);
}

export default userRoutes;