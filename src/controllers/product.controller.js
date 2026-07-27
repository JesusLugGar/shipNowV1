import ProductsService from '../services/product.service.js';

class ProductsController {
  static async getAllProducts(req, res) {
    try {
      const products = await ProductsService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      console.warn('Error fetching products:', error);
      res.status(500).json({ message: 'Error obteniendo los productos' });
    }
  }

  static async createProduct(req, res) {
    try {
      const productData = req.body;
      const newProduct = await ProductsService.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      console.warn('Error creating product:', error);
      res.status(400).json({ message: 'Error creando el producto' });
    }
  }

  static async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const product = await ProductsService.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.status(200).json(product);
    } catch (error) {
      console.warn('Error fetching product by ID:', error);
      res.status(500).json({ message: 'Error obteniendo el producto por ID' });
    }
  }

  static async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const updatedData = req.body;
      const updatedProduct = await ProductsService.updateProduct(productId, updatedData);
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.warn('Error updating product:', error);
      res.status(500).json({ message: 'Error actualizando el producto' });
    }
  }

  static async partiallyUpdateProduct(req, res) {
    try {
      const productId = req.params.id;
      const updatedData = req.body;
      const updatedProduct = await ProductsService.partiallyUpdateProduct(productId, updatedData);
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.warn('Error partially updating product:', error);
      res.status(500).json({ message: 'Error partially updating product' });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      const deletedProduct = await ProductsService.deleteProduct(productId);
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.status(200).json({ message: 'Producto borrado con éxito' });
    } catch (error) {
      console.warn('Error deleting product:', error);
      res.status(500).json({ message: 'Error borrando el producto' });
    }
  }
}

export default ProductsController;