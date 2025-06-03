//backend/user-service/src/controllers/session.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../utils/verify.token';
import { MultipartFile } from '@fastify/multipart';
import { User } from '../models/user.models';
import { sequelize } from '../plugins/sequelize';
import { Friendship } from '../models/friendship.models';
import { Match } from '../models/match.models';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';

export const currentUser = async (req: FastifyRequest, res: FastifyReply) => {
    const transaction = await sequelize.transaction();
    try {
        console.log('User from token:', req.user);
        if (!req.user) {
            await transaction.rollback();
            return res.status(401).send({ success: false, message: 'Unauthorized: No user on request' });
        }
        const userId = req.user.id;
        console.log('Extracted userId from req.user:', userId);
        const user = await User.findByPk(userId, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).send({ success: false, message: 'User not found in DB' });
        }
        await transaction.commit();
        return res.status(200).send({
            success: true,
            message: 'User found successfully',
            data: { user },
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal error',
        });
    }
};

export const updateCurrentUserName = async (req: FastifyRequest, res: FastifyReply) => {
    const transaction = await sequelize.transaction();
    try {
        if (!req.user) {
            await transaction.rollback();
            return res.status(404).send({ success: false, message: 'User not found' });
        }
        const userId = req.user.id;
        console.log('Extracted userId from req.user:', userId);
        const user = await User.findByPk(userId, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).send({ success: false, message: 'User not found in DB' });
        }
        await transaction.commit();
        return res.status(200).send({
            success: true,
            message: 'Name updated successfully',
            data: { user },
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};

export const onlineStatus = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }
        user.onlineStatus = true;
        await user.save();
        return res.status(200).send({
            success: true,
            message: 'User is now online',
            data: { onlineStatus: user.onlineStatus },
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal error',
        });
    }
};

