import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  splitAmount: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate split amount before saving
expenseSchema.pre('save', function(next) {
  if (this.participants && this.participants.length > 0) {
    this.splitAmount = this.amount / this.participants.length;
  }
  next();
});

export default mongoose.model('Expense', expenseSchema);

