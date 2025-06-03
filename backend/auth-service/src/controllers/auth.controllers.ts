//backend/auth-service/src/controllers/auth.controllets.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthUser } from '../models/auth.models';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { sequelize } from '../plugins/sequelize';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env';
import { userServiceClient } from '../utils/userServiceClient';

export const signUp = async (req: FastifyRequest, res: FastifyReply) => {
	const transaction = await sequelize.transaction();
	try {
		const { name, email, password } = req.body as {
			name: string;
			email: string;
			password: string;
		};
		const existingUser = await AuthUser.findOne({ where: { email }, transaction });
		if (existingUser) {
			const error = new Error('User already exists');
			(error as any).statusCode = 409;
			throw error;
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const newUser = await AuthUser.create(
			{ name, email, password: hashedPassword },
			{ transaction }
		);
		// Sync with user-service
		try {
			await userServiceClient.post('/', {
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
			});
		} catch (syncError) {
			console.error('Failed to sync with user-service:', (syncError as Error).message);
			const error = new Error('Failed to sync with user-service');
			(error as any).statusCode = 502; // Bad Gateway - service communication error
			throw error;
		}
		if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');
		const signOptions: SignOptions = {
			expiresIn: '1h',
		};
		const token = jwt.sign(
			{ userId: newUser.id },
			JWT_SECRET as string,
			signOptions
		);
		await transaction.commit();
		return res.status(201).send({
			success: true,
			message: 'User created successfully',
			data: {
				token,
				user: newUser,
			},
		});
	} catch (error) {
		await transaction.rollback();
		res.status((error as any).statusCode || 500).send({
			message: (error as any).message || 'Internal server error',
		});
	}
};

export const signIn = async (req: FastifyRequest, res: FastifyReply) => {
	try {
		const { email, password } = req.body as {
			email: string;
			password: string;
		};
		const user = await AuthUser.findOne({ where: { email } });
		if (!user) {
			const error = new Error('User not found');
			(error as any).statusCode = 404;
			throw error;
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			const error = new Error('Invalid password');
			(error as any).statusCode = 401;
			throw error;
		}
		if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');
		/* -------- adding this -------- */
		if (user.twoFactorEnabled) {
			const tempToken = jwt.sign(
				{ userId: user.id, twoFactor: true },
    			JWT_SECRET!,
    			{ expiresIn: '5m' }
			);
			return res.send({
				success: true,
    			message: '2FA code required',
    			twoFactor: true,
    			tempToken
  			});
		}
		/* ------------------------------*/
		// "FA not required"
		const signOptions: SignOptions = {
			expiresIn: '1h'/*JWT_EXPIRES_IN*/,
		};
		const token = jwt.sign(
			{ userId: user.id },
			JWT_SECRET as string,
			signOptions
		);
		
		return res.status(200).send({
			success: true,
			message: 'User signed in successfully',
			data: {
				token,
				user,
			}
		});
	} catch (error) {
		return res.status(500).send({
			success: false,
			message: (error as Error).message || 'Internal error',
		});
	}
};