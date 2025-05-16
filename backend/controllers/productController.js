// ~/shop-project/backend/controllers/productController.js
import Product from '../models/Product.js';
import User from '../models/User.js';

const sampleProducts = [ // Removed requiresAuth from all sample products
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
    image: '/images/phone.jpg',
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
    image: '/images/camera.jpg',
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
    image: '/images/mouse_logitech.jpg',
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
    name: 'Samsung Odyssey G9 49" QLED Monitor',
    image: '/images/monitor_samsung_g9.jpg',
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
    image: '/images/headphones_sony.jpg',
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
    image: '/images/raspberry_pi_5.jpg',
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

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public (Simplified: no auth check here)
const getProductById = async (req, res) => {
    console.log(`--- getProductById Controller: Triggered for product ID: ${req.params.id} ---`);
    // No longer checking req.user or product.requiresAuth here.
    // The route itself will determine if auth is needed (it won't be for this version).
    try {
        const product = await Product.findById(req.params.id);
        console.log('getProductById: Product fetched from DB:', product ? JSON.stringify({_id: product._id, name: product.name }, null, 2) : 'null (Product not found in DB)');

        if (product) {
            console.log('getProductById: Product is public. Serving product.');
            res.json(product);
        } else {
            console.log('getProductById: Product not found in DB with this ID. Sending 404.');
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(`getProductById: Error fetching product by ID (${req.params.id}): ${error.message}`);
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Product not found (invalid ID format)' });
        }
        res.status(500).json({ message: `Server Error while fetching product: ${error.message}` });
    }
};

// @desc    Seed sample products
// @route   POST /api/products/seed
// @access  Private/Admin
const seedProducts = async (req, res) => {
    try {
        await Product.deleteMany();
        console.log('Products Cleared');
        const userCreatingProducts = req.user ? req.user._id : null;
        if (!userCreatingProducts) {
            console.warn('Admin user ID not found from token for seeding. Products will be seeded without a user reference or ensure an admin user is logged in.');
        }
        const productsToSeed = sampleProducts.map(product => ({
            ...product,
            user: userCreatingProducts, // Assign the admin user's ID
        }));
        const createdProducts = await Product.insertMany(productsToSeed);
        console.log('Products Seeded:', createdProducts.length);
        res.status(201).json(createdProducts);
    } catch (error) {
        console.error(`Error seeding products: ${error.message}`);
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// --- ADMIN ONLY ---

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const product = new Product({
      name: 'Sample Name', price: 0, user: req.user._id, image: '/images/sample.jpg',
      brand: 'Sample Brand', category: 'Sample Category', countInStock: 0,
      numReviews: 0, description: 'Sample description',
      // requiresAuth: false, // Field removed from model
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(`Error creating product: ${error.message}`);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body; // Removed requiresAuth
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.price = price === undefined ? product.price : price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.countInStock = countInStock === undefined ? product.countInStock : countInStock;
      // product.requiresAuth = requiresAuth === undefined ? product.requiresAuth : requiresAuth; // Field removed
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(`Error updating product: ${error.message}`);
    if (error.kind === 'ObjectId') { return res.status(404).json({ message: 'Product not found (invalid ID format)' }); }
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(`Error deleting product: ${error.message}`);
    if (error.kind === 'ObjectId') { return res.status(404).json({ message: 'Product not found (invalid ID format)' }); }
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export {
  getProducts,
  getProductById,
  seedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};

