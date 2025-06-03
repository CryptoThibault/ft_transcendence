//backend/tournament-service/casualMatches.service.ts
import { CasualMatch, CasualMatchState } from '../models/casualMatch.models';

interface CreateMatchPayload {
    player1_id: number;
    player2_id: number;
}

interface SubmitResultPayload {
    winner_id: number;
    score: string;
}

export const createMatch = async ({ player1_id, player2_id }: CreateMatchPayload) =>
	CasualMatch.create({ player1_id, player2_id });

export const submitResult = async (id: number, { winner_id, score }: SubmitResultPayload) => {
	const match = await CasualMatch.findByPk(id);
	if (!match)
        throw new Error(`Casual match with ID ${id} not found.`);
  	match.state = CasualMatchState.COMPLETED;
  	match.winner_id = winner_id;
  	match.score = score;
  	await match.save();
  	return match;
};
