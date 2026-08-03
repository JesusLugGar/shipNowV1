import CourierService from '../services/courier.service.js';

class CourierController {
    static async getAllCouriers(req, res, next) {
        try {
            const couriers = await CourierService.getAllCouriers();
            res.status(200).json(couriers);
        } catch (error) {
            next(error);
        }
    }

    static async getAvailableCouriers(req, res, next) {
        try {
            const couriers = await CourierService.getAvailableCouriers();
            res.status(200).json(couriers);
        } catch (error) {
            next(error);
        }
    }

    static async getCourierById(req, res, next) {
        try {
            const courierId = req.params.id;
            const courier = await CourierService.getCourierById(courierId);
            res.status(200).json(courier);
        } catch (error) {
            next(error);
        }
    }

    static async createCourier(req, res, next) {
        try {
            const courierData = req.body;
            const newCourier = await CourierService.createCourier(courierData);
            res.status(201).json(newCourier);
        } catch (error) {
            next(error);
        }
    }
    
    static async updateCourier(req, res, next) {
        try {
            const courierId = req.params.id;
            const updatedData = req.body;
            const updatedCourier = await CourierService.updateCourier(courierId, updatedData);
            res.status(200).json(updatedCourier);
        } catch (error) {
            next(error);
        }
    }
    
    static async deleteCourier(req, res, next) {
        try {
            const courierId = req.params.id;
            await CourierService.deleteCourier(courierId);
            res.status(200).json({ message: 'Repartidor eliminado correctamente' });
        } catch (error) {
            next(error);
        }
    }

    static async markCourierAsUnavailable(req, res, next) {
        try {
            const courierId = req.params.id;
            const updatedCourier = await CourierService.markCourierAsUnavailable(courierId);
            res.status(200).json(updatedCourier);
        } catch (error) {
            next(error);
        }
    }

    static async markCourierAsAvailable(req, res, next) {
        try {
            const courierId = req.params.id;
            const updatedCourier = await CourierService.markCourierAsAvailable(courierId);
            res.status(200).json(updatedCourier);
        } catch (error) {
            next(error);
        }
    }

    static async getAvailableCouriersByZone(req, res, next) {
        try {
            const zone = req.params.zone;
            const couriers = await CourierService.getAvailableCourierByZone(zone);
            res.status(200).json(couriers);
        } catch (error) {
            next(error);
        }
    }
}

export default CourierController;