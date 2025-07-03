//backend/user-service/src/controllers/session.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../models/user.models.js';
import { Friendship } from '../models/friendship.models.js';
import { Match } from '../models/match.models.js';
import { getDb } from '../plugins/sqlite.js';
import fs from 'fs';
import path from 'path';

interface UpdateUserRequestBody {
  name: string;
}

export const currentUser = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        console.log('User from token:', req.user);
        if (!req.user || !req.user.id) {
            return res.status(401).send({ success: false, message: 'Unauthorized: No user ID on request' });
        }
        const userId = req.user.id;
        console.log('Extracted userId from req.user:', userId);
        //const user = await User.findById(userId);
        const user = await User.findByIdWithEmail(userId);
        console.log('User object:', user);
        if (!user)
            return res.status(404).send({ success: false, message: 'User not found in DB' });
        return res.status(200).send({
            success: true,
            message: 'User found successfully',
            data: { user },
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal error',
        });
    }
};

export const updateCurrentUserName = async (req: FastifyRequest<{ Body: UpdateUserRequestBody }>,
  res: FastifyReply) => {
    try {
        if (!req.user || !req.user.id)
            return res.status(404).send({ success: false, message: 'User not found' });
        const userId = req.user.id;
        console.log('Extracted userId from req.user:', userId);
        const { name } = req.body;
        const updated = await User.update(userId, { name });
        if (!updated)
            return res.status(404).send({ success: false, message: 'User not found or name not changed in DB' });
        const user = await User.findById(userId);
        if (!user)
            return res.status(500).send({ success: false, message: 'Failed to retrieve updated user' });
        return res.status(200).send({
            success: true,
            message: 'Name updated successfully',
            data: { user },
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};

export const onlineStatus = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized: User ID not available from token.',
            });
        }
        const userId = req.user.id;
        const updated = await User.update(userId, { onlineStatus: true });
        if (!updated) {
            return res.status(404).send({
                success: false,
                message: 'User not found or online status already set.',
            });
        }
        const user = await User.findById(userId);
        if (!user)
            return res.status(500).send({ success: false, message: 'Failed to retrieve updated user data.' });
        return res.status(200).send({
            success: true,
            message: 'User is now online',
            data: { onlineStatus: user.onlineStatus },
        });
    } catch (error) {
        console.error('Error setting online status:', error);
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};

export const uploadAvatar = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        if (!req.user || !req.user.id)
            return res.status(401).send({ success: false, message: 'Unauthorized: User ID not available from token.' });
        const userId = req.user.id;
        const data = await req.file();
        if (!data)
            return res.status(400).send({ success: false, message: 'No file uploaded' });
        if (data.file.truncated)
            return res.status(400).send({ success: false, message: 'File is too large. Maximum size is 5MB.' });
        const fileName = `${Date.now()}-${data.filename}`;
        const uploadDir = path.resolve('./uploads');
        const filePath = path.join(uploadDir, fileName);
        if (!fs.existsSync(uploadDir))
            fs.mkdirSync(uploadDir, { recursive: true });
        const writeStream = fs.createWriteStream(filePath);
        await new Promise<void>((resolve, reject) => { 
            data.file.pipe(writeStream);
            data.file.on('end', resolve);
            data.file.on('error', (err: Error) => {
                console.error('File stream error:', err);
                writeStream.destroy(err);
                reject(err);
            });
            writeStream.on('error', (err: Error) => {
                console.error('Write stream error:', err);
                reject(err);
            });
        });
        const updated = await User.update(userId, { avatar: fileName });

        if (!updated)
            return res.status(404).send({ success: false, message: 'User not found or avatar not changed.' });
        return res.status(200).send({
            success: true,
            message: 'Avatar uploaded successfully',
            data: { avatar: fileName },
        });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};

