import mongoose from 'mongoose';

import { COURIER_STATUS } from '../utils/constants.js';

const courierSchema = new mongoose.Schema({
    nameCourier: { type: String, required: true },
    zone: { type: String, required: true },
    availableStatus: { type: String, enum: Object.values(COURIER_STATUS), default: COURIER_STATUS.AVAILABLE },
});

const CourierModel = mongoose.model('Courier', courierSchema);

export default CourierModel;