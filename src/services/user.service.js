import UserRepository from '../repositories/user.repository.js';

import bcrypt from 'bcrypt';

class UserService {
    static async getAllUsers() {
        return await UserRepository.find();
    }

    static async getUserById(id) {
        return await UserRepository.findById(id);
    }

    static async createUser(userData) {
        const { first_name, last_name, email, password } = userData;

        if (!first_name || !last_name || !email || !password) {
            throw new Error('Faltan campos obligatorios: first_name, last_name, email y password son requeridos.');  
        }

        const existingUser = await UserRepository.find().then(users => users.find(user => user.email === email));

        if (existingUser) {
            throw new Error('El email ya está en uso.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        return await UserRepository.create({
            ...userData,
            password: hashedPassword
        });
    }

    static async partiallyUpdateUser(id, userData) {
        return await UserRepository.findByIdAndUpdate(id, userData);
    }

    static async updateUser(id, userData) {
        return await UserRepository.findByIdAndUpdate(id, userData);
    }

    static async deleteUser(id) {
        return await UserRepository.findByIdAndDelete(id);
    }   
}

export default UserService;