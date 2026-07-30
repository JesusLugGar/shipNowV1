import express from 'express';

import { config } from './config/config.js';
import { connectDB } from './config/db.js';

import usersRoutes from './routes/users.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import courierRoutes from './routes/courier.routes.js';
import deliveryRoutes from './routes/delivery.routes.js';
import mocksRoutes from './mocks/routes/mocks.routes.js';


const app = express();

app.use(express.json());
app.use('/api/users', usersRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/couriers', courierRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/mocks', mocksRoutes);


app.get('/health', (req, res) => {
  res.send('ShipNow API V1 - Bienvenido a la API de ShipNow');
});

connectDB();

app.listen(config.PORT, () => {
  console.log(`Servidor esta corriendo en puerto ${config.PORT}`);
});