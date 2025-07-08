//backend/user-service/src/types/fastify.d.ts
import { RouteGenericInterface } from 'fastify';
export interface AuthUserSanitizedPayload {
    id: number;
    email: string;
    name?: string;
    twoFactorEnabled?: boolean;
}

declare module 'fastify' {
    interface FastifyRequest {
        user?: AuthUserSanitizedPayload;
    }
}

//bince added this
interface AcceptFriendshipRequestRoute extends RouteGenericInterface {
  Body: {
    senderId: number;
  };
}
