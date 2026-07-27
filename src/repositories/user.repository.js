import UserModel from '../models/user.model.js';

class UserRepository {
    static async find() {
        return await UserModel.find();
    }

    static async findById(id) {
        return await UserModel.findById(id);
    }

    static async create(userData) {
        const user = new UserModel(userData);
        return await user.save();
    }

    static async findByIdAndUpdate(id, userData) {
        return await UserModel.findByIdAndUpdate(id, userData, { returnDocument: 'after', runValidators: true });
    }

    static async findByIdAndDelete(id) {
        return await UserModel.findByIdAndDelete(id);
    }
}

export default UserRepository;