import UserService from '../services/user.service.js';

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.warn('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  }
}

export default UserController;
