import express from 'express';
import Usercontroller from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', Usercontroller.getAllUsers);

router.get('/:id', Usercontroller.getUserById);

router.post('/', Usercontroller.createUser);

router.put('/:id', Usercontroller.updateUser);

router.patch('/:id', Usercontroller.partiallyUpdateUser);

router.delete('/:id', Usercontroller.deleteUser);

export default router;