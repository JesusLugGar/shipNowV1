import express from 'express';

import DeliveryController from '../controllers/delivery.controller.js';

const router = express.Router();

router.get('/', DeliveryController.getAllDeliveries);

router.post('/assign', DeliveryController.assignDelivery);

router.get('/:id', DeliveryController.getDeliveryById);

router.put('/:id/status', DeliveryController.updateDeliveryStatus);

export default router;