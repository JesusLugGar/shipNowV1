import mongoose from 'mongoose';

import {config} from './config.js';

export async function connectDB() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Conexión a MongoDB establecida correctamente');
  } catch (error) {
    console.warn('Error al conectar a la base de datos:', error.message);
    process.exit(1);
  }

}