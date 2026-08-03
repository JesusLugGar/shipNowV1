import MockService from '../services/mocks.services.js';
import { ERROR_CODES } from '../../error/error-codes.js';
import CustomError from '../../error/custom.error.js';

class MockController {
    static getMockOptions(req) {
        const body = req.body || {};
        const rawQty = req.query.qty || req.query.count || body.qty || body.count || 10;
        const count = Number(rawQty);
        const saveToDatabase = body.saveToDatabase === true || req.query.saveToDatabase === 'true';

        if (!Number.isInteger(count) || count <= 0 || count > 50) {
            throw new CustomError(ERROR_CODES.INVALID_MOCK_AMOUNT, 'El campo qty/count debe ser un número entero entre 1 y 50');
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
            res.status(200).json(MockService.generateMockUsers(count));
        } catch (error) {
            next(error);
        }
    }

    static getMockProducts(req, res, next) {
        try {
            const { count } = MockController.getMockOptions(req);
            res.status(200).json(MockService.generateMockProducts(count));
        } catch (error) {
            next(error);
        }
    }

    static getMockCouriers(req, res, next) {
        try {
            const { count } = MockController.getMockOptions(req);
            res.status(200).json(MockService.generateMockCouriers(count));
        } catch (error) {
            next(error);
        }
    }

    static getMockOrders(req, res, next) {
        try {
            const { count } = MockController.getMockOptions(req);
            const scenario = MockService.generateMockScenario(count);

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
            res.status(200).json(MockService.generateMockScenario(count));
        } catch (error) {
            next(error);
        }
    }

    static async seed(req, res, next) {
        try {
            const { count } = MockController.getMockOptions(req);
            const collection = MockController.getSeedCollection(req);
            const result = await MockService.seedMockData(count, collection);

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
                return res.status(201).json(result);
            }

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
                return res.status(201).json(result);
            }

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
                return res.status(201).json(result);
            }

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
                return res.status(201).json(result);
            }

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
                return res.status(201).json(result);
            }

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