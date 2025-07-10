import { config } from 'dotenv';

config({ path: `.env.local.livechat` });

export const {
    JWT_SECRET
} = process.env;