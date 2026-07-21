import ProductModel from '../models/product.model.js';

class ProductsRepository {
    static async find() {
        return await ProductModel.find();
    }

    static async findById(id) {
        return await ProductModel.findById(id);
    }

    static async create(productData) {
        const product = new ProductModel(productData);
        return await product.save();
    }

    static async findByIdAndUpdate(id, productData) {
        return await ProductModel.findByIdAndUpdate(id, productData, { new: true });
    }

    static async findByIdAndDelete(id) {
        return await ProductModel.findByIdAndDelete(id);
    }   
}

export default ProductsRepository;