import OrderRepository from '../repositories/order.repository.js';

import { ERROR_CODES } from '../error/error-codes.js';
import CustomError from '../error/custom.error.js';
import UserRepository from '../repositories/user.repository.js';
import ProductsService from './product.service.js';

class OrderService {
  static async getAllOrders() {
    return await OrderRepository.find();
  }

  static async getOrderById(id) {
    const order = await OrderRepository.findById(id);

    if (!order) {
      throw new CustomError(ERROR_CODES.ORDER_NOT_FOUND);
    }

    return order;
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
      throw new CustomError(
        ERROR_CODES.VALIDATION_ERROR,
        'Faltan campos obligatorios: customerId, address, priority y products son requeridos.',
      );
    }

    const customer = await UserRepository.findById(customerId);

    if (!customer) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND, 'El cliente no existe.');
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
    const order = await OrderRepository.findByIdAndUpdate(id, orderData, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!order) {
      throw new CustomError(ERROR_CODES.ORDER_NOT_FOUND);
    }

    return order;
  }

  static async updateOrder(id, orderData) {
    const order = await OrderRepository.findByIdAndUpdate(id, orderData, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!order) {
      throw new CustomError(ERROR_CODES.ORDER_NOT_FOUND);
    }

    return order;
  }

  static async deleteOrder(id) {
    const order = await OrderRepository.findByIdAndDelete(id);

    if (!order) {
      throw new CustomError(ERROR_CODES.ORDER_NOT_FOUND);
    }

    return order;
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
