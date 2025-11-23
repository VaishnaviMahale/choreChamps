import mongoose from 'mongoose';

const grocerySchema = new mongoose.Schema({
  item: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  quantity: {
    type: String,
    required: [true, 'Quantity is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['needed', 'purchased'],
    default: 'needed'
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Grocery', grocerySchema);

