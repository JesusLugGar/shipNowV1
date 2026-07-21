import ProductRepository from '../repositories/product.repository.js';

class ProductsService {
  static async getAllProducts() {
    return await ProductRepository.find();
  }

  static async getProductById(id) {
    return await ProductRepository.findById(id);
  }

  static async createProduct(productData) {
    return await ProductRepository.create(productData);
  }

  static async updateProduct(id, productData) {
    return await ProductRepository.findByIdAndUpdate(id, productData);
  }

  static async deleteProduct(id) {
    return await ProductRepository.findByIdAndDelete(id);
  }
}

export default ProductsService;