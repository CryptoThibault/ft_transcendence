import { FastifyInstance } from 'fastify';

import { currentUser, /*userByEmail,*/ updateCurrentUserName,
        onlineStatus, /*lastSeen,*/ uploadAvatar, addFriend, 
        getFriendsList, recordMatch, getCurrentUserMatches,
        getUserMatchHistory, getLeaderboard,
        acceptFriendshipRequest
} from "../controllers/session.controller.js";

import { createUser } from '../controllers/user.controllers.js';
import { authorize } from '../middleware/auth.middleware.js';
import { deleteCurrentUser, deleteAvatar, acceptFriendRequest, getAllUsers   } from '../controllers/session.controller.js';

interface UpdateUserRoute {
  Body: {
    name: string;
  };
}

async function userRoutes(fastify: FastifyInstance) {
    fastify.post('/', createUser);    
    fastify.get('/me', { preHandler: authorize }, currentUser);
    fastify.get('/users', { preHandler: authorize }, getAllUsers);
    fastify.put<UpdateUserRoute>('/me', { preHandler: authorize }, updateCurrentUserName);
    fastify.post('/me/avatar', { preHandler: authorize }, uploadAvatar);
    fastify.get('/me/status', { preHandler: authorize }, onlineStatus);  
    fastify.post('/me/friends', { preHandler: authorize }, addFriend);
    //fastify.post('/me/friends/accept', { preHandler: authorize }, acceptFriendRequest);
    fastify.get('/me/friends', { preHandler: authorize }, getFriendsList);
    //bince added this
    fastify.post('/me/friends/accept', { preHandler: authorize }, acceptFriendshipRequest);
    fastify.post('/matches', { preHandler: authorize }, recordMatch);
    fastify.get('/me/matches', { preHandler: authorize }, getCurrentUserMatches);
    fastify.get('/:id/matches', { preHandler: authorize }, getUserMatchHistory);
    fastify.get('/leaderboard', { preHandler: authorize }, getLeaderboard);
    fastify.delete('/me', { preHandler: authorize }, deleteCurrentUser);
    fastify.delete('/me/avatar', { preHandler: authorize }, deleteAvatar);
}

export default userRoutes;