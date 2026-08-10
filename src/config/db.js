import mongoose from 'mongoose';

import logger from './logger.js';

import { config } from './config.js';


export async function connectDB() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    logger.info('Conexión a MongoDB establecida');
  } catch (error) {
    logger.fatal(`Error al conectar a MongoDB: ${error.message}`);
    process.exit(1);
  }

}