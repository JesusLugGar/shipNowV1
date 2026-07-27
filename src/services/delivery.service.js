import DeliveryRepository from '../repositories/delivery.repository.js';
import OrderRepository from '../repositories/order.repository.js';

import courierService from './courier.service.js';

import { ORDER_STATUS, COURIER_STATUS } from '../utils/constants.js';

class DeliveryService {
    static async getAllDeliveries() {
        return await DeliveryRepository.find();
    }
    static async getDeliveryById(id) {
        return await DeliveryRepository.findById(id);
    }

    static async assignDelivery(deliveryData) {
        const { orderId, courierId } = deliveryData;

        if (!orderId || !courierId) {
            throw new Error('Faltan campos obligatorios: orderId y courierId son requeridos.');
        }

        const order = await OrderRepository.findById(orderId);
        if (!order) {
            throw new Error('Orden no encontrada');
        }
        
        if (order.status !== ORDER_STATUS.CREATED) {
            throw new Error('La orden no está en estado creado y no puede ser asignada a un repartidor.');
        }

        const existingDelivery = await DeliveryRepository.findByOrderId(orderId);
        if (existingDelivery) {
            throw new Error('Ya existe una entrega asignada a esta orden.');
        }
        
        const courier = await courierService.getCourierById(courierId);
        if (!courier) {
            throw new Error('Repartidor no encontrado');
        }
        
        if (courier.availableStatus !== COURIER_STATUS.AVAILABLE) {
            throw new Error('El repartidor no está disponible para asignar la entrega.');
        }

        const delivery = await DeliveryRepository.create({
            orderId,
            courierId,
            status: ORDER_STATUS.ASSIGNED,
        });

        await OrderRepository.findByIdAndUpdate(orderId, {
            status: ORDER_STATUS.ASSIGNED,
            courier: courierId,
        });

        await courierService.markCourierAsUnavailable(courierId);
        
        return delivery;
    }

    static async updateDeliveryStatus(id, status) {
        const delivery = await DeliveryRepository.findById(id);
        if (!delivery) {
            throw new Error('Entrega no encontrada');
        }

        const allowedTransitions = {
            [ORDER_STATUS.ASSIGNED]: [ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.CANCELLED],
            [ORDER_STATUS.IN_TRANSIT]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED],
        };

        const allowedNextStatuses = allowedTransitions[delivery.status] || [];
        if (!allowedNextStatuses.includes(status)) {
            throw new Error(`Transición de estado no permitida: ${delivery.status} a ${status}`);
        }

        const updateData = { status };

        if (status === ORDER_STATUS.IN_TRANSIT) {
            updateData.startedAt = new Date();
        }
        if (status === ORDER_STATUS.DELIVERED) {
            updateData.deliveredAt = new Date();
        }
        if (status === ORDER_STATUS.CANCELLED) {
            updateData.cancelledAt = new Date();
        }

        const updatedDelivery = await DeliveryRepository.findByIdAndUpdate(id, updateData);

        await OrderRepository.findByIdAndUpdate(delivery.orderId, { status });

        if (status === ORDER_STATUS.DELIVERED || status === ORDER_STATUS.CANCELLED) {
            await courierService.markCourierAsAvailable(delivery.courierId);
        }
        return updatedDelivery;
    }
}
export default DeliveryService;
