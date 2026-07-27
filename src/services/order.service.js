import OrderRepository from '../repositories/order.repository.js';

import UserRepository from '../repositories/user.repository.js';
import ProductsService from './product.service.js';

class OrderService {
  static async getAllOrders() {
    return await OrderRepository.find();
  }

  static async getOrderById(id) {
    return await OrderRepository.findById(id);
  }

  static async createOrder(orderData) {
    const { customerId, address, priority, products } = orderData;

    if (
      !customerId ||
      !address ||
      !priority ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      throw new Error(
        'Faltan campos obligatorios: customerId, address, priority y products son requeridos.',
      );
    }

    const customer = await UserRepository.findById(customerId);

    if (!customer) {
      throw new Error('El cliente no existe.');
    }

    const { orderProducts, productsCost } = await ProductsService.prepareProductsForOrder(products);
    const costDelivery = OrderService.calculateDeliveryCost(priority);
    const totalCost = productsCost + costDelivery;

    const createdOrder = await OrderRepository.create({
      customerId,
      customerName: `${customer.first_name} ${customer.last_name}`,
      address,
      costDelivery,
      priority,
      products: orderProducts,
      totalCost,
    });

    await ProductsService.decreaseStockForOrder(orderProducts);

    return createdOrder;
  }

  static async partiallyUpdateOrder(id, orderData) {
    return await OrderRepository.findByIdAndUpdate(id, orderData, {
      returnDocument: 'after',
      runValidators: true,
    });
  }

  static async updateOrder(id, orderData) {
    return await OrderRepository.findByIdAndUpdate(id, orderData, {
      returnDocument: 'after',
      runValidators: true,
    });
  }

  static async deleteOrder(id) {
    return await OrderRepository.findByIdAndDelete(id);
  }

  static calculateDeliveryCost(priority) {
    const deliveryCosts = {
      low: 2500,
      medium: 3500,
      high: 5000,
    };

    return deliveryCosts[priority] || deliveryCosts.medium;
  }
}

export default OrderService;
