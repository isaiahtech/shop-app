// ~/shop-project/backend/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model, e.g., who created it
    },
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Please add an image URL'],
      default: '/images/sample.jpg',
    },
    brand: {
      type: String,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      default: 0,
    },
    countInStock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      default: 0,
    },
    // requiresAuth field has been removed
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;

