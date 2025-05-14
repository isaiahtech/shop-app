// ~/shop-project/backend/models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { // The user who placed the order
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model
    },
    orderItems: [ // Array of items in the order
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: { // Reference to the actual Product
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    // For simplicity, we'll skip a full shippingAddress object for now
    // but you would typically include: address, city, postalCode, country
    shippingAddress: {
      address: { type: String, default: 'N/A' }, // Simplified
      city: { type: String, default: 'N/A' },
    },
    paymentMethod: { // e.g., 'PayPal', 'Stripe' - we'll fake this
      type: String,
      required: true,
      default: 'SimulatedPayment',
    },
    paymentResult: { // For storing result from payment gateway
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: { // Price of items before tax and shipping
        type: Number,
        required: true,
        default: 0.0,
    },
    taxPrice: { // Tax amount
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: { // Shipping cost
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: { // Grand total
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false, // Default to not paid
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false, // Default to not delivered
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;

