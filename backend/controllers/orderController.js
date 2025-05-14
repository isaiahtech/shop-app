// ~/shop-project/backend/controllers/orderController.js
import Order from '../models/Order.js';
import Product from '../models/Product.js'; // To potentially update stock later

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (requires user to be logged in)
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // --- BEGIN DEBUG LOGGING ---
  console.log('--- Received request to create order ---');
  console.log('req.user._id:', req.user ? req.user._id : 'No user in req'); // Check if user is present
  console.log('Received orderItems from req.body:', JSON.stringify(orderItems, null, 2));
  // --- END DEBUG LOGGING ---

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    // Using return res.status().json() for consistency
    return res.status(400).json({ message: 'No order items provided' });
  } else {
    try {
      // Prepare order items for saving, ensuring product ID is correctly mapped
      const itemsToSave = orderItems.map(item => {
        // The 'item' here is what the frontend sent in the orderItems array.
        // The frontend should be sending 'product' as the ID.
        if (!item.product) {
          console.error('ERROR: Item in orderItems is missing product ID:', JSON.stringify(item, null, 2));
        }
        return {
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product, // This 'product' field from frontend item should be the Product's ObjectId
          // Mongoose will automatically generate an _id for this subdocument
        };
      });

      // --- BEGIN DEBUG LOGGING ---
      console.log('Processed itemsToSave for Order model:', JSON.stringify(itemsToSave, null, 2));
      // --- END DEBUG LOGGING ---

      const order = new Order({
        orderItems: itemsToSave,
        user: req.user._id, // From 'protect' auth middleware
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();
      console.log('Order successfully created with ID:', createdOrder._id);

      res.status(201).json(createdOrder);
    } catch (error) {
      console.error('Error creating order in database:', error); // Log the full Mongoose error
      res.status(500).json({ message: `Server Error: ${error.message}` });
    }
  }
};

// Add more functions later: getOrderById, updateOrderToPaid, updateOrderToDelivered, getMyOrders

export { addOrderItems };

