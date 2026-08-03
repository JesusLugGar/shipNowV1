import ProductRepository from '../repositories/product.repository.js';

import { ERROR_CODES } from '../error/error-codes.js';
import CustomError from '../error/custom.error.js';
import { STATUS_PRODUCTS } from '../utils/constants.js';

class ProductsService {
  static async getAllProducts() {
    return await ProductRepository.find();
  }

  static async getProductById(id) {
    const product = await ProductRepository.findById(id);

    if (!product) {
      throw new CustomError(ERROR_CODES.PRODUCT_NOT_FOUND);
    }

    return product;
  }

  static async createProduct(productData) {
    const { name, description, price, stock } = productData;

    if (!name || !description || price === undefined || stock === undefined) {
      throw new CustomError(
        ERROR_CODES.VALIDATION_ERROR,
        'Faltan campos obligatorios: name, description, price y stock son requeridos.',
      );
    }

    if (typeof price !== 'number' || price <= 0) {
      throw new CustomError(ERROR_CODES.VALIDATION_ERROR, 'El campo price debe ser un número mayor a 0.');
    }

    if (!Number.isInteger(price)) {
      throw new CustomError(ERROR_CODES.VALIDATION_ERROR, 'El precio debe ser expresado en pesos chilenos.');
    }

    if (typeof stock !== 'number' || stock <= 0) {
      throw new CustomError(ERROR_CODES.VALIDATION_ERROR, 'El campo stock debe ser un número mayor a 0.');
    }

    return await ProductRepository.create(productData);
  }

  static async prepareProductsForOrder(products) {
    if (!Array.isArray(products) || products.length === 0) {
      throw new CustomError(ERROR_CODES.VALIDATION_ERROR, 'La orden debe incluir al menos un producto.');
    }

    const requestedProducts = new Map();

    for (const item of products) {
      const { productId, quantity } = item;

      if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
        throw new CustomError(ERROR_CODES.VALIDATION_ERROR, 'Cada producto debe tener productId y quantity mayor a 0.');
      }

      const productKey = productId.toString();
      const currentQuantity = requestedProducts.get(productKey) || 0;
      requestedProducts.set(productKey, currentQuantity + quantity);
    }

    let productsCost = 0;
    const orderProducts = [];

    for (const [productId, quantity] of requestedProducts) {
      const product = await ProductRepository.findById(productId);

      if (!product) {
        throw new CustomError(ERROR_CODES.PRODUCT_NOT_FOUND, `El producto con ID ${productId} no existe.`);
      }

      if (product.stock < quantity) {
        throw new CustomError(ERROR_CODES.INSUFFICIENT_STOCK, `No hay suficiente stock para el producto ${product.name}.`);
      }

      productsCost += product.price * quantity;

      orderProducts.push({
        productId: product._id,
        quantity,
        price: product.price,
      });
    }

    return { orderProducts, productsCost };
  }

  static async decreaseStockForOrder(orderProducts) {
    for (const item of orderProducts) {
      const product = await ProductRepository.findById(item.productId);
      const newStock = product.stock - item.quantity;

      await ProductRepository.findByIdAndUpdate(item.productId, {
        stock: newStock,
        status: newStock === 0 ? STATUS_PRODUCTS.OUT_OF_STOCK : STATUS_PRODUCTS.AVAILABLE,
      });
    }
  }

  static async partiallyUpdateProduct(id, productData) {
    const product = await ProductRepository.findByIdAndUpdate(id, productData);

    if (!product) {
      throw new CustomError(ERROR_CODES.PRODUCT_NOT_FOUND);
    }

    return product;
  }

  static async updateProduct(id, productData) {
    const product = await ProductRepository.findByIdAndUpdate(id, productData);

    if (!product) {
      throw new CustomError(ERROR_CODES.PRODUCT_NOT_FOUND);
    }

    return product;
  }

  static async deleteProduct(id) {
    const product = await ProductRepository.findByIdAndDelete(id);

    if (!product) {
      throw new CustomError(ERROR_CODES.PRODUCT_NOT_FOUND);
    }

    return product;
  }
}

export default ProductsService;