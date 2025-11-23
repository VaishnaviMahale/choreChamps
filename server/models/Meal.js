import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  day: {
    type: String,
    required: [true, 'Day is required'],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  mealType: {
    type: String,
    required: [true, 'Meal type is required'],
    enum: ['breakfast', 'lunch', 'dinner']
  },
  dish: {
    type: String,
    required: [true, 'Dish name is required'],
    trim: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weekStartDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Meal', mealSchema);

