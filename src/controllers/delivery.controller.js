import deliveryService from '../services/delivery.service.js';

class DeliveryController {
    static async getAllDeliveries(req, res, next) {
        try {
            const deliveries = await deliveryService.getAllDeliveries();
            res.status(200).json(deliveries);
        } catch (error) {
            next(error);
        }
    }

    static async getDeliveryById(req, res, next) {
        try {
            const deliveryId = req.params.id;
            const delivery = await deliveryService.getDeliveryById(deliveryId);
            res.status(200).json(delivery);
        } catch (error) {
            next(error);
        }
    }

    static async updateDeliveryStatus(req, res, next) {
        try {
            const deliveryId = req.params.id;
            const { status } = req.body;
            const updatedDelivery = await deliveryService.updateDeliveryStatus(deliveryId, status);
            res.status(200).json(updatedDelivery);
        } catch (error) {
            next(error);
        }
    }

    static async assignDelivery(req, res, next) {
        try {
        const deliveryData = req.body;
        const delivery = await deliveryService.assignDelivery(deliveryData);
        res.status(201).json(delivery);
        } catch (error) {
        next(error);
        }
    }
}

export default DeliveryController;