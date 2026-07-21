import express from 'express';
import ProductsController from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', ProductsController.getAllProducts);

router.get('/:id', ProductsController.getProductById);

router.post('/', ProductsController.createProduct);

router.put('/:id', ProductsController.updateProduct);

router.patch('/:id', ProductsController.partiallyUpdateProduct);

router.delete('/:id', ProductsController.deleteProduct);

export default router;