//backend/auth-service/src/config/env.ts
import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {
    PORT,
    NODE_ENV,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    RATE_LIMIT_SIGN_IN_MAX,
    RATE_LIMIT_SIGN_IN_WINDOW,
    RATE_LIMIT_SIGN_UP_MAX,
    RATE_LIMIT_SIGN_UP_WINDOW,
    RATE_LIMIT_GOOGLE_AUTH_MAX,
    RATE_LIMIT_GOOGLE_AUTH_WINDOW,
    RATE_LIMIT_2FA_VERIFY_MAX,
    RATE_LIMIT_2FA_VERIFY_WINDOW
} = process.env;