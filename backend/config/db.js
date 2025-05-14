// ~/shop-project/backend/config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file located in the parent (backend) directory
dotenv.config({ path: '../.env' });

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
        console.error('Error: MONGO_URI is not defined in .env file');
        process.exit(1);
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

