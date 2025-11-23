import express from 'express';
import {
  getMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal
} from '../controllers/mealController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getMeals)
  .post(protect, createMeal);

router.route('/:id')
  .get(protect, getMeal)
  .put(protect, updateMeal)
  .delete(protect, deleteMeal);

export default router;

