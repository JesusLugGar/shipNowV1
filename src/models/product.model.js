import mongoose from 'mongoose';

import { STATUS_PRODUCTS } from '../utils/constants.js';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: Object.values(STATUS_PRODUCTS), default: STATUS_PRODUCTS.AVAILABLE },
});

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;