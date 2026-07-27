import CourierRepository from '../repositories/courier.repository.js';

import { COURIER_STATUS } from '../utils/constants.js';

class CourierService {
    static async getAllCouriers() {
        return await CourierRepository.find();
    }

    static async getCourierById(id) {
        return await CourierRepository.findById(id);
    }

    static async getAvailableCouriers() { 
        return await CourierRepository.findAvailable();
    }
    
    static async getAvailableCourierByZone(zone) {
        if (!zone) {
            throw new Error('Zone parameter is required');
        }
        return await CourierRepository.findAvailableByZone(zone);
    }

    static async createCourier(courierData) {
        const { nameCourier, zone } = courierData;

        if(!nameCourier || !zone) {
            throw new Error('Missing required fields: nameCourier and zone are required');
        }
        return await CourierRepository.create(courierData);

    }

    static async updateCourier(id, courierData) {
        return await CourierRepository.findByIdAndUpdate(id, courierData, { new: true, runValidators: true });
    }

    static async deleteCourier(id) {
        return await CourierRepository.findByIdAndDelete(id);
    }

    static async markCourierAsUnavailable(id) {

        const courier = await CourierRepository.findById(id);
        if (!courier) {
            throw new Error('Courier no encontrado');
        }

        if (courier.availableStatus === COURIER_STATUS.UNAVAILABLE) {
            throw new Error('Courier esta ya marcado como UnAvailable');
        }
        return await CourierRepository.findByIdAndUpdate(id, { availableStatus: COURIER_STATUS.UNAVAILABLE });
    }

    static async markCourierAsAvailable(id) {
        const courier = await CourierRepository.findById(id);
        if (!courier) {
            throw new Error('Courier no encontrado');
        }

        if (courier.availableStatus === COURIER_STATUS.AVAILABLE) {
            throw new Error('Courier esta ya marcado como Available');
        }
        return await CourierRepository.findByIdAndUpdate(id, { availableStatus: COURIER_STATUS.AVAILABLE });
    }
}

export default CourierService;