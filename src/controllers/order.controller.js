import OrderService from '../services/order.service.js';

class OrderController {
    static async getAllOrders(req, res, next) {
        try {
            const orders = await OrderService.getAllOrders();
            res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    }

    static async getOrderById(req, res, next) {
        try {
            const orderId = req.params.id;
            const order = await OrderService.getOrderById(orderId);
            res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    }

    static async createOrder(req, res, next) {
        try {
            const orderData = req.body;
            const newOrder = await OrderService.createOrder(orderData);
            res.status(201).json(newOrder);
        } catch (error) {
            next(error);
        }
    }

    static async updateOrder(req, res, next) {
        try {
            const orderId = req.params.id;
            const updatedData = req.body;
            const updatedOrder = await OrderService.updateOrder(orderId, updatedData);
            res.status(200).json(updatedOrder);
        } catch (error) {
            next(error);
        }
    }

    static async partiallyUpdateOrder(req, res, next) {
        try {
            const orderId = req.params.id;
            const updatedData = req.body;
            const updatedOrder = await OrderService.partiallyUpdateOrder(orderId, updatedData);
            res.status(200).json(updatedOrder);
        } catch (error) {
            next(error);
        }
    }

    static async deleteOrder(req, res, next) {
        try {
            const orderId = req.params.id;
            await OrderService.deleteOrder(orderId);
            res.status(200).json({ message: 'Pedido eliminado correctamente' });
        } catch (error) {
            next(error);
        }
    }   
}

export default OrderController;