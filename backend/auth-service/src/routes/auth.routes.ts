//backend/auth-service/src/routes/auth.routes.ts
import { FastifyInstance } from 'fastify';
import { signUp, signIn/*, signOut*/ } from '../controllers/auth.controllers';
import { generate2FA, verify2FA } from '../controllers/2fa.controllers'; // Adding this
import { authorizeSkip2FA } from '../middlewares/auth.middleware'; // adding this
import { googleAuth } from '../controllers/google-auth.controller';

async function authRoutes(fastify: FastifyInstance) {
    // POST /sign-up
    fastify.post('/sign-up', signUp);
    // POST /sign-in
    fastify.post('/sign-in', signIn);
    /*--adding google---*/
    fastify.post('/google-auth', googleAuth);
    /*-----------------/
    /*------ adding this -------- */
    fastify.post('/2fa/setup', { preHandler: authorizeSkip2FA }, generate2FA);
    fastify.post('/2fa/verify', { preHandler: authorizeSkip2FA }, verify2FA);
    /*----------------------------*/
    // POST /sign-out
    //fastify.post('/sign-out', signOut);
}

export default authRoutes;