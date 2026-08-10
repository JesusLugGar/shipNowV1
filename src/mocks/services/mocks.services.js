import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import {
    COURIER_STATUS,
    USER_ROLES,
    STATUS_PRODUCTS,
    ORDER_STATUS,
    DELIVERY_PRIORITY,
} from '../../utils/constants.js';
import { ERROR_CODES } from '../../error/error-codes.js';
import CustomError from '../../error/custom.error.js';
import logger from '../../config/logger.js';

import MockRepository from '../repositories/mocks.repository.js';

class MockService {
    static createObjectId() {
        return new mongoose.Types.ObjectId();
    }

    static calculateDeliveryCost(priority) {
        const deliveryCosts = {
            [DELIVERY_PRIORITY.LOW]: 2500,
            [DELIVERY_PRIORITY.MEDIUM]: 3500,
            [DELIVERY_PRIORITY.HIGH]: 5000,
        };

        return deliveryCosts[priority] || deliveryCosts[DELIVERY_PRIORITY.MEDIUM];
    }

    static generateMockUsers(count, role) {
        return Array.from({ length: count }, () => ({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email({
                firstName: faker.string.uuid(),
                provider: 'mock.shipnow.test',
            }).toLowerCase(),
            password: '123456',
            role: role || faker.helpers.arrayElement(Object.values(USER_ROLES)),
        }));
    }

    static async saveMockUsers(users) {
        return await MockRepository.insertUsers(await MockService.hashUserPasswords(users));
    }

    static async hashUserPasswords(users) {
        return await Promise.all(users.map(async (user) => ({
            ...user,
            password: await bcrypt.hash(user.password, 10),
        })));
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
        return await MockRepository.insertProducts(products);
    }

    static generateMockCouriers(count) {
        return Array.from({ length: count }, () => ({
            nameCourier: faker.person.fullName(),
            zone: faker.location.city(),
            availableStatus: faker.helpers.arrayElement(Object.values(COURIER_STATUS)),
        }));
    }

    static async saveMockCouriers(couriers) {
        return await MockRepository.insertCouriers(couriers);
    }

    static generateMockOrders(count, customers, productsCatalog) {
        return Array.from({ length: count }, () => {
            const customer = faker.helpers.arrayElement(customers);
            const orderProducts = faker.helpers.arrayElements(
                productsCatalog,
                faker.number.int({ min: 1, max: Math.min(3, productsCatalog.length) }),
            ).map((product) => ({
                productId: product._id,
                quantity: faker.number.int({ min: 1, max: 5 }),
                price: product.price,
            }));

            const productsCost = orderProducts.reduce((total, product) => {
                return total + product.price * product.quantity;
            }, 0);
            const priority = faker.helpers.arrayElement(Object.values(DELIVERY_PRIORITY));
            const costDelivery = MockService.calculateDeliveryCost(priority);

            return {
                customerName: `${customer.first_name} ${customer.last_name}`,
                customerId: customer._id,
                address: faker.location.streetAddress(),
                costDelivery,
                status: ORDER_STATUS.CREATED,
                priority,
                products: orderProducts,
                totalCost: productsCost + costDelivery,
            };
        });
    }

    static async saveMockOrders(orders) {
        return await MockRepository.insertOrders(orders);
    }

    static generateMockDeliveries(count, orders, couriers) {
        return Array.from({ length: count }, (_, index) => ({
            orderId: orders[index % orders.length]._id,
            courierId: couriers[index % couriers.length]._id,
            status: ORDER_STATUS.ASSIGNED,
            assignedAt: faker.date.recent(),
        }));
    }

    static async saveMockDeliveries(deliveries) {
        return await MockRepository.insertDeliveries(deliveries);
    }

