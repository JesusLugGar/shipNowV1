import CourierModel from '../models/courier.model.js';

import { ERROR_CODES } from '../error/error-codes.js';
import CustomError from '../error/custom.error.js';
import { COURIER_STATUS } from '../utils/constants.js';

class CourierRepository {
    static async find() {
        return await CourierModel.find();
    }

    static async findById(id) {
        return await CourierModel.findById(id);
    }

    static async create(courierData) {
        const courier = new CourierModel(courierData);
        return await courier.save();
    }

    static async findByIdAndUpdate(id, courierData) {
        return await CourierModel.findByIdAndUpdate(id, courierData, { returnDocument: 'after', runValidators: true });
    }

    static async findByIdAndDelete(id) {
        return await CourierModel.findByIdAndDelete(id);
    }

    static async findAvailable() {
        return await CourierModel.find({ availableStatus: COURIER_STATUS.AVAILABLE });
    }

    static async findAvailableByZone(zone) {
        if (!zone) {
            throw new CustomError(ERROR_CODES.VALIDATION_ERROR, 'Zone parameter is required');
        }
        return await CourierModel.find({ zone: zone, availableStatus: COURIER_STATUS.AVAILABLE });
    } 
}

export default CourierRepository;