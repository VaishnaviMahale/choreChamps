import Grocery from '../models/Grocery.js';

// @desc    Get all groceries
// @route   GET /api/groceries
// @access  Private
export const getGroceries = async (req, res) => {
  try {
    const groceries = await Grocery.find()
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(groceries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single grocery
// @route   GET /api/groceries/:id
// @access  Private
export const getGrocery = async (req, res) => {
  try {
    const grocery = await Grocery.findById(req.params.id)
      .populate('addedBy', 'name email');
    
    if (!grocery) {
      return res.status(404).json({ message: 'Grocery item not found' });
    }
    
    res.json(grocery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create grocery item
// @route   POST /api/groceries
// @access  Private
export const createGrocery = async (req, res) => {
  try {
    const { item, quantity, status } = req.body;

    const grocery = await Grocery.create({
      item,
      quantity,
      status,
      addedBy: req.user._id
    });

    const populatedGrocery = await Grocery.findById(grocery._id)
      .populate('addedBy', 'name email');

    res.status(201).json(populatedGrocery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update grocery item
// @route   PUT /api/groceries/:id
// @access  Private
export const updateGrocery = async (req, res) => {
  try {
    const grocery = await Grocery.findById(req.params.id);

    if (!grocery) {
      return res.status(404).json({ message: 'Grocery item not found' });
    }

    const updatedGrocery = await Grocery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('addedBy', 'name email');

    res.json(updatedGrocery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete grocery item
// @route   DELETE /api/groceries/:id
// @access  Private
export const deleteGrocery = async (req, res) => {
  try {
    const grocery = await Grocery.findById(req.params.id);

    if (!grocery) {
      return res.status(404).json({ message: 'Grocery item not found' });
    }

    await Grocery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Grocery item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

