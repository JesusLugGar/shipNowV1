import express from 'express';

import CouriersController from '../controllers/courier.controller.js';

const router = express.Router();

router.get('/', CouriersController.getAllCouriers);

router.get('/available', CouriersController.getAvailableCouriers);

router.get('/available/:zone', CouriersController.getAvailableCouriersByZone);

router.post('/', CouriersController.createCourier);

router.get('/:id', CouriersController.getCourierById);

router.put('/:id', CouriersController.updateCourier);

router.patch('/:id/availability', CouriersController.markCourierAsAvailable);

router.patch('/:id/unavailability', CouriersController.markCourierAsUnavailable);

router.delete('/:id', CouriersController.deleteCourier);

export default router;