export const addFriend = async (req: FastifyRequest, res: FastifyReply) => {
    const db = getDb();
    await db.run('BEGIN TRANSACTION;');
    try {
        const inviterId = req.user?.id;
        const { friendId } = req.body as { friendId: number };
        if (!inviterId || !friendId || inviterId === friendId) {
            await db.run('ROLLBACK;');
            return res.status(400).send({ success: false, message: 'Invalid inviter or friend ID.' });
        }
        const inviter = await User.findById(inviterId);
        const invitee = await User.findById(friendId);
        if (!inviter || !invitee) {
            await db.run('ROLLBACK;');
            return res.status(404).send({ success: false, message: 'User(s) not found.' });
        }
        const existingFriendship = await Friendship.findByUserAndFriend(inviterId, friendId);
        if (existingFriendship) {
            await db.run('ROLLBACK;');
            return res.status(400).send({ success: false, message: 'Friendship already exists or is pending.' });
        }
        await Friendship.create({ userId: inviterId, friendId: friendId, status: 'pending' });
        //await Friendship.create({ userId: friendId, friendId: inviterId, status: 'pending' });
        await db.run('COMMIT;');
        return res.status(200).send({
            success: true,
            message: 'Friend request sent successfully (or friendship established).',
            data: { inviterId, friendId },
        });
    } catch (error) {
        await db.run('ROLLBACK;');
        console.error('Error adding friend:', error);
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};

// Adding this
export const acceptFriendRequest = async (req: FastifyRequest, res: FastifyReply) => {
    const db = getDb();
    await db.run('BEGIN TRANSACTION;');
    try {
        const userId = req.user?.id;
        const { requesterId } = req.body as { requesterId: number };
        if (!userId || !requesterId) {
            await db.run('ROLLBACK;');
            return res.status(400).send({ success: false, message: 'Invalid user or requester ID.' });
        }
        const request = await Friendship.findByUserAndFriend(requesterId, userId);
        if (!request || request.status !== 'pending') {
            await db.run('ROLLBACK;');
            return res.status(404).send({ success: false, message: 'Friend request not found or already handled.' });
        }
        await Friendship.updateStatus(request.id!, 'accepted');
        await db.run('COMMIT;');
        return res.status(200).send({ success: true, message: 'Friend request accepted.' });
    } catch (error) {
        await db.run('ROLLBACK;');
        console.error('Error accepting friend request:', error);
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};

export const getFriendsList = async (req: FastifyRequest, res: FastifyReply) => {
	try {
		const userId = req.user?.id;
		if (!userId) {
			return res.status(401).send({ success: false, message: 'Unauthorized: missing user ID' });
		}

		const friendships = await Friendship.findFriendsForUser(userId);

		const acceptedIds = new Set<number>();
		const pendingSentIds: number[] = [];
		const pendingReceivedIds: number[] = [];

		for (const f of friendships) {
			if (f.status === 'accepted') {
				const otherId = f.userId === userId ? f.friendId : f.userId;
				acceptedIds.add(otherId);
			} else if (f.status === 'pending') {
				if (f.userId === userId) {
					// I sent the request
					pendingSentIds.push(f.friendId);
				} else if (f.friendId === userId) {
					// I received the request
					pendingReceivedIds.push(f.userId);
				}
			}
		}

		const [acceptedFriends, pendingSent, pendingReceived] = await Promise.all([
			Promise.all([...acceptedIds].map(User.findById)),
			Promise.all(pendingSentIds.map(User.findById)),
			Promise.all(pendingReceivedIds.map(User.findById)),
		]);

		return res.status(200).send({
			success: true,
			message: 'Friend list retrieved successfully.',
			data: {
				accepted: acceptedFriends.filter(Boolean),
				pendingSent: pendingSent.filter(Boolean),
				pendingReceived: pendingReceived.filter(Boolean),
			},
		});
	} catch (error) {
		console.error('Error in getFriendsList:', error);
		return res.status(500).send({
			success: false,
			message: (error as Error).message || 'Internal server error.',
		});
	}
};


/*export const getFriendsList = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).send({ success: false, message: 'Unauthorized: User ID not available from token.' });
        const mainUser = await User.findById(userId);
        if (!mainUser)
            return res.status(404).send({ success: false, message: 'User not found.' });
        console.log('User ID:', userId);
        const friendships = await Friendship.findFriendsForUser(userId);
        console.log('Friendships found:', friendships);
        const friendIds: number[] = [];
        friendships.forEach(f => {
            if (f.status === 'accepted') {
                if (f.userId === userId) {
                    friendIds.push(f.friendId);
                } else {
                    friendIds.push(f.userId);
                }
            }
        });
        console.log('Accepted friend IDs:', friendIds);
        const friendsDetails = await Promise.all(
            friendIds.map(id => User.findById(id))
        );
        console.log('Friend details:', friendsDetails);
        const actualFriends = friendsDetails.filter(Boolean);
        return res.status(200).send({
            success: true,
            message: 'Friends list retrieved successfully',
            data: actualFriends,
        });
    } catch (error) {
        console.error('Error getting friends list:', error);
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};*/

export const recordMatch = async (req: FastifyRequest, res: FastifyReply) => {
    console.log('User service: Incoming request body for recordMatch:', req.body);
    const db = getDb();
    await db.run('BEGIN TRANSACTION;');
    try {
        if (!req.user?.id) {
            await db.run('ROLLBACK;');
            return res.status(401).send({ success: false, message: 'Unauthorized: User ID not available from token.' });
        }
        const player1Id = req.user.id;
        const { player2Id, winnerId, score } = req.body as {
            player2Id: number;
            winnerId: number;
            score: string;
        };
        if (!player2Id || !winnerId || !score) {
            await db.run('ROLLBACK;');
            return res.status(400).send({
                success: false,
                message: 'Missing match data: player2Id, winnerId, and score are required.',
            });
        }
        const scoreParts = score.split('-');
        if (scoreParts.length !== 2) {
            await db.run('ROLLBACK;');
            return res.status(400).send({
                success: false,
                message: 'Invalid score format. Use "number-number", e.g., "10-8"',
            });
        }
        const [player1Score, player2Score] = scoreParts.map(Number);
        if (isNaN(player1Score) || isNaN(player2Score)) {
            await db.run('ROLLBACK;');
            return res.status(400).send({
                success: false,
                message: 'Score must contain valid numbers.',
            });
        }
        if (![player1Id, player2Id].includes(winnerId)) {
            await db.run('ROLLBACK;');
            return res.status(400).send({
                success: false,
                message: 'Winner ID must match one of the players.',
            });
        }
        const player1 = await User._findByIdRaw(player1Id);
        const player2 = await User._findByIdRaw(player2Id);
        if (!player1 || !player2) {
            await db.run('ROLLBACK;');
            return res.status(404).send({
                success: false,
                message: 'One or both players not found.',
            });
        }
        // --- Create Match Record ---
        const match = await Match.create({
            player1Id,
            player2Id,
            winnerId,
            player1Score,
            player2Score,
            playedAt: new Date().toISOString(),
        });
        if (!match.id) {
             await db.run('ROLLBACK;');
             return res.status(500).send({
                 success: false,
                 message: 'Failed to record match due to database issue.',
             });
        }
        // --- Update Player Stats ---
        let updatedPlayer1Wins = player1.wins ?? 0;
        let updatedPlayer1Losses = player1.losses ?? 0;
        let updatedPlayer2Wins = player2.wins ?? 0;
        let updatedPlayer2Losses = player2.losses ?? 0;
        if (winnerId === player1Id) {
            updatedPlayer1Wins += 1;
            updatedPlayer2Losses += 1;
        } else { 
            updatedPlayer2Wins += 1;
            updatedPlayer1Losses += 1;
        }
        // Use your custom User.update method for each player
        const player1Updated = await User.update(player1Id, {
            wins: updatedPlayer1Wins,
            losses: updatedPlayer1Losses,
        });
        const player2Updated = await User.update(player2Id, {
            wins: updatedPlayer2Wins,
            losses: updatedPlayer2Losses,
        });
        if (!player1Updated || !player2Updated) {
            await db.run('ROLLBACK;');
            return res.status(500).send({
                success: false,
                message: 'Failed to update player stats.',
            });
        }
        await db.run('COMMIT;');
        return res.status(201).send({
            success: true,
            message: 'Match recorded successfully',
            data: match,
        });
    } catch (error) {
        await db.run('ROLLBACK;');
        console.error('Error recording match:', error);
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};

export const getCurrentUserMatches = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        if (!req.user?.id)
            return res.status(401).send({ success: false, message: 'Unauthorized: User ID not available from token.' });
        const userId = req.user.id;
        const matches = await Match.findMatchesByPlayer(userId);
        console.log("Retrieved Matches:", matches);
        return res.status(200).send({
            success: true,
            message: 'Match history fetched successfully',
            data: matches,
        });
    } catch (error) {
        console.error('Error fetching current user matches:', error);
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};

export const getUserMatchHistory = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const { id } = req.params as { id: string };
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            return res.status(400).send({
                success: false,
                message: 'Invalid user ID format.',
            });
        }
        const matches = await Match.findMatchesByPlayer(userId);
        return res.status(200).send({
            success: true,
            message: 'Match history fetched successfully',
            data: matches,
        });
    } catch (error) {
        console.error('Error fetching user match history:', error);
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};

