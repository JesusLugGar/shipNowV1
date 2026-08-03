import ProductsService from '../services/product.service.js';

class ProductsController {
  static async getAllProducts(req, res, next) {
    try {
      const products = await ProductsService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req, res, next) {
    try {
      const productData = req.body;
      const newProduct = await ProductsService.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      const productId = req.params.id;
      const product = await ProductsService.getProductById(productId);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req, res, next) {
    try {
      const productId = req.params.id;
      const updatedData = req.body;
      const updatedProduct = await ProductsService.updateProduct(productId, updatedData);
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }

  static async partiallyUpdateProduct(req, res, next) {
    try {
      const productId = req.params.id;
      const updatedData = req.body;
      const updatedProduct = await ProductsService.partiallyUpdateProduct(productId, updatedData);
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const productId = req.params.id;
      await ProductsService.deleteProduct(productId);
      res.status(200).json({ message: 'Producto borrado con éxito' });
    } catch (error) {
      next(error);
    }
  }
}

export default ProductsController;