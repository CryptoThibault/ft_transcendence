//backend/auth-service/src/routes/auth.routes.ts
import { FastifyInstance } from 'fastify';
import { signUp, signIn/*, signOut*/ } from '../controllers/auth.controllers.js';
import { generate2FA, verify2FA } from '../controllers/2fa.controllers.js';
import { authorizeSkip2FA } from '../middlewares/auth.middleware.js';
import { googleAuth } from '../controllers/google-auth.controller.js';
import { buildRateLimit, rateLimitConfig } from '../utils/rateLimitOptions.js';

async function authRoutes(fastify: FastifyInstance) {
    // POST /sign-up
    fastify.post('/sign-up', buildRateLimit(rateLimitConfig.signUp), signUp);
    // POST /sign-in
    fastify.post('/sign-in', buildRateLimit(rateLimitConfig.signIn), signIn);
    // POST /google-auth
    fastify.post('/google-auth', buildRateLimit(rateLimitConfig.googleAuth), googleAuth);
    // POST 2fa
    fastify.post('/2fa/setup', { preHandler: authorizeSkip2FA }, generate2FA);
    // POST 2fa verify
    fastify.post('/2fa/verify',
        { preHandler: [authorizeSkip2FA], 
          config: buildRateLimit(rateLimitConfig.verify2FA).config, }, verify2FA
    );
    // POST /sign-out
    //fastify.post('/sign-out', signOut);
}

export default authRoutes;