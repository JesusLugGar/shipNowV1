import UserService from '../services/user.service.js';

class UserController {
  static async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req, res, next){
    try {
      const userData = req.body;
      const newUser = await UserService.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const userId = req.params.id;
      const user = await UserService.getUserById(userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const userId = req.params.id;
      const updatedData = req.body;
      const updatedUser = await UserService.updateUser(userId, updatedData);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  static async partiallyUpdateUser(req, res, next) {
    try {
      const userId = req.params.id;
      const updatedData = req.body;
      const updatedUser = await UserService.partiallyUpdateUser(userId, updatedData);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const userId = req.params.id;
      await UserService.deleteUser(userId);
      res.status(200).json({ message: 'Usuario borrado con éxito' });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
