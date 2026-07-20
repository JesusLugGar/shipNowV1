import UserRepository from '../repositories/user.repository.js';

class UserService {
    static async getAllUsers() {
        return await UserRepository.find();
    }
}

export default UserService;