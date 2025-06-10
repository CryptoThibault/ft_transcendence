//backend/tournament-service/src/routes/player.routes.ts
import { authorize } from '../middleware/auth.middleware';
import { FastifyInstance, preHandlerHookHandler } from 'fastify';
import { createCasualMatch, submitCasualMatchResult } from '../controllers/tournament.controller';
import { createTournament, joinTournament, startTournament, getTournamentBracket,
         submitTournamentResult } from '../controllers/tournament.controller';

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
