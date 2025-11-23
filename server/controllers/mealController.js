import Meal from '../models/Meal.js';

// @desc    Get all meals
// @route   GET /api/meals
// @access  Private
export const getMeals = async (req, res) => {
  try {
    const { weekStart } = req.query;
    const query = weekStart ? { weekStartDate: new Date(weekStart) } : {};
    
    const meals = await Meal.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ weekStartDate: -1, day: 1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single meal
// @route   GET /api/meals/:id
// @access  Private
export const getMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    
    res.json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create meal
// @route   POST /api/meals
// @access  Private
export const createMeal = async (req, res) => {
  try {
    const { day, mealType, dish, assignedTo, weekStartDate } = req.body;

    const meal = await Meal.create({
      day,
      mealType,
      dish,
      assignedTo,
      weekStartDate,
      createdBy: req.user._id
    });

    const populatedMeal = await Meal.findById(meal._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json(populatedMeal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update meal
// @route   PUT /api/meals/:id
// @access  Private
export const updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    const updatedMeal = await Meal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json(updatedMeal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete meal
// @route   DELETE /api/meals/:id
// @access  Private
export const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    await Meal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Meal removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

