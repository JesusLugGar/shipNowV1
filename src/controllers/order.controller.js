import OrderService from '../services/order.service.js';

class OrderController {
    static async getAllOrders(req, res) {
        try {
            const orders = await OrderService.getAllOrders();
            res.status(200).json(orders);
        } catch (error) {
            console.warn('Error fetching orders:', error);
            res.status(500).json({ message: 'Error obteniendo los pedidos' });
        }
    }

    static async getOrderById(req, res) {
        try {
            const orderId = req.params.id;
            const order = await OrderService.getOrderById(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Pedido no encontrado' });
            }
            res.status(200).json(order);
        } catch (error) {
            console.warn('Error fetching order by ID:', error);
            res.status(500).json({ message: 'Error obteniendo el pedido por ID' });
        }
    }

    static async createOrder(req, res) {
        try {
            const orderData = req.body;
            const newOrder = await OrderService.createOrder(orderData);
            res.status(201).json(newOrder);
        } catch (error) {
            console.warn('Error creating order:', error);
            res.status(400).json({ message: error.message });
        }
    }

    static async updateOrder(req, res) {
        try {
            const orderId = req.params.id;
            const updatedData = req.body;
            const updatedOrder = await OrderService.updateOrder(orderId, updatedData);
            if (!updatedOrder) {
                return res.status(404).json({ message: 'Pedido no encontrado' });
            }
            res.status(200).json(updatedOrder);
        } catch (error) {
            console.warn('Error updating order:', error);
            res.status(500).json({ message: 'Error actualizando el pedido' });
        }
    }

    static async partiallyUpdateOrder(req, res) {
        try {
            const orderId = req.params.id;
            const updatedData = req.body;
            const updatedOrder = await OrderService.partiallyUpdateOrder(orderId, updatedData);
            if (!updatedOrder) {
                return res.status(404).json({ message: 'Pedido no encontrado' });
            }
            res.status(200).json(updatedOrder);
        } catch (error) {
            console.warn('Error partially updating order:', error);
            res.status(500).json({ message: 'Error actualizando parcialmente el pedido' });
        }
    }

    static async deleteOrder(req, res) {
        try {
            const orderId = req.params.id;
            const deletedOrder = await OrderService.deleteOrder(orderId);
            if (!deletedOrder) {
                return res.status(404).json({ message: 'Pedido no encontrado' });
            }
            res.status(200).json({ message: 'Pedido eliminado correctamente' });
        } catch (error) {
            console.warn('Error deleting order:', error);
            res.status(500).json({ message: 'Error eliminando el pedido' });
        }
    }   
}

export default OrderController;