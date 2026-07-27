import DeliveryModel from '../models/delivery.model.js';

class DeliveryRepository {
    static async find() {
        return await DeliveryModel.find();
    }

    static async findById(id) {
        return await DeliveryModel.findById(id);
    }

    static async create(deliveryData) {
        const delivery = new DeliveryModel(deliveryData);
        return await delivery.save();
    }

    static async findByCourierId(courierId) {
        return await DeliveryModel.find({ courierId });
    }

    static async findByOrderId(orderId) {
        return await DeliveryModel.findOne({ orderId });
    }

    static async findByIdAndUpdate(id, deliveryData) {
        return await DeliveryModel.findByIdAndUpdate(id, deliveryData, { returnDocument: 'after', runValidators: true });
    }

    static async updateDeliveryStatus(id, status) {
        return await DeliveryModel.findByIdAndUpdate(id, { status }, { returnDocument: 'after', runValidators: true });
    }
}

export default DeliveryRepository;