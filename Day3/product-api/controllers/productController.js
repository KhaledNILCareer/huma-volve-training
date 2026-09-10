import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import { generateProductInfo } from '../services/geminiService.js';

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

export const getProducts = async (req, res) => {
  try {

    const products = await Product.find();
    res.status(200).json(products);

  } catch (err) {

    res.status(500).json({ success: false, message: err.message });

  }
};

export const getProductById = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {

      res.status(404).json({ success: false, message: 'Product not found' });

    } else { res.status(200).json(product); }

  } catch (err) {
    
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }

    res.status(500).json({ success: false, message: err.message });

  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    res.status(200).json(updatedProduct);
    

  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteProduct = async (req, res) => {

  const session = await mongoose.startSession();
  // Start the sesstion
  session.startTransaction();

  try {

    const deletedProduct = await Product.findById(req.params.id).session(session);

    if (!deletedProduct) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Inventory.deleteMany()
    
    await Inventory.deleteOne(
      { product: deletedProduct._id },
      {session}
    );
    // Product.deleteOne()
    
    await Product.deleteOne(
      { _id: deletedProduct._id },
      {session}
    );
    
    
    // Success -> Commit

    await session.commitTransaction();

    res.status(200).json({ success: true, message: 'Product deleted' });
    
  } catch (err) {
    // Failed -> Rollback
    await session.abortTransaction();

    if (err.name === 'CastError') {

      return res.status(400).json({ 
        success: false, 
        message: 'Invalid Product ID format'
       });

    }

    res.status(400).json({ success: false, message: err.message });

  } finally { session.endSession(); }

};

export const generateProductAI = async (req, res) => {
  try {
    const { name, shortDescription } = req.body;

    if (!name || !shortDescription) {
      return res.status(400).json({
        success: false,
        message: 'Name and shortDescription are required'
      });
    }

    const result = await generateProductInfo(name, shortDescription);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};