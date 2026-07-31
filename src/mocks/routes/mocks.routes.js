import express from 'express';

import MockController from '../controllers/mocks.controllers.js';

const router = express.Router();

router.get('/users', MockController.getMockUsers);

router.get('/products', MockController.getMockProducts);

router.get('/couriers', MockController.getMockCouriers);

router.get('/orders', MockController.getMockOrders);

router.get('/deliveries', MockController.getMockDeliveries);

router.get('/scenario', MockController.getMockScenario);

router.post('/seed', MockController.seed);

router.post('/mock-users', MockController.generateUsers);

router.post('/mock-products', MockController.generateProducts);

router.post('/mock-orders', MockController.generateOrders);

router.post('/mock-couriers', MockController.generateCouriers);

router.post('/mock-deliveries', MockController.generateDeliveries);

export default router;