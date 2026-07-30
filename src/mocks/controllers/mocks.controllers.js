import MockService from '../services/mocks.services.js';

class MockController {
    static getMockOptions(req) {
        const { count = 20, saveToDatabase = false } = req.body;

        if (typeof count !== 'number') {
        throw new Error('El campo count debe ser un número, no un string.');
        }

        if (!Number.isInteger(count) || count <= 0 || count > 20) {
            throw new Error('El campo count debe ser un número entre 1 y 20');
        }

        return { count, saveToDatabase };
    }

    static async generateUsers(req, res) {
        try {
            const { count, saveToDatabase } = MockController.getMockOptions(req);

            const users = MockService.generateMockUsers(count);

            if (saveToDatabase) {
                await MockService.saveMockUsers(users);

                return res.status(201).json({
                    users,
                    message: 'Users saved in db successfully',
                });
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
                await MockService.saveMockProducts(products);

                return res.status(201).json({
                    products,
                    message: 'Products saved in db successfully',
                });
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

            const orders = MockService.generateMockOrders(count);

            if (saveToDatabase) {
                await MockService.saveMockOrders(orders);

                return res.status(201).json({
                    orders,
                    message: 'Orders saved in db successfully',
                });
            }

            res.status(200).json({
                orders,
                message: 'Orders generated successfully',
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default MockController;