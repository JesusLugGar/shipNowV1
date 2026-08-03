import UserRepository from '../repositories/user.repository.js';
import { ERROR_CODES } from '../error/error-codes.js';
import CustomError from '../error/custom.error.js';

import bcrypt from 'bcrypt';

class UserService {
    static async getAllUsers() {
        return await UserRepository.find();
    }

    static async getUserById(id) {
        const user = await UserRepository.findById(id);

        if (!user) {
            throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
        }

        return user;
    }

    static async createUser(userData) {
        const { first_name, last_name, email, password } = userData;

        if (!first_name || !last_name || !email || !password) {
            throw new CustomError(
                ERROR_CODES.VALIDATION_ERROR,
                'Faltan campos obligatorios: first_name, last_name, email y password son requeridos.',
            );
        }

        const existingUser = await UserRepository.find().then(users => users.find(user => user.email === email));

        if (existingUser) {
            throw new CustomError(ERROR_CODES.EMAIL_DUPLICATE);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        return await UserRepository.create({
            ...userData,
            password: hashedPassword
        });
    }

    static async partiallyUpdateUser(id, userData) {
        const user = await UserRepository.findByIdAndUpdate(id, userData);

        if (!user) {
            throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
        }

        return user;
    }

    static async updateUser(id, userData) {
        const user = await UserRepository.findByIdAndUpdate(id, userData);

        if (!user) {
            throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
        }

        return user;
    }

    static async deleteUser(id) {
        const user = await UserRepository.findByIdAndDelete(id);

        if (!user) {
            throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
        }

        return user;
    }   
}

export default UserService;