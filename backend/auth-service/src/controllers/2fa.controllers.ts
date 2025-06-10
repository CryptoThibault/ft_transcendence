// backend/auth-service/src/controllers/2fa.controllers.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import { AuthUser } from '../models/auth.models';

export const generate2FA = async (req: FastifyRequest, res: FastifyReply) => {
    const user = req.user;
    const secret = speakeasy.generateSecret();    
    // Store the secret, but DO NOT enable 2FA until verification
    user.twoFactorSecret = secret.base32;
    await user.save();
    const qrCode = await qrcode.toDataURL(secret.otpauth_url ?? '');
    return res.send({
        success: true,
        qrCode,
        manualEntry: secret.base32
    });
};

export const verify2FA = async (req: FastifyRequest, res: FastifyReply) => {
    const { token } = req.body as { token: string };
    const authHeader = req.headers.authorization;
    const jwtToken = authHeader?.split(' ')[1];

    if (!jwtToken) return res.status(401).send({ message: 'Token required' });    
    let payload: any;
    try {
        payload = jwt.verify(jwtToken, JWT_SECRET!) as any;
    } catch (err) {
        return res.status(401).send({ message: 'Invalid or expired token' });
    }
    // This token should be the temporary one from signIn, which has twoFactor: true
    if (!payload.twoFactor) return res.status(401).send({ message: 'Access denied: 2FA required for this action or invalid token type.' });
    const user = await AuthUser.findByPk(payload.userId);
    if (!user || !user.twoFactorSecret) return res.status(404).send({ message: 'User not found or 2FA not setup' });
    const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token,
        window: 1 // Allows for 1 time step deviation (e.g., 30s)
    });
    if (!verified)
        return res.status(401).send({ message: 'Invalid 2FA token' });
    // If verification is successful, NOW enable 2FA for the user if it was a setup attempt
    if (!user.twoFactorEnabled) { // Only set to true if it wasn't already
        user.twoFactorEnabled = true;
        await user.save();
    }    
    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET!, { expiresIn: '1h' });
    // Prepare user object for response, EXCLUDING SENSITIVE DATA
    const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
    return res.send({
        success: true,
        message: '2FA verification successful',
        data: {
            token: accessToken,
            user: userResponse
        }
    });
};


/*export const generate2FA = async (req: FastifyRequest, res: FastifyReply) => {
	const user = req.user;
	const secret = speakeasy.generateSecret();
	user.twoFactorSecret = secret.base32;
	user.twoFactorEnabled = true;
	await user.save();
	const qrCode = await qrcode.toDataURL(secret.otpauth_url ?? '');
	return res.send({
		success: true,
		qrCode,
		manualEntry: secret.base32
	});
};

export const verify2FA = async (req: FastifyRequest, res: FastifyReply) => {
	const { token } = req.body as { token: string };
	const authHeader = req.headers.authorization;
	const jwtToken = authHeader?.split(' ')[1];

	if (!jwtToken) return res.status(401).send({ message: 'Token required' });
	const payload = jwt.verify(jwtToken, JWT_SECRET!) as any;
	if (!payload.twoFactor) return res.status(401).send({ message: 'Invalid token' });
	const user = await AuthUser.findByPk(payload.userId);
  	if (!user || !user.twoFactorSecret) return res.status(404).send({ message: 'User not found or 2FA not setup' });

  	const verified = speakeasy.totp.verify({
		secret: user.twoFactorSecret,
		encoding: 'base32',
		token,
		window: 1
	});
	if (!verified) return res.status(401).send({ message: 'Invalid 2FA token' });
	const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET!, { expiresIn: '1h' });
	return res.send({
		success: true,
    	message: '2FA verification successful',
    	data: {
      		token: accessToken,
      		user
    	}
  	});
};*/