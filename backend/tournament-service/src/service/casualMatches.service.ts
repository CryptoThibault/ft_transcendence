// backend/tournament-service/src/service/casualMatches.service.ts
import { CasualMatch, CasualMatchState, CasualMatchData } from '../models/casualMatch.models.js';

interface CreateMatchPayload {
    player1_id: number;
    player2_id: number;
}

interface SubmitResultPayload {
    winner_id: number;
    score: string;
}

export const createMatch = async ({ player1_id, player2_id }: CreateMatchPayload): Promise<CasualMatchData> =>
    CasualMatch.create({ player1_id, player2_id, state: CasualMatchState.PENDING });

export const submitResult = async (id: number, { winner_id, score }: SubmitResultPayload): Promise<CasualMatchData> => {
    const match = await CasualMatch.findById(id);
    if (!match) {
        throw new Error(`Casual match with ID ${id} not found.`);
    }
    // Prepare the update data
    const updateData: Partial<CasualMatchData> = {
        state: CasualMatchState.COMPLETED,
        winner_id: winner_id,
        score: score,
    };
    // Call the static update method
    const success = await CasualMatch.update(id, updateData);
    if (!success) {
        throw new Error(`Failed to update casual match with ID ${id}.`);
    }
    const updatedMatch = await CasualMatch.findById(id);
    if (!updatedMatch) {
        throw new Error(`Could not retrieve updated casual match with ID ${id}.`);
    }
    return updatedMatch;
};
