import mongoose from 'mongoose';
import { ORDER_STATUS } from '../utils/constants.js';

const deliverySchema = new mongoose.Schema({
    orderId: {type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true},
    courierId: {type: mongoose.Schema.Types.ObjectId, ref: 'Courier', required: true},
    status: {type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.ASSIGNED},
    assignedAt: { type: Date, default: Date.now },
    startedAt: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
});

const DeliveryModel = mongoose.model('Delivery', deliverySchema);

export default DeliveryModel;