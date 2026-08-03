import express from 'express';

import { config } from './config/config.js';
import { connectDB } from './config/db.js';

import usersRoutes from './routes/users.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import courierRoutes from './routes/courier.routes.js';
import deliveryRoutes from './routes/delivery.routes.js';
import mocksRoutes from './mocks/routes/mocks.routes.js';
import { ERROR_CODES } from './error/error-codes.js';
import CustomError from './error/custom.error.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';


const app = express();

app.use(express.json());
app.use('/api/users', usersRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/couriers', courierRoutes);
app.use('/api/deliveries', deliveryRoutes);

if(process.env.NODE_ENV !== 'production') {
  app.use('/api/mocks', mocksRoutes);
} else {
  app.use('/api/mocks', (req, res, next) => {
    next(new CustomError(ERROR_CODES.MOCKS_NOT_ALLOWED));
  });
}


app.get('/health', (req, res) => {
  res.send(`ShipNow API V1 - Se esta ejecutando en ${process.env.NODE_ENV} mode`);
});

app.use((req, res, next) => {
  next(new CustomError(ERROR_CODES.ROUTE_NOT_FOUND));
});

app.use(errorHandler);

connectDB();

app.listen(config.PORT, () => {
  console.log(`Servidor esta corriendo en puerto ${config.PORT}`);
});