import MockService from '../services/mocks.services.js';

class MockController {
    static getMockOptions(req) {
        const body = req.body || {};
        const rawQty = req.query.qty || req.query.count || body.qty || body.count || 10;
        const count = Number(rawQty);
        const saveToDatabase = body.saveToDatabase === true || req.query.saveToDatabase === 'true';

        if (!Number.isInteger(count) || count <= 0 || count > 50) {
            throw new Error('El campo qty/count debe ser un número entero entre 1 y 50');
        }

        return { count, saveToDatabase };
    }

    static getSeedCollection(req) {
        const body = req.body || {};
        return req.query.collection || body.collection || 'all';
    }

    static getMockUsers(req, res) {
        try {
            const { count } = MockController.getMockOptions(req);
            res.status(200).json(MockService.generateMockUsers(count));
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static getMockProducts(req, res) {
        try {
            const { count } = MockController.getMockOptions(req);
            res.status(200).json(MockService.generateMockProducts(count));
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static getMockCouriers(req, res) {
        try {
            const { count } = MockController.getMockOptions(req);
            res.status(200).json(MockService.generateMockCouriers(count));
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static getMockOrders(req, res) {
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
            res.status(400).json({ message: error.message });
        }
    }

    static getMockDeliveries(req, res) {
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
            res.status(400).json({ message: error.message });
        }
    }

    static getMockScenario(req, res) {
        try {
            const { count } = MockController.getMockOptions(req);
            res.status(200).json(MockService.generateMockScenario(count));
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async seed(req, res) {
        try {
            const { count } = MockController.getMockOptions(req);
            const collection = MockController.getSeedCollection(req);
            const result = await MockService.seedMockData(count, collection);

            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async generateUsers(req, res) {
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
            res.status(400).json({ message: error.message });
        }
    }

    static async generateProducts(req, res) {
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
            res.status(400).json({ message: error.message });
        }
    }

    static async generateOrders(req, res) {
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
            res.status(400).json({ message: error.message });
        }
    }

    static async generateCouriers(req, res) {
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
            res.status(400).json({ message: error.message });
        }
    }

    static async generateDeliveries(req, res) {
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
            res.status(400).json({ message: error.message });
        }
    }
}

export default MockController;