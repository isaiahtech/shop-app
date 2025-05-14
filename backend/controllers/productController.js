// ~/shop-project/backend/controllers/productController.js
import Product from '../models/Product.js';
import User from '../models/User.js';

// --- Sample Product Data (for seeding) ---
const sampleProducts = [
  {
    name: 'Airpods Wireless Bluetooth Headphones',
    image: '/images/airpods.jpg',
    description:
      'Bluetooth technology lets you connect it with compatible devices wirelessly. High-quality AAC audio offers immersive listening experience. Built-in microphone allows you to take calls while working.',
    brand: 'Apple',
    category: 'Electronics',
    price: 89.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'iPhone 15 Pro 256GB - Titanium Blue',
    image: '/images/phone.jpg', // You might want a new image for this
    description:
      'The latest iPhone with the A17 Bionic chip. A transformative triple-camera system that adds tons of capability without complexity. An unprecedented leap in battery life.',
    brand: 'Apple',
    category: 'Electronics',
    price: 999.99,
    countInStock: 15,
    rating: 4.8,
    numReviews: 25,
  },
  {
    name: 'Canon EOS R6 Mark II Mirrorless Camera',
    image: '/images/camera.jpg', // You might want a new image for this
    description:
      'A versatile full-frame mirrorless camera, blending high-performance stills and video capabilities. Ideal for enthusiasts and professionals alike.',
    brand: 'Canon',
    category: 'Electronics',
    price: 2499.00,
    countInStock: 5,
    rating: 4.9,
    numReviews: 18,
  },
  {
    name: 'Logitech MX Master 3S Wireless Mouse',
    image: '/images/mouse_logitech.jpg', // NEW IMAGE PATH
    description:
      'Advanced wireless mouse with ultra-quiet clicks, 8K DPI any-surface tracking, and MagSpeed electromagnetic scrolling. Ergonomic design for comfort.',
    brand: 'Logitech',
    category: 'Accessories',
    price: 99.99,
    countInStock: 25,
    rating: 4.7,
    numReviews: 30,
  },
  {
    name: 'Samsung Odyssey G9 49" QLED Gaming Monitor',
    image: '/images/monitor_samsung_g9.jpg', // NEW IMAGE PATH
    description:
      'Immersive 1000R curved screen with QLED technology, 240Hz refresh rate, and 1ms response time for an unparalleled gaming experience.',
    brand: 'Samsung',
    category: 'Monitors',
    price: 1399.99,
    countInStock: 8,
    rating: 4.6,
    numReviews: 22,
  },
  {
    name: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    image: '/images/headphones_sony.jpg', // NEW IMAGE PATH
    description:
      'Industry-leading noise cancellation, exceptional sound quality, and an ultra-comfortable design. Perfect for travel, work, or immersive listening.',
    brand: 'Sony',
    category: 'Audio',
    price: 348.00,
    countInStock: 12,
    rating: 4.8,
    numReviews: 45,
  },
  {
    name: 'Raspberry Pi 5 - 8GB RAM',
    image: '/images/raspberry_pi_5.jpg', // NEW IMAGE PATH
    description:
      'The latest generation Raspberry Pi, offering a significant increase in processor speed, multimedia performance, memory, and connectivity.',
    brand: 'Raspberry Pi',
    category: 'Development Boards',
    price: 79.99,
    countInStock: 30,
    rating: 4.9,
    numReviews: 15,
  },
];

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(`Error fetching products: ${error.message}`);
    res.status(500).json({ message: 'Server Error while fetching products' });
  }
};

// @desc    Seed sample products (development only)
// @route   POST /api/products/seed
// @access  Private/Admin (should be protected later)
const seedProducts = async (req, res) => {
    try {
        await Product.deleteMany();
        console.log('Products Cleared');
        const adminUser = await User.findOne();
        if (!adminUser) {
            console.warn('No user found to associate with seeded products. Seeding products without user association.');
        }
        const productsToSeed = sampleProducts.map(product => {
            return adminUser ? { ...product, user: adminUser._id } : { ...product };
        });
        const createdProducts = await Product.insertMany(productsToSeed);
        console.log('Products Seeded:', createdProducts.length);
        res.status(201).json(createdProducts);
    } catch (error) {
        console.error(`Error seeding products: ${error.message}`);
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(`Error fetching product by ID (${req.params.id}): ${error.message}`);
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Product not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Server Error while fetching product' });
    }
};

export { addOrderItems } from './orderController.js'; // This line seems incorrect, addOrderItems is from orderController.
                                                      // It should be exporting product controller functions.
// Corrected exports for productController.js:
export {
  getProducts,
  seedProducts,
  getProductById,
};

