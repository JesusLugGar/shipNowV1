import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

import UserModel from '../../models/user.model.js';
import ProductModel from '../../models/product.model.js';
import OrderModel from '../../models/order.model.js';

import {
    USER_ROLES,
    STATUS_PRODUCTS,
    ORDER_STATUS,
    DELIVERY_PRIORITY,
} from '../../utils/constants.js';

class MockService {
    static generateMockUsers(count) {
        return Array.from({ length: count }, () => ({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email().toLowerCase(),
            password: '123456',
            role: faker.helpers.arrayElement(Object.values(USER_ROLES)),
        }));
    }

    static async saveMockUsers(users) {
        const usersToSave = await Promise.all(
            users.map(async (user) => ({
                ...user,
                password: await bcrypt.hash(user.password, 10),
            })),
        );

        return await UserModel.insertMany(usersToSave);
    }

    static generateMockProducts(count) {
        return Array.from({ length: count }, () => {
            const stock = faker.number.int({ min: 0, max: 100 });

            return {
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: faker.number.int({ min: 1000, max: 100000 }),
                stock,
                status: stock > 0 ? STATUS_PRODUCTS.AVAILABLE : STATUS_PRODUCTS.OUT_OF_STOCK,
            };
        });
    }

    static async saveMockProducts(products) {
        return await ProductModel.insertMany(products);
    }

    static generateMockOrders(count) {
        return Array.from({ length: count }, () => {
            const products = Array.from(
                { length: faker.number.int({ min: 1, max: 3 }) },
                () => {
                    const quantity = faker.number.int({ min: 1, max: 5 });
                    const price = faker.number.int({ min: 1000, max: 50000 });

                    return {
                        productId: faker.database.mongodbObjectId(),
                        quantity,
                        price,
                    };
                },
            );

            const productsCost = products.reduce((total, product) => {
                return total + product.price * product.quantity;
            }, 0);

            const costDelivery = faker.number.int({ min: 2500, max: 7000 });

            return {
                customerName: faker.person.fullName(),
                customerId: faker.database.mongodbObjectId(),
                address: faker.location.streetAddress(),
                costDelivery,
                status: ORDER_STATUS.CREATED,
                priority: faker.helpers.arrayElement(Object.values(DELIVERY_PRIORITY)),
                products,
                totalCost: productsCost + costDelivery,
            };
        });
    }

    static async saveMockOrders(orders) {
        return await OrderModel.insertMany(orders);
    }
}

export default MockService;