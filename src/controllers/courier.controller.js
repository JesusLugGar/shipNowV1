import CourierService from '../services/courier.service.js';

class CourierController {
    static async getAllCouriers(req, res) {
        try {
            const couriers = await CourierService.getAllCouriers();
            res.status(200).json(couriers);
        } catch (error) {
            console.warn('Error fetching couriers:', error);
            res.status(500).json({ message: 'Error obteniendo los repartidores' });
        }
    }

    static async getAvailableCouriers(req, res) {
        try {
            const couriers = await CourierService.getAvailableCouriers();
            res.status(200).json(couriers);
        } catch (error) {
            console.warn('Error fetching available couriers:', error);
            res.status(500).json({ message: 'Error obteniendo los repartidores disponibles' });
        }
    }

    static async getCourierById(req, res) {
        try {
            const courierId = req.params.id;
            const courier = await CourierService.getCourierById(courierId);
            if (!courier) {
                return res.status(404).json({ message: 'Repartidor no encontrado' });
            }
            res.status(200).json(courier);
        } catch (error) {
            console.warn('Error fetching courier by ID:', error);
            res.status(500).json({ message: 'Error obteniendo el repartidor por ID' });
        }
    }

    static async createCourier(req, res) {
        try {
            const courierData = req.body;
            const newCourier = await CourierService.createCourier(courierData);
            res.status(201).json(newCourier);
        } catch (error) {
            console.warn('Error creating courier:', error);
            res.status(400).json({ message: 'Error creando el repartidor' });
        }
    }
    
    static async updateCourier(req, res) {
        try {
            const courierId = req.params.id;
            const updatedData = req.body;
            const updatedCourier = await CourierService.updateCourier(courierId, updatedData);
            if (!updatedCourier) {
                return res.status(404).json({ message: 'Repartidor no encontrado' });
            }
            res.status(200).json(updatedCourier);
        } catch (error) {
            console.warn('Error updating courier:', error);
            res.status(500).json({ message: 'Error actualizando el repartidor' });
        }
    }
    
    static async deleteCourier(req, res) {
        try {
            const courierId = req.params.id;
            const deletedCourier = await CourierService.deleteCourier(courierId);
            if (!deletedCourier) {
                return res.status(404).json({ message: 'Repartidor no encontrado' });
            }
            res.status(200).json({ message: 'Repartidor eliminado correctamente' });
        } catch (error) {
            console.warn('Error deleting courier:', error);
            res.status(500).json({ message: 'Error eliminando el repartidor' });
        }
    }

    static async markCourierAsUnavailable(req, res) {
        try {
            const courierId = req.params.id;
            const updatedCourier = await CourierService.markCourierAsUnavailable(courierId);
            if (!updatedCourier) {
                return res.status(404).json({ message: 'Repartidor no encontrado' });
            }
            res.status(200).json(updatedCourier);
        } catch (error) {
            console.warn('Error marking courier as unavailable:', error);
            res.status(500).json({ message: 'Error marcando el repartidor como no disponible' });
        }
    }

    static async markCourierAsAvailable(req, res) {
        try {
            const courierId = req.params.id;
            const updatedCourier = await CourierService.markCourierAsAvailable(courierId);
            if (!updatedCourier) {
                return res.status(404).json({ message: 'Repartidor no encontrado' });
            }
            res.status(200).json(updatedCourier);
        } catch (error) {
            console.warn('Error marking courier as available:', error);
            res.status(500).json({ message: 'Error marcando el repartidor como disponible' });
        }
    }

    static async getAvailableCouriersByZone(req, res) {
        try {
            const zone = req.params.zone;
            const couriers = await CourierService.getAvailableCourierByZone(zone);
            res.status(200).json(couriers);
        } catch (error) {
            console.warn('Error fetching available couriers by zone:', error);
            res.status(500).json({ message: 'Error obteniendo los repartidores disponibles por zona' });
        }
    }
}

export default CourierController;