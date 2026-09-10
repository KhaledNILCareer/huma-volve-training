import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  product:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', 
    required: true,
    unique: true
  },
  quantity: { 
    type: Number, 
    min: [0, 'Quantity cannot be negative'],
    required: true, 
    default: 0    
  }
});

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;