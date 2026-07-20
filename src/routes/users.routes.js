import express from 'express';
import Usercontroller from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', Usercontroller.getAllUsers);

router.get('/:id', (req, res) => {
  const {id} = req.params;
  res.send(`Detalles del usuario con ID: ${id}`);
});

router.post('/', (req, res) => {
  const { name, email } = req.body;
  res.send(`Usuario creado: ${name}, Email: ${email}`);
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name , email} = req.body;
    res.send(`Usuario con ID: ${id} actualizado a Nombre: ${name}, Email: ${email}`);
});

router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const { name , email} = req.body;
    res.send(`Usuario con ID: ${id} parcialmente actualizado a Nombre: ${name}, Email: ${email}`);
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    res.send(`Usuario con ID: ${id} eliminado`);
});

export default router;