export const uploadAvatar = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const data = await req.file();
        if (!data) {
            return res.status(400).send({
                success: false,
                message: 'No file uploaded',
            });
        }
        if (data.file.truncated) {
            return res.status(400).send({
                success: false,
                message: 'File is too large. Maximum size is 5MB.',
            });
        }
        const fileName = `${Date.now()}-${data.filename}`;
        const uploadDir = path.resolve('./uploads');
        const filePath = path.join(uploadDir, fileName);
        if (!fs.existsSync(uploadDir))
            fs.mkdirSync(uploadDir, { recursive: true });
        const writeStream = fs.createWriteStream(filePath);
        await new Promise((resolve, reject) => {
            data.file.pipe(writeStream);
            data.file.on('end', resolve);
            data.file.on('error', reject);
        });
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        if (!user)
            return res.status(404).send({ success: false, message: 'User not found' });
        user.avatar = fileName;
        await user.save();
        return res.status(200).send({
            success: true,
            message: 'Avatar uploaded successfully',
            data: { avatar: fileName },
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
}

export const addFriend = async (req: FastifyRequest, res: FastifyReply) => {
    const transaction = await sequelize.transaction();
    try {
        //console.log("Incoming body:", req.body);
        const inviterId = req.user.id;
        const { friendId } = req.body as { friendId: number };
        //console.log(`Inviter ID: ${inviterId}, Friend ID: ${friendId}`);
        //console.log("Friendship Query Params:", { userId: inviterId, friendId });
        if (!friendId || inviterId === friendId) {
            //console.error("Invalid IDs: inviterId =", inviterId, ", friendId =", friendId);
            return res.status(400).send({ success: false, message: 'Invalid friendId' });
        }
        const inviter = await User.findByPk(inviterId, { transaction });
        const invitee = await User.findByPk(friendId, { transaction });
        //console.log("Inviter:", inviter);
        //console.log("Invitee:", invitee);
        //console.log(`Debug - Inviter ID: ${inviterId}, Friend ID: ${friendId}`);
        if (!inviter || !invitee) {
            await transaction.rollback();
            return res.status(404).send({ success: false, message: 'User(s) not found' });
        }
        const alreadyFriends = await Friendship.findOne({
            where: { userId: inviterId, friendId },
            transaction,
        });
        //console.log("Friendship Query Result:", alreadyFriends);
        if (alreadyFriends) {
            await transaction.rollback();
            return res.status(400).send({ success: false, message: 'Users are already friends' });
        }
        await Friendship.bulkCreate([
            { userId: inviterId, friendId },
            { userId: friendId, friendId: inviterId },
        ], { transaction });
        await transaction.commit();
        return res.status(200).send({
            success: true,
            message: 'Friend added successfully',
            data: { inviterId, friendId },
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};

export const getFriendsList = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId, {
            include: [{ model: User, as: 'friends' }],
        });
        if (!user)
            return res.status(404).send({ success: false, message: 'User not found' });
        return res.status(200).send({
            success: true,
            message: 'Friends list retrieved successfully',
            data: user.friends,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};

export const recordMatch = async (req: FastifyRequest, res: FastifyReply) => {
    const transaction = await sequelize.transaction();
    try {
        const player1Id = req.user.id;
        const { player2Id, winnerId, score } = req.body as {
            player2Id: number;
            winnerId: number;
            score: string;
        };
        if (!player2Id || !winnerId || !score) {
            await transaction.rollback();
            return res.status(400).send({
                success: false,
                message: 'Missing match data',
            });
        }
        const scoreParts = score.split('-');
        if (scoreParts.length !== 2) {
            await transaction.rollback();
            return res.status(400).send({
                success: false,
                message: 'Invalid score format. Use "number-number", e.g., "10-8"',
            });
        }
        const [player1Score, player2Score] = scoreParts.map(Number);
        if (isNaN(player1Score) || isNaN(player2Score)) {
            await transaction.rollback();
            return res.status(400).send({
                success: false,
                message: 'Score must contain valid numbers',
            });
        }
        if (![player1Id, player2Id].includes(winnerId)) {
            await transaction.rollback();
            return res.status(400).send({
                success: false,
                message: 'Winner ID must match one of the players',
            });
        }
        const match = await Match.create({
            player1Id,
            player2Id,
            winnerId,
            score,
            player1Score,
            player2Score,
            playedAt: new Date(),
        }, { transaction });
        const player1 = await User.findByPk(player1Id, { transaction });
        const player2 = await User.findByPk(player2Id, { transaction });
        if (!player1 || !player2) {
            await transaction.rollback();
            return res.status(404).send({
                success: false,
                message: 'One or both players not found',
            });
        }
        if (winnerId === player1Id) {
            player1.wins += 1;
            player2.losses += 1;
        } else {
            player2.wins += 1;
            player1.losses += 1;
        }
        await player1.save({ transaction });
        await player2.save({ transaction });
        await transaction.commit();
        return res.status(201).send({
            success: true,
            message: 'Match recorded successfully',
            data: match,
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Error recording match:', error);
        return res.status(500).send({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const getCurrentUserMatches = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const userId = req.user.id;
        const matches = await Match.findAll({
            where: {
                [Op.or]: [
                    { player1Id: userId },
                    { player2Id: userId },
                ],
            },
        });
        //console.log("Retrieved Matches:", matches);
        return res.status(200).send({
            success: true,
            message: 'Match history fetched successfully',
            data: matches,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};

export const getUserMatchHistory = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const { id } = req.params as { id: string };
        const matches = await Match.findAll({
            where: {
                [Op.or]: [
                    { player1Id: id },
                    { player2Id: id },
                ],
            },
        });
        return res.status(200).send({
            success: true,
            message: 'Match history fetched successfully',
            data: matches,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};

export const getLeaderboard = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'avatar', 'wins', 'losses'],
            order: [
                ['wins', 'DESC'],
                ['losses', 'ASC'],
            ],
        });
        return res.status(200).send({
            success: true,
            message: 'Leaderboard fetched successfully',
            data: users,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};


export const deleteCurrentUser = async (req: FastifyRequest, res: FastifyReply) => {
    const transaction = await sequelize.transaction();
    try {
        if (!req.user) {
            await transaction.rollback();
            return res.status(401).send({ success: false, message: 'Unauthorized' });
        }
        const userId = req.user.id;
        const user = await User.findByPk(userId, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).send({ success: false, message: 'User not found' });
        }
        // clean up related data like friendships, matches, etc.
        await Friendship.destroy({ where: { userId }, transaction });
        await Friendship.destroy({ where: { friendId: userId }, transaction });
        await Match.destroy({
            where: {
                [Op.or]: [{ player1Id: userId }, { player2Id: userId }],
            },
            transaction
        });
        await user.destroy({ transaction });
        await transaction.commit();
        return res.status(200).send({
            success: true,
            message: 'User account deleted successfully',
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).send({
            success: false,
            message: (error as Error).message || 'Internal server error',
        });
    }
};


