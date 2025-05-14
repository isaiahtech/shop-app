    // models/Product.js (Mongoose schema for Products)

    import mongoose from 'mongoose';

    // Define the schema for the Product collection
    const productSchema = new mongoose.Schema(
      {
        user: { // To track which admin user added the product (optional for now)
          type: mongoose.Schema.Types.ObjectId,
          // required: true, // You might make this required later
          ref: 'User', // Reference to the User model
        },
        name: {
          type: String,
          required: [true, 'Please add a product name'],
          trim: true, // Remove whitespace from ends
        },
        image: {
          type: String,
          required: [true, 'Please add an image URL'],
          default: '/images/sample.jpg', // A default placeholder image path
        },
        brand: {
          type: String,
          // required: true,
        },
        category: {
          type: String,
          required: [true, 'Please add a category'],
        },
        description: {
          type: String,
          required: [true, 'Please add a description'],
        },
        rating: { // Average rating
          type: Number,
          required: true,
          default: 0,
        },
        numReviews: { // Number of reviews
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
        // You can add more fields like reviews array, etc. later
      },
      {
        timestamps: true, // Automatically add createdAt and updatedAt fields
      }
    );

    // Create and export the Product model based on the schema
    const Product = mongoose.model('Product', productSchema);

    export default Product;
    
