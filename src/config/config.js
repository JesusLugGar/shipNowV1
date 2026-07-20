import dotenv from 'dotenv';

dotenv.config();

const REQUIRED_ENV_VARS = ['PORT', 'NODE_ENV', 'MONGO_URI'];

for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
}

export const config = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    MONGO_URI: process.env.MONGO_URI,
    //DB_PASSWORD: process.env.DB_PASSWORD,
    //DB_NAME: process.env.DB_NAME,
    
}