import Expense from '../models/Expense.js';

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('paidBy', 'name email')
      .populate('participants', 'name email')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
export const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('paidBy', 'name email')
      .populate('participants', 'name email');
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req, res) => {
  try {
    const { amount, description, paidBy, participants, date } = req.body;

    const expense = await Expense.create({
      amount,
      description,
      paidBy,
      participants,
      date
    });

    const populatedExpense = await Expense.findById(expense._id)
      .populate('paidBy', 'name email')
      .populate('participants', 'name email');

    res.status(201).json(populatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('paidBy', 'name email')
      .populate('participants', 'name email');

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get expense summary
// @route   GET /api/expenses/summary
// @access  Private
export const getExpenseSummary = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('paidBy', 'name')
      .populate('participants', 'name');

    // Calculate who owes whom
    const balances = {};
    
    expenses.forEach(expense => {
      const paidById = expense.paidBy._id.toString();
      const paidByName = expense.paidBy.name;
      
      if (!balances[paidById]) {
        balances[paidById] = { name: paidByName, balance: 0 };
      }
      
      // Person who paid gets credit
      balances[paidById].balance += expense.amount;
      
      // Each participant owes their share
      expense.participants.forEach(participant => {
        const participantId = participant._id.toString();
        const participantName = participant.name;
        
        if (!balances[participantId]) {
          balances[participantId] = { name: participantName, balance: 0 };
        }
        
        balances[participantId].balance -= expense.splitAmount;
      });
    });

    res.json(balances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

