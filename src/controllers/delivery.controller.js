import deliveryService from '../services/delivery.service.js';

class DeliveryController {
    static async getAllDeliveries(req, res) {
        try {
            const deliveries = await deliveryService.getAllDeliveries();
            res.status(200).json(deliveries);
        } catch (error) {
            console.warn('Error fetching deliveries:', error);
            res.status(500).json({ message: 'Error obteniendo las entregas' });
        }
    }

    static async getDeliveryById(req, res) {
        try {
            const deliveryId = req.params.id;
            const delivery = await deliveryService.getDeliveryById(deliveryId);
            if (!delivery) {
                return res.status(404).json({ message: 'Entrega no encontrada' });
            }
            res.status(200).json(delivery);
        } catch (error) {
            console.warn('Error fetching delivery by ID:', error);
            res.status(500).json({ message: 'Error obteniendo la entrega por ID' });
        }
    }

    static async updateDeliveryStatus(req, res) {
        try {
            const deliveryId = req.params.id;
            const { status } = req.body;
            const updatedDelivery = await deliveryService.updateDeliveryStatus(deliveryId, status);
            if (!updatedDelivery) {
                return res.status(404).json({ message: 'Entrega no encontrada' });
            }
            res.status(200).json(updatedDelivery);
        } catch (error) {
            console.warn('Error updating delivery status:', error);
            res.status(500).json({ message: 'Error actualizando el estado de la entrega' });
        }
    }

    static async assignDelivery(req, res) {
        try {
        const deliveryData = req.body;
        const delivery = await deliveryService.assignDelivery(deliveryData);
        res.status(201).json(delivery);
        } catch (error) {
        console.warn('Error assigning delivery:', error);
        res.status(400).json({ message: error.message });
        }
    }
}

export default DeliveryController;