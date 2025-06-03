//backend/tournament-service/tournament.service.ts
import { Tournament } from '../models/tournament.models';
import { PlayerTournament } from '../models/playerTournament.models';
import { TournamentMatchState, TournamentMatch } from '../models/tournamentMatch.models';

import axios from 'axios';

async function reportMatchToUserService(match: {
	player1Id: number;
  	player2Id: number;
  	winnerId: number;
  	player1Score: number;
  	player2Score: number;
  	playedAt?: Date;
}) {
	await axios.post('http://user-service:5501/api/v1/user/matches', match);
}

interface SubmitResultPayload {
    winner_id: number;
    score: string;
}

export const createTournament = async ({ name }: { name:any }) => Tournament.create({ name });

export const joinTournament = async (tournament_id: number, player_id: number) => PlayerTournament.create({
	tournamentId: tournament_id, playerId: player_id   
});

export const startTournament = async (tournament_id: number) => {
    const players = await PlayerTournament.findAll({
        where: { tournamentId: tournament_id }
    });
    const shuffled = players.sort(() => 0.5 - Math.random());
    const matches = [];
    for (let i = 0; i < shuffled.length; i += 2) {
        matches.push({
            tournament_id,
            round_number: 1,
            match_number_in_round: i / 2 + 1,
            player1_id: shuffled[i]?.playerId || null,
            player2_id: shuffled[i + 1]?.playerId || null,
			state: TournamentMatchState.PENDING,
        });
    }
    return TournamentMatch.bulkCreate(matches);
};

export const getBracket = async (tournamentId: number) => {
	const matches = await TournamentMatch.findAll({
		where: { tournamentId },
    	order: [['roundNumber', 'ASC'], ['matchNumberInRound', 'ASC']],
  	});
	const rounds: Record<number, TournamentMatch[]> = {};
  	matches.forEach((match) => {
		if (!rounds[match.roundNumber]) rounds[match.roundNumber] = [];
    	rounds[match.roundNumber].push(match);
  	});
	return Object.entries(rounds).map(([round, matches]) => ({
    	round: +round,
    	matches,
  	}));
};


export const submitTournamentResult = async (matchId: number, { winner_id, score }: SubmitResultPayload) => {
	const match = await TournamentMatch.findByPk(matchId);
	if (!match) throw new Error(`Match with ID ${matchId} not found`);
  	if (match.state === TournamentMatchState.COMPLETED) throw new Error('Match already completed');
	// Validate correct order
  	const pendingMatches = await TournamentMatch.findAll({
    	where: {
      		tournamentId: match.tournamentId,
      		round_number: match.roundNumber,
      		state: TournamentMatchState.PENDING,
    	},
  	});
	const firstPending = pendingMatches.sort((a, b) => a.matchNumberInRound - b.matchNumberInRound)[0];
  	if (firstPending.id !== match.id) {
    	throw new Error(`This match cannot be submitted yet. Wait for Match #${firstPending.matchNumberInRound}.`);
  	}
	// Update match state
  	match.state = TournamentMatchState.COMPLETED;
  	match.winnerId = winner_id;
  	match.score = score;
  	await match.save();
	// --- REPORT TO USER-SERVICE ---
  	const [player1Score, player2Score] = score.split('-').map(Number);
  	if (isNaN(player1Score) || isNaN(player2Score))
    	throw new Error('Invalid score format. Expected "X-Y"');
	await reportMatchToUserService({
		player1Id: match.player1Id!,
    	player2Id: match.player2Id!,
    	winnerId: winner_id,
    	player1Score,
    	player2Score,
    	playedAt: new Date()
  	});
	// Queue next round if this was the last pending match
	const remainingMatches = await TournamentMatch.findAll({
    	where: {
      		tournament_id: match.tournamentId,
      		round_number: match.roundNumber,
      		state: TournamentMatchState.PENDING,
    	},
  	});
	if (remainingMatches.length === 0)
    	await createNextRound(match.tournamentId, match.roundNumber);
	return match;
};

async function createNextRound(tournament_id: number, completedRound: number) {
	const completedMatches = await TournamentMatch.findAll({
    	where: {
      		tournament_id,
      		round_number: completedRound,
      		state: TournamentMatchState.COMPLETED,
    	},
    	order: [['match_number_in_round', 'ASC']],
  	});
	const nextMatches = [];
  	for (let i = 0; i < completedMatches.length; i += 2) {
    	const winner1 = completedMatches[i]?.winnerId;
    	const winner2 = completedMatches[i + 1]?.winnerId || null;
		nextMatches.push({
      		tournament_id,
      		round_number: completedRound + 1,
      		match_number_in_round: i / 2 + 1,
      		player1_id: winner1,
      		player2_id: winner2,
      		state: TournamentMatchState.PENDING,
    	});
  	}
	if (nextMatches.length > 0)
    	await TournamentMatch.bulkCreate(nextMatches);
}

/*export const getBracket = async (tournament_id: number) => {
	const matches = await TournamentMatch.findAll({
		where: { tournament_id },
    	order: [['round_number', 'ASC'], ['match_number_in_round', 'ASC']],
  	});
	const rounds: any = {};
  	matches.forEach((match) => {
		if (!rounds[match.roundNumber]) rounds[match.roundNumber] = [];
    	rounds[match.roundNumber].push(match);
  	});
	return Object.entries(rounds).map(([round, matches]) => ({
    	round: +round,
    	matches,
  	}));
};

export const submitTournamentResult = async (matchId: number, { winner_id, score }: SubmitResultPayload) => {
  	const match = await TournamentMatch.findByPk(matchId);
	if (!match)
		throw new Error(`Match with ID ${matchId} not found`);
  	match.state = TournamentMatchState.COMPLETED;
  	match.winnerId = winner_id;
  	match.score = score;
  	await match.save();
  	return match;
};*/
