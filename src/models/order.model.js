import mongoose from 'mongoose';

import { ORDER_STATUS } from '../utils/constants.js';
import { DELIVERY_PRIORITY } from '../utils/constants.js';

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String, required: true },
    costDelivery: { type: Number, required: true },
    status: { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.CREATED },
    priority: { type: String, enum: Object.values(DELIVERY_PRIORITY), default: DELIVERY_PRIORITY.MEDIUM },
    products: [{ 
        productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }
    }],
    courier: { type: mongoose.Schema.Types.ObjectId, ref: 'Courier' },
    totalCost: { type: Number, required: true }
}
);

const OrderModel = mongoose.model('Order', orderSchema);

export default OrderModel;