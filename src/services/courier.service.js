import CourierRepository from '../repositories/courier.repository.js';

import { ERROR_CODES } from '../error/error-codes.js';
import CustomError from '../error/custom.error.js';
import { COURIER_STATUS } from '../utils/constants.js';

class CourierService {
    static async getAllCouriers() {
        return await CourierRepository.find();
    }

    static async getCourierById(id) {
        const courier = await CourierRepository.findById(id);

        if (!courier) {
            throw new CustomError(ERROR_CODES.COURIER_NOT_FOUND);
        }

        return courier;
    }

    static async getAvailableCouriers() { 
        return await CourierRepository.findAvailable();
    }
    
    static async getAvailableCourierByZone(zone) {
        if (!zone) {
            throw new CustomError(ERROR_CODES.VALIDATION_ERROR, 'Zone parameter is required');
        }
        return await CourierRepository.findAvailableByZone(zone);
    }

    static async createCourier(courierData) {
        const { nameCourier, zone } = courierData;

        if(!nameCourier || !zone) {
            throw new CustomError(
                ERROR_CODES.VALIDATION_ERROR,
                'Missing required fields: nameCourier and zone are required',
            );
        }
        return await CourierRepository.create(courierData);

    }

    static async updateCourier(id, courierData) {
        const courier = await CourierRepository.findByIdAndUpdate(id, courierData, { new: true, runValidators: true });

        if (!courier) {
            throw new CustomError(ERROR_CODES.COURIER_NOT_FOUND);
        }

        return courier;
    }

    static async deleteCourier(id) {
        const courier = await CourierRepository.findByIdAndDelete(id);

        if (!courier) {
            throw new CustomError(ERROR_CODES.COURIER_NOT_FOUND);
        }

        return courier;
    }

    static async markCourierAsUnavailable(id) {

        const courier = await CourierRepository.findById(id);
        if (!courier) {
            throw new CustomError(ERROR_CODES.COURIER_NOT_FOUND);
        }

        if (courier.availableStatus === COURIER_STATUS.UNAVAILABLE) {
            throw new CustomError(ERROR_CODES.COURIER_ALREADY_UNAVAILABLE);
        }
        return await CourierRepository.findByIdAndUpdate(id, { availableStatus: COURIER_STATUS.UNAVAILABLE });
    }

    static async markCourierAsAvailable(id) {
        const courier = await CourierRepository.findById(id);
        if (!courier) {
            throw new CustomError(ERROR_CODES.COURIER_NOT_FOUND);
        }

        if (courier.availableStatus === COURIER_STATUS.AVAILABLE) {
            throw new CustomError(ERROR_CODES.COURIER_ALREADY_AVAILABLE);
        }
        return await CourierRepository.findByIdAndUpdate(id, { availableStatus: COURIER_STATUS.AVAILABLE });
    }
}

export default CourierService;