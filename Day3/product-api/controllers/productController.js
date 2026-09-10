import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';

export const createProduct = async (req, res) => {
  const session = await mongoose.startSession();
  // Start the sesstion
  session.startTransaction();

  try {
    const { name, description, category, price, quantity } = req.body;

    // Product.create()
    const product = await Product.create(
      [{ name, description, category, price }],
      { session }
    );

    // Inventory.create()
    const inventory = await Inventory.create(
      [{ product: product[0]._id, quantity }],
      { session }
    );

    // Success -> Commit
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      product: product[0],
      inventory: inventory[0]
    });
  } catch (err) {
    // Failed -> Rollback
    await session.abortTransaction();
    res.status(400).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};