    static generateMockScenario(count) {
        const customers = MockService.generateMockUsers(count, USER_ROLES.CUSTOMER).map((user) => ({
            _id: MockService.createObjectId(),
            ...user,
        }));
        const drivers = MockService.generateMockUsers(count, USER_ROLES.DRIVER).map((user) => ({
            _id: MockService.createObjectId(),
            ...user,
        }));
        const products = MockService.generateMockProducts(Math.max(count, 3)).map((product) => ({
            _id: MockService.createObjectId(),
            ...product,
            stock: Math.max(product.stock, 1),
            status: STATUS_PRODUCTS.AVAILABLE,
        }));
        const couriers = MockService.generateMockCouriers(count).map((courier) => ({
            _id: MockService.createObjectId(),
            ...courier,
            availableStatus: COURIER_STATUS.AVAILABLE,
        }));
        const orders = MockService.generateMockOrders(count, customers, products).map((order, index) => ({
            _id: MockService.createObjectId(),
            ...order,
            status: ORDER_STATUS.ASSIGNED,
            courier: couriers[index % couriers.length]._id,
        }));
        const deliveries = MockService.generateMockDeliveries(count, orders, couriers);

        return {
            users: [...customers, ...drivers],
            products,
            couriers,
            orders,
            deliveries,
        };
    }

    static async seedMockData(count, collection = 'all') {
        const validCollections = ['all', 'users', 'products', 'couriers', 'orders', 'deliveries'];

        if (!validCollections.includes(collection)) {
            logger.warning(`Colección de mocks inválida recibida: ${collection}`);
            throw new CustomError(
                ERROR_CODES.INVALID_MOCK_TYPE,
                `Colección inválida. Valores permitidos: ${validCollections.join(', ')}`,
            );
        }

        if (collection === 'users') {
            const users = await MockService.saveMockUsers(MockService.generateMockUsers(count));
            return { insertados: users.length, coleccion: 'usuarios', users };
        }

        if (collection === 'products') {
            const products = await MockService.saveMockProducts(MockService.generateMockProducts(count));
            return { insertados: products.length, coleccion: 'productos', products };
        }

        if (collection === 'couriers') {
            const couriers = await MockService.saveMockCouriers(MockService.generateMockCouriers(count));
            return { insertados: couriers.length, coleccion: 'repartidores', couriers };
        }

        if (collection === 'orders') {
            const scenario = MockService.generateMockScenario(count);
            const users = await MockService.saveMockUsers(scenario.users);
            const products = await MockService.saveMockProducts(scenario.products);
            const ordersToSave = scenario.orders.map((order) => {
                const orderToSave = {
                    ...order,
                    status: ORDER_STATUS.CREATED,
                };

                delete orderToSave.courier;

                return orderToSave;
            });
            const orders = await MockService.saveMockOrders(ordersToSave);

            return {
                insertados: orders.length,
                coleccion: 'ordenes',
                dependencias: {
                    usuarios: users.length,
                    productos: products.length,
                },
                orders,
            };
        }

        if (collection === 'deliveries') {
            const scenario = MockService.generateMockScenario(count);
            const users = await MockService.saveMockUsers(scenario.users);
            const products = await MockService.saveMockProducts(scenario.products);
            const couriers = await MockService.saveMockCouriers(scenario.couriers);
            const orders = await MockService.saveMockOrders(scenario.orders);
            const deliveries = await MockService.saveMockDeliveries(scenario.deliveries);

            return {
                insertados: deliveries.length,
                coleccion: 'entregas',
                dependencias: {
                    usuarios: users.length,
                    productos: products.length,
                    repartidores: couriers.length,
                    ordenes: orders.length,
                },
                deliveries,
            };
        }

        const scenario = MockService.generateMockScenario(count);
        const users = await MockService.saveMockUsers(scenario.users);
        const products = await MockService.saveMockProducts(scenario.products);
        const couriers = await MockService.saveMockCouriers(scenario.couriers);
        const orders = await MockService.saveMockOrders(scenario.orders);
        const deliveries = await MockService.saveMockDeliveries(scenario.deliveries);

        return {
            insertados: users.length + products.length + couriers.length + orders.length + deliveries.length,
            coleccion: 'escenario_completo',
            detalle: {
                usuarios: users.length,
                productos: products.length,
                repartidores: couriers.length,
                ordenes: orders.length,
                entregas: deliveries.length,
            },
            data: {
                users,
                products,
                couriers,
                orders,
                deliveries,
            },
        };
    }
}

export default MockService;