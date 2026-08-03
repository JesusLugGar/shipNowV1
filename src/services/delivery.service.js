import DeliveryRepository from '../repositories/delivery.repository.js';
import OrderRepository from '../repositories/order.repository.js';

import { ERROR_CODES } from '../error/error-codes.js';
import CustomError from '../error/custom.error.js';
import courierService from './courier.service.js';

import { ORDER_STATUS, COURIER_STATUS } from '../utils/constants.js';

class DeliveryService {
    static async getAllDeliveries() {
        return await DeliveryRepository.find();
    }
    static async getDeliveryById(id) {
        const delivery = await DeliveryRepository.findById(id);

        if (!delivery) {
            throw new CustomError(ERROR_CODES.DELIVERY_NOT_FOUND);
        }

        return delivery;
    }

    static async assignDelivery(deliveryData) {
        const { orderId, courierId } = deliveryData;

        if (!orderId || !courierId) {
            throw new CustomError(
                ERROR_CODES.VALIDATION_ERROR,
                'Faltan campos obligatorios: orderId y courierId son requeridos.',
            );
        }

        const order = await OrderRepository.findById(orderId);
        if (!order) {
            throw new CustomError(ERROR_CODES.ORDER_NOT_FOUND);
        }
        
        if (order.status !== ORDER_STATUS.CREATED) {
            throw new CustomError(
                ERROR_CODES.INVALID_ORDER_STATUS,
                'La orden no está en estado creado y no puede ser asignada a un repartidor.',
            );
        }

        const existingDelivery = await DeliveryRepository.findByOrderId(orderId);
        if (existingDelivery) {
            throw new CustomError(ERROR_CODES.DELIVERY_ALREADY_ASSIGNED);
        }
        
        const courier = await courierService.getCourierById(courierId);

        if (courier.availableStatus !== COURIER_STATUS.AVAILABLE) {
            throw new CustomError(ERROR_CODES.COURIER_NOT_AVAILABLE, 'El repartidor no está disponible para asignar la entrega.');
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
            throw new CustomError(ERROR_CODES.DELIVERY_NOT_FOUND);
        }

        const allowedTransitions = {
            [ORDER_STATUS.ASSIGNED]: [ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.CANCELLED],
            [ORDER_STATUS.IN_TRANSIT]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED],
        };

        const allowedNextStatuses = allowedTransitions[delivery.status] || [];
        if (!allowedNextStatuses.includes(status)) {
            throw new CustomError(
                ERROR_CODES.INVALID_DELIVERY_STATUS,
                `Transición de estado no permitida: ${delivery.status} a ${status}`,
            );
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
