import UserService from '../services/user.service.js';

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.warn('Error fetching users:', error);
      res.status(500).json({ message: 'Error obteniendo los usuarios' });
    }
  }

  static async createUser(req, res){
    try {
      const userData = req.body;
      const newUser = await UserService.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      console.warn('Error creating user:', error);
      res.status(400).json({ message: 'Error creando el usuario' });
    }
  }

  static async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = await UserService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.warn('Error fetching user by ID:', error);
      res.status(500).json({ message: 'Error obteniendo el usuario por ID' });
    }
  }

  static async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const updatedData = req.body;
      const updatedUser = await UserService.updateUser(userId, updatedData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      console.warn('Error updating user:', error);
      res.status(500).json({ message: 'Error actualizando el usuario' });
    }
  }

  static async partiallyUpdateUser(req, res) {
    try {
      const userId = req.params.id;
      const updatedData = req.body;
      const updatedUser = await UserService.partiallyUpdateUser(userId, updatedData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      console.warn('Error partially updating user:', error);
      res.status(500).json({ message: 'Error actualizando parcialmente el usuario' });
    }
  }

  static async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      const deletedUser = await UserService.deleteUser(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json({ message: 'Usuario borrado con éxito' });
    } catch (error) {
      console.warn('Error deleting user:', error);
      res.status(500).json({ message: 'Error borrando el usuario' });
    }
  }
}

export default UserController;
