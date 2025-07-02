// backend/auth-service/src/controllers/2fa.controllers.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import jwt from 'jsonwebtoken';

import { findUserByIdWithSensitiveData, updateUserTwoFactor } from '../services/user.service.js';
import { JWT_SECRET } from '../config/env.js';
import { AuthUser, SafeAuthUser } from '../models/auth.models.js';

interface AuthenticatedRequest extends FastifyRequest {
	user?: SafeAuthUser;
}

const getJwtSecret = (): string => {
	if (!JWT_SECRET) {
		throw new Error('JWT_SECRET is not defined in environment variables');
	}
	return JWT_SECRET;
};

// POST /2fa/generate
export const generate2FA = async (req: AuthenticatedRequest, res: FastifyReply) => {
	const userId = req.user?.id;
	if (!userId) return res.status(401).send({ message: 'User not authenticated' });
	const user = await findUserByIdWithSensitiveData(userId);
	if (!user) return res.status(404).send({ message: 'User not found' });
	const secret = speakeasy.generateSecret();
	const updated = await updateUserTwoFactor(user.id, secret.base32, user.twoFactorEnabled);
	if (!updated) return res.status(500).send({ message: 'Failed to save 2FA secret' });
	const qrCode = await qrcode.toDataURL(secret.otpauth_url ?? '');
	return res.send({
		success: true,
		message: '2FA setup initiated. Scan QR or use manual code to continue.',
		twoFactorEnabled: false,
		qrCode,
		manualEntry: secret.base32
	});
};

// POST /2fa/verify
export const verify2FA = async (req: FastifyRequest, res: FastifyReply) => {
	const { token } = req.body as { token?: string };
	const authHeader = req.headers.authorization;
	const jwtToken = authHeader?.split(' ')[1];
	const secret = getJwtSecret();

	if (!jwtToken) return res.status(401).send({ message: 'Token required' });
	// Validate format early
	if (!token || !/^\d{6}$/.test(token))
		return res.status(400).send({ message: 'Invalid 2FA code format' });
	let payload: any;
	try {
		payload = jwt.verify(jwtToken, secret) as { userId: number; twoFactor?: boolean };
	} catch (err) {
		return res.status(401).send({ message: 'Invalid or expired token' });
	}
	if (payload.twoFactor !== true || !payload.userId)
		return res.status(403).send({ message: 'Invalid 2FA verification token' });
	const user = await findUserByIdWithSensitiveData(payload.userId);
	if (!user || !user.twoFactorSecret)
		return res.status(404).send({ message: 'User not found or 2FA not setup' });
	const verified = speakeasy.totp.verify({
		secret: user.twoFactorSecret,
		encoding: 'base32',
		token,
		window: 1
	});
	if (!verified)
		return res.status(401).send({ message: 'Invalid 2FA token' });
	// Enable 2FA if not already active
	if (!user.twoFactorEnabled) {
		const success = await updateUserTwoFactor(user.id, user.twoFactorSecret, true);
		if (!success) {
			console.error(`Failed to enable 2FA for user ID ${user.id}`);
			return res.status(500).send({ message: 'Failed to enable 2FA' });
		}
	}
	const finalToken = jwt.sign(
		//bince changed
		{ userId: user.id, userName: user.name},
		secret,
		{ expiresIn: '1h' }
	);
	const userResponse: SafeAuthUser = {
		id: user.id,
		name: user.name,
		email: user.email,
		twoFactorEnabled: true,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt
	};
	return res.send({
		success: true,
		message: '2FA verification successful',
		data: {
			token: finalToken,
			user: userResponse
		}
	});
};
