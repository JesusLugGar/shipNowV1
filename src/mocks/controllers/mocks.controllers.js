import MockService from '../services/mocks.services.js';
import { ERROR_CODES } from '../../error/error-codes.js';
import CustomError from '../../error/custom.error.js';
import logger from '../../config/logger.js';

class MockController {
    static getMockOptions(req) {
        const body = req.body || {};
        const rawQty = req.query.qty || req.query.count || body.qty || body.count || 10;
        const count = Number(rawQty);
        const saveToDatabase = body.saveToDatabase === true || req.query.saveToDatabase === 'true';

        if (!Number.isInteger(count) || count <= 0 || count > 20) {
            logger.warning(`Intento de generar mocks con cantidad inválida: ${rawQty}`);
            throw new CustomError(ERROR_CODES.INVALID_MOCK_AMOUNT, 'El campo count debe ser un número entero entre 1 y 20');
        }

        return { count, saveToDatabase };
    }

    static getSeedCollection(req) {
        const body = req.body || {};
        return req.query.collection || body.collection || 'all';
    }

    static getMockUsers(req, res, next) {
        try {
            const { count } = MockController.getMockOptions(req);
            const users = MockService.generateMockUsers(count);
            logger.info(`Generados ${users.length} usuarios mock (solo memoria)`);
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    static getMockProducts(req, res, next) {
        try {
            const { count } = MockController.getMockOptions(req);
            const products = MockService.generateMockProducts(count);
            logger.info(`Generados ${products.length} productos mock (solo memoria)`);
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    static getMockCouriers(req, res, next) {
        try {
            const { count } = MockController.getMockOptions(req);
            const couriers = MockService.generateMockCouriers(count);
            logger.info(`Generados ${couriers.length} repartidores mock (solo memoria)`);
            res.status(200).json(couriers);
        } catch (error) {
            next(error);
        }
    }

    static getMockOrders(req, res, next) {
        try {
            const { count } = MockController.getMockOptions(req);
            const scenario = MockService.generateMockScenario(count);
            logger.info(`Generados ${scenario.orders.length} pedidos mock (solo memoria)`);

            res.status(200).json({
                orders: scenario.orders,
                relaciones: {
                    usuarios: scenario.users,
                    productos: scenario.products,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static getMockDeliveries(req, res, next) {
        try {
            const { count } = MockController.getMockOptions(req);
            const scenario = MockService.generateMockScenario(count);
            logger.info(`Generadas ${scenario.deliveries.length} entregas mock (solo memoria)`);

            res.status(200).json({
                deliveries: scenario.deliveries,
                relaciones: {
                    ordenes: scenario.orders,
                    repartidores: scenario.couriers,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static getMockScenario(req, res, next) {
        try {
            const { count } = MockController.getMockOptions(req);
            const scenario = MockService.generateMockScenario(count);
            logger.info(`Generado escenario mock completo (qty=${count})`);
            res.status(200).json(scenario);
        } catch (error) {
            next(error);
        }
    }

    static async seed(req, res, next) {
        try {
            const { count } = MockController.getMockOptions(req);
            const collection = MockController.getSeedCollection(req);
            const result = await MockService.seedMockData(count, collection);

            logger.info(
                `Mocks insertados en MongoDB: coleccion=${result.coleccion}, insertados=${result.insertados}`,
            );
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async generateUsers(req, res, next) {
        try {
            const { count, saveToDatabase } = MockController.getMockOptions(req);

            const users = MockService.generateMockUsers(count);

            if (saveToDatabase) {
                const result = await MockService.seedMockData(count, 'users');
                logger.info(
                    `Mocks insertados en MongoDB: coleccion=${result.coleccion}, insertados=${result.insertados}`,
                );
                return res.status(201).json(result);
            }

            logger.info(`Generados ${users.length} usuarios mock (solo memoria)`);
            res.status(200).json({
                users,
                message: 'Users generated successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    static async generateProducts(req, res, next) {
        try {
            const { count, saveToDatabase } = MockController.getMockOptions(req);

            const products = MockService.generateMockProducts(count);

            if (saveToDatabase) {
                const result = await MockService.seedMockData(count, 'products');
                logger.info(
                    `Mocks insertados en MongoDB: coleccion=${result.coleccion}, insertados=${result.insertados}`,
                );
                return res.status(201).json(result);
            }

            logger.info(`Generados ${products.length} productos mock (solo memoria)`);
            res.status(200).json({
                products,
                message: 'Products generated successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    static async generateOrders(req, res, next) {
        try {
            const { count, saveToDatabase } = MockController.getMockOptions(req);

            const scenario = MockService.generateMockScenario(count);

            if (saveToDatabase) {
                const result = await MockService.seedMockData(count, 'orders');
                logger.info(
                    `Mocks insertados en MongoDB: coleccion=${result.coleccion}, insertados=${result.insertados}`,
                );
                return res.status(201).json(result);
            }

            logger.info(`Generados ${scenario.orders.length} pedidos mock (solo memoria)`);
            res.status(200).json({
                orders: scenario.orders,
                relaciones: {
                    usuarios: scenario.users,
                    productos: scenario.products,
                },
                message: 'Orders generated successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    static async generateCouriers(req, res, next) {
        try {
            const { count, saveToDatabase } = MockController.getMockOptions(req);
            const couriers = MockService.generateMockCouriers(count);

            if (saveToDatabase) {
                const result = await MockService.seedMockData(count, 'couriers');
                logger.info(
                    `Mocks insertados en MongoDB: coleccion=${result.coleccion}, insertados=${result.insertados}`,
                );
                return res.status(201).json(result);
            }

            logger.info(`Generados ${couriers.length} repartidores mock (solo memoria)`);
            res.status(200).json({
                couriers,
                message: 'Couriers generated successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    static async generateDeliveries(req, res, next) {
        try {
            const { count, saveToDatabase } = MockController.getMockOptions(req);
            const scenario = MockService.generateMockScenario(count);

            if (saveToDatabase) {
                const result = await MockService.seedMockData(count, 'deliveries');
                logger.info(
                    `Mocks insertados en MongoDB: coleccion=${result.coleccion}, insertados=${result.insertados}`,
                );
                return res.status(201).json(result);
            }

            logger.info(`Generadas ${scenario.deliveries.length} entregas mock (solo memoria)`);
            res.status(200).json({
                deliveries: scenario.deliveries,
                relaciones: {
                    ordenes: scenario.orders,
                    repartidores: scenario.couriers,
                },
                message: 'Deliveries generated successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default MockController;