import express from 'express';

import MockController from '../controllers/mocks.controllers.js';

const router = express.Router();

router.post('/mock-users', MockController.generateUsers);

router.post('/mock-products', MockController.generateProducts);

router.post('/mock-orders', MockController.generateOrders);

export default router;