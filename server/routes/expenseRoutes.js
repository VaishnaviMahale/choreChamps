import express from 'express';
import {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary
} from '../controllers/expenseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/summary', protect, getExpenseSummary);

router.route('/')
  .get(protect, getExpenses)
  .post(protect, createExpense);

router.route('/:id')
  .get(protect, getExpense)
  .put(protect, updateExpense)
  .delete(protect, deleteExpense);

export default router;

