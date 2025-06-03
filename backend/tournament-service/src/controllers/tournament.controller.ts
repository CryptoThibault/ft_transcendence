// backend/tournament-service/src/controllers/tournament.controller.ts
import { FastifyRequest, FastifyReply, RouteGenericInterface } from 'fastify';
import { createMatch, submitResult } from '../service/casualMatches.service';
import { PlayerTournament } from '../models/playerTournament.models'
import * as svc from '../service/tournaments.service';

// Casual match result
interface CreateCasualMatchRoute {
	Body: { player1_id: number; player2_id: number };
}
// For /matches/:id/result
interface SubmitCasualMatchResultRoute extends RouteGenericInterface {
	Params: { id: number; };
  	Body: { winner_id: number; score: string; };
}
// For /tournament/:id/join
interface JoinTournamentRoute extends RouteGenericInterface {
	Params: { id: number; };
  	Body: { player_id: number; };
}
// For /tournament/:id/start and /tournament/:id/bracket
interface TournamentIdParamRoute extends RouteGenericInterface {
	Params: { id: number; };
}
// For /tournament/:matchId/result
interface SubmitTournamentMatchResultRoute extends RouteGenericInterface {
	Params: { matchId: number; };
	Body: { winner_id: number; score: string; };
}

export async function createCasualMatch(request: FastifyRequest<CreateCasualMatchRoute>,
reply: FastifyReply) {
	try {
    	const match = await createMatch(request.body);
    	reply.status(201).send({
      		success: true,
      		message: 'Casual match created successfully',
      		data: match,
    	});
  	} catch (error) {
    	reply.status(500).send({
      		success: false,
      		message: (error as Error).message || 'Internal server error',
    	});
  	}
}

export async function submitCasualMatchResult(req: FastifyRequest<SubmitCasualMatchResultRoute>,
  reply: FastifyReply) {
	try {
    	const result = await submitResult(+req.params.id, req.body);
    	reply.status(200).send({
      		success: true,
      		message: 'Casual match result submitted successfully',
      		data: result,
    	});
  	} catch (error) {
    	reply.status(500).send({
      		success: false,
      		message: (error as Error).message || 'Internal server error',
    	});
  	}
}

export async function createTournament(request: FastifyRequest<{ Body: { name: string; players?: number[] } }>,
  reply: FastifyReply) {
	try {
    	const tournament = await svc.createTournament(request.body);
    	reply.status(201).send({
      		success: true,
      		message: 'Tournament created successfully',
      		data: tournament,
    	});
  	} catch (error) {
    	reply.status(500).send({
      		success: false,
      		message: (error as Error).message || 'Internal server error',
    	});
  	}
}

export async function joinTournament(req: FastifyRequest<JoinTournamentRoute>,
  reply: FastifyReply) {
	try {
    	const result = await svc.joinTournament(+req.params.id, req.body.player_id);
    	reply.status(200).send({
      		success: true,
      		message: 'Joined tournament successfully',
      		data: result,
    	});
  	} catch (error) {
    	reply.status(500).send({
      		success: false,
      		message: (error as Error).message || 'Internal server error',
    	});
  	}
}

export async function startTournament(req: FastifyRequest<TournamentIdParamRoute>,
  reply: FastifyReply) {
	try {
    	const result = await svc.startTournament(+req.params.id);
    	reply.status(200).send({
      		success: true,
      		message: 'Tournament started successfully',
      		data: result,
    	});
  	} catch (error) {
    	reply.status(500).send({
      		success: false,
      		message: (error as Error).message || 'Internal server error',
    	});
  	}
}

export async function getTournamentBracket(req: FastifyRequest<TournamentIdParamRoute>,
  reply: FastifyReply) {
	try {
    	const bracket = await svc.getBracket(+req.params.id);
    	reply.status(200).send({
      		success: true,
      		message: 'Tournament bracket retrieved successfully',
      		data: bracket,
    	});
  	} catch (error) {
    	reply.status(500).send({
      		success: false,
      		message: (error as Error).message || 'Internal server error',
    	});
  	}
}

export async function submitTournamentResult(req: FastifyRequest<SubmitTournamentMatchResultRoute>,
  reply: FastifyReply) {
	try {
    	const result = await svc.submitTournamentResult(+req.params.matchId, req.body);
    	reply.status(200).send({
      		success: true,
      		message: 'Tournament match result submitted successfully',
      		data: result,
    	});
  	} catch (error) {
    	reply.status(500).send({
      		success: false,
      		message: (error as Error).message || 'Internal server error',
    	});
  	}
}