export const getLeaderboard = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const users = await User.getLeaderboard();
        return res.status(200).send({
            success: true,
            message: 'Leaderboard fetched successfully',
            data: users,
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};

export const deleteCurrentUser = async (req: FastifyRequest, res: FastifyReply) => {
    const db = getDb();
    await db.run('BEGIN TRANSACTION;');
    try {
        if (!req.user || !req.user.id) {
            await db.run('ROLLBACK;');
            return res.status(401).send({ success: false, message: 'Unauthorized: User ID not available.' });
        }
        const userId = req.user.id;
        const userExists = await User._findByIdRaw(userId);
        if (!userExists) {
            await db.run('ROLLBACK;');
            return res.status(404).send({ success: false, message: 'User not found.' });
        }
        await Friendship.deleteFriendshipsByUser(userId);
        await Match.deleteMatchesByPlayer(userId);
        const userDeleted = await User.delete(userId);
        if (!userDeleted) {
            await db.run('ROLLBACK;');
            return res.status(500).send({ success: false, message: 'Failed to delete user account.' });
        }
        await db.run('COMMIT;');
        return res.status(200).send({
            success: true,
            message: 'User account deleted successfully',
        });
    } catch (error) {
        await db.run('ROLLBACK;');
        console.error('Error deleting current user:', error);
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};

export const deleteAvatar = async (req: FastifyRequest, res: FastifyReply) => {
    const db = getDb();
    await db.run('BEGIN TRANSACTION;');

    try {
        if (!req.user || !req.user.id) {
            await db.run('ROLLBACK;');
            return res.status(401).send({ success: false, message: 'Unauthorized' });
        }

        const userId = req.user.id;
        const user = await User._findByIdRaw(userId);

        if (!user || !user.avatar) {
            await db.run('ROLLBACK;');
            return res.status(404).send({ success: false, message: 'Avatar not found.' });
        }

        const avatarPath = path.resolve('./uploads', user.avatar);
        if (fs.existsSync(avatarPath)) {
            fs.unlinkSync(avatarPath);
        }

        //const updated = await User.update(userId, { avatar: undefined });
        const updated = await User.update(userId, { avatar: null });
        console.log('User.update() result:', updated);

        if (!updated) {
            await db.run('ROLLBACK;');
            return res.status(500).send({ success: false, message: 'Failed to remove avatar.' });
        }

        await db.run('COMMIT;');
        return res.status(200).send({ success: true, message: 'Avatar removed successfully.' });

    } catch (error) {
        await db.run('ROLLBACK;');
        console.error('Error removing avatar:', error);
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};


/*export const deleteAvatar = async (req: FastifyRequest, res: FastifyReply) => {
    const db = getDb();
    await db.run('BEGIN TRANSACTION;');
    try {
        if (!req.user || !req.user.id) {
            await db.run('ROLLBACK;');
            return res.status(401).send({ success: false, message: 'Unauthorized: User ID not available.' });
        }
        const userId = req.user.id;
        const user = await User._findByIdRaw(userId);
        if (!user) {
            await db.run('ROLLBACK;');
            return res.status(404).send({ success: false, message: 'User not found.' });
        }
        if (user.avatar) {
            const avatarPath = path.resolve('./uploads', user.avatar);
            if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
            }
        }
        const updated = await User.update(userId, { avatar: undefined });
        if (!updated) {
            await db.run('ROLLBACK;');
            return res.status(500).send({ success: false, message: 'Failed to remove avatar.' });
        }
        await db.run('COMMIT;');
        return res.status(200).send({
            success: true,
            message: 'Avatar deleted successfully',
        });
    } catch (error) {
        await db.run('ROLLBACK;');
        console.error('Error deleting avatar:', error);
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};*/

