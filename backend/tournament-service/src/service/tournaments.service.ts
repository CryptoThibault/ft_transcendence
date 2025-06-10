//backend/tournament-service/tournament.service.ts
import { Tournament } from '../models/tournament.models';
import { PlayerTournament } from '../models/playerTournament.models';
import { TournamentMatchState, TournamentMatch } from '../models/tournamentMatch.models';

import axios from 'axios';

async function reportMatchToUserService(
    matchData: {
        player1Id: number;
        player2Id: number;
        winnerId: number;
        player1Score: number;
        player2Score: number;
        playedAt?: Date;
    },
    token: string
) {
    const payloadForUserService = {
        player2Id: matchData.player2Id,
        winnerId: matchData.winnerId,
        score: `${matchData.player1Score}-${matchData.player2Score}`
    };
    console.log('Sending payload to user-service/matches:', payloadForUserService); // Add this for debugging
    await axios.post(
        'http://user-service:5501/api/v1/user/matches',
        payloadForUserService,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    console.log('Match reported to user-service successfully.'); // Confirmation log
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
    console.log('Players found for tournament', tournament_id, ':', players.map(p => p.playerId));
    if (players.length < 2)
        throw new Error('Not enough players to start tournament (minimum 2 needed).');
    const shuffled = players.sort(() => 0.5 - Math.random());
    const matches = [];
    for (let i = 0; i < shuffled.length; i += 2) {
        matches.push({
            tournamentId: tournament_id,
            roundNumber: 1,
            matchNumberInRound: i / 2 + 1,
            player1Id: shuffled[i]?.playerId,
            player2Id: shuffled[i + 1]?.playerId,
            winnerId: null,
            score: null,
            state: TournamentMatchState.PENDING,
        });
    }
    console.log('Attempting to bulkCreate matches:', JSON.stringify(matches, null, 2));
    try {
        const createdMatches = await TournamentMatch.bulkCreate(matches);
        console.log('Matches successfully created!');
        return createdMatches;
    } catch (error) {
        console.error('Sequelize bulkCreate error:', error);
        throw error;
    }
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

export const submitTournamentResult = async (matchId: number, { winner_id, score }: SubmitResultPayload,
  token: string) => {
	const match = await TournamentMatch.findByPk(matchId);
  	if (!match) throw new Error(`Match with ID ${matchId} not found`);
  	if (match.state === TournamentMatchState.COMPLETED) throw new Error('Match already completed');
	const pendingMatches = await TournamentMatch.findAll({
    	where: {
      		tournamentId: match.tournamentId,
      		roundNumber: match.roundNumber,
      		state: TournamentMatchState.PENDING,
    	},
  	});
	const firstPending = pendingMatches.sort((a, b) => a.matchNumberInRound - b.matchNumberInRound)[0];
  	if (firstPending.id !== match.id)
    	throw new Error(`This match cannot be submitted yet. Wait for Match #${firstPending.matchNumberInRound}.`);
	match.state = TournamentMatchState.COMPLETED;
  	match.winnerId = winner_id;
  	match.score = score;
  	await match.save();
	const [player1Score, player2Score] = score.split('-').map(Number);
  	if (isNaN(player1Score) || isNaN(player2Score))
    	throw new Error('Invalid score format. Expected "X-Y"');
	await reportMatchToUserService({ player1Id: match.player1Id!, player2Id: match.player2Id!,
		winnerId: winner_id, player1Score, player2Score, playedAt: new Date(), }, token );
	const remainingMatches = await TournamentMatch.findAll({
    	where: {
      		tournamentId: match.tournamentId,
      		roundNumber: match.roundNumber,
      		state: TournamentMatchState.PENDING,
    	},
  	});
	if (remainingMatches.length === 0)
		await createNextRound(match.tournamentId, match.roundNumber);
	return match;
};

async function createNextRound(tournament_id: number, completedRound: number) {
    console.log(`[createNextRound] Starting for Tournament ID: ${tournament_id}, Completed Round: ${completedRound}`);
    const completedMatches = await TournamentMatch.findAll({
        where: {
            tournamentId: tournament_id,
            roundNumber: completedRound,
            state: TournamentMatchState.COMPLETED,
        },
        order: [['matchNumberInRound', 'ASC']],
    });
    if (completedMatches.length === 0) {
        console.warn(`[createNextRound] No completed matches found for Tournament ID: ${tournament_id}, Round: ${completedRound}. Cannot create next round.`);
        return; // No matches to process for the next round
    }
    const winners = completedMatches
        .map(match => match.winnerId)
        .filter((winnerId): winnerId is number => winnerId !== null && winnerId !== undefined); // Ensure valid winner IDs
    console.log(`[createNextRound] Winners from Round ${completedRound}: ${winners.length > 0 ? winners.join(', ') : 'None'}`);
    // If there's only one winner, the tournament is over!
    if (winners.length === 1) {
        const overallWinnerId = winners[0];
        console.log(`[createNextRound] Tournament ${tournament_id} completed! Overall Winner: ${overallWinnerId}`);        
        // Update the Tournament model status and winner
        const tournament = await TournamentMatch.findByPk(tournament_id);
        if (tournament) {
            tournament.state = TournamentMatchState.COMPLETED;
            tournament.winnerId = overallWinnerId;
            await tournament.save();
            console.log(`[createNextRound] Tournament ${tournament_id} marked as COMPLETED.`);
        } else {
            console.warn(`[createNextRound] Tournament ${tournament_id} not found to mark as completed.`);
        }
        return; // Exit, as the tournament has concluded
    }
    const nextMatches = [];
    for (let i = 0; i < winners.length; i += 2) {
        const player1Id = winners[i];
        const player2Id = winners[i + 1] || null;
        if (!player1Id) {
            console.warn(`[createNextRound] Skipping match creation due to missing player1Id at index ${i}.`);
            continue;
        }
        nextMatches.push({
            tournamentId: tournament_id,
            roundNumber: completedRound + 1,
            matchNumberInRound: Math.floor(i / 2) + 1,
            player1Id: player1Id,
            player2Id: player2Id, // Will be null for byes if `winners.length` is odd
            winnerId: null,      // New matches are pending
            score: null,         // New matches have no score
            state: TournamentMatchState.PENDING,
        });
    }
    if (nextMatches.length > 0) {
        console.log(`[createNextRound] Attempting to bulkCreate ${nextMatches.length} matches for Round ${completedRound + 1}:`);
        console.log(JSON.stringify(nextMatches, null, 2));        
        try {
            const createdMatches = await TournamentMatch.bulkCreate(nextMatches);
            console.log(`[createNextRound] Matches successfully created for Round ${completedRound + 1}!`);
            return createdMatches;
        } catch (error) {
            console.error(`[createNextRound] Sequelize bulkCreate error for next round:`, error);
            throw error;
        }
    } else {
        console.log(`[createNextRound] No further matches to create for Tournament ID: ${tournament_id}.`);
    }
}


/*export const submitTournamentResult = async (matchId: number, { winner_id, score }: SubmitResultPayload) => {
    const match = await TournamentMatch.findByPk(matchId);
    if (!match) throw new Error(`Match with ID ${matchId} not found`);
    if (match.state === TournamentMatchState.COMPLETED) throw new Error('Match already completed');
    const pendingMatches = await TournamentMatch.findAll({
        where: {
            tournamentId: match.tournamentId,
            roundNumber: match.roundNumber,
            state: TournamentMatchState.PENDING,
        },
    });
    const firstPending = pendingMatches.sort((a, b) => a.matchNumberInRound - b.matchNumberInRound)[0];
    if (firstPending.id !== match.id)
        throw new Error(`This match cannot be submitted yet. Wait for Match #${firstPending.matchNumberInRound}.`);
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
        playedAt: new Date(),
    });
    const remainingMatches = await TournamentMatch.findAll({
        where: {
            tournamentId: match.tournamentId,
            roundNumber: match.roundNumber,
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
            tournamentId: tournament_id,
            roundNumber: completedRound,
            state: TournamentMatchState.COMPLETED,
        },
        order: [['matchNumberInRound', 'ASC']],
    });
    const nextMatches = [];
    for (let i = 0; i < completedMatches.length; i += 2) {
        const winner1 = completedMatches[i]?.winnerId;
        const winner2 = completedMatches[i + 1]?.winnerId || null;
        nextMatches.push({
            tournamentId: tournament_id,
            roundNumber: completedRound + 1,
            matchNumberInRound: i / 2 + 1,
            player1Id: winner1,
            player2Id: winner2,
            state: TournamentMatchState.PENDING,
        });
    }
    if (nextMatches.length > 0)
        await TournamentMatch.bulkCreate(nextMatches);
}*/

// ##################################################################3


/*export const submitTournamentResult = async (matchId: number, { winner_id, score }: SubmitResultPayload) => {
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
};*/

/*async function createNextRound(tournament_id: number, completedRound: number) {
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
}*/

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
