import CourierModel from '../../models/courier.model.js';
import DeliveryModel from '../../models/delivery.model.js';
import OrderModel from '../../models/order.model.js';
import ProductModel from '../../models/product.model.js';
import UserModel from '../../models/user.model.js';

import { COURIER_STATUS, ORDER_STATUS, USER_ROLES } from '../../utils/constants.js';

class MockRepository {
    static async insertUsers(users) {
        return await UserModel.insertMany(users);
    }

    static async insertProducts(products) {
        return await ProductModel.insertMany(products);
    }

    static async insertCouriers(couriers) {
        return await CourierModel.insertMany(couriers);
    }

    static async insertOrders(orders) {
        return await OrderModel.insertMany(orders);
    }

    static async insertDeliveries(deliveries) {
        return await DeliveryModel.insertMany(deliveries);
    }

    static async findCustomers(limit) {
        return await UserModel.find({ role: USER_ROLES.CUSTOMER }).limit(limit);
    }

    static async findAvailableProducts(limit) {
        return await ProductModel.find({ stock: { $gt: 0 } }).limit(limit);
    }

    static async findAvailableCouriers(limit) {
        return await CourierModel.find({ availableStatus: COURIER_STATUS.AVAILABLE }).limit(limit);
    }

    static async findCreatedOrdersWithoutCourier(limit) {
        return await OrderModel.find({
            status: ORDER_STATUS.CREATED,
            courier: { $exists: false },
        }).limit(limit);
    }
}

export default MockRepository;
