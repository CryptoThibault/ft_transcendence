//backend/tournament-service/src/routes/player.routes.ts
import { authorize } from '../middleware/auth.middleware.js';
import { FastifyInstance, preHandlerHookHandler } from 'fastify';
import { createCasualMatch, submitCasualMatchResult } from '../controllers/tournament.controller.js';
import { createTournament, joinTournament, startTournament, getTournamentBracket,
         submitTournamentResult } from '../controllers/tournament.controller.js';

export default async function playerRoutes(fastify: FastifyInstance) {
	// Casual Match routes
  	fastify.post('/matches/challenge', {preHandler: [authorize]}, createCasualMatch);
  	fastify.post('/matches/:id/result', { preHandler: authorize }, submitCasualMatchResult);
  	// Tournament routes
  	fastify.post('/tournament', { preHandler: authorize }, createTournament);
  	fastify.post('/tournament/:id/join', { preHandler: authorize }, joinTournament);
  	fastify.post('/tournament/:id/start', { preHandler: authorize }, startTournament);
  	fastify.get('/tournament/:id/bracket', { preHandler: authorize }, getTournamentBracket);
  	fastify.post('/tournament/matches/:matchId/result', { preHandler: authorize }, submitTournamentResult);
}
