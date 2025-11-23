import express from 'express';
import {
  getGroceries,
  getGrocery,
  createGrocery,
  updateGrocery,
  deleteGrocery
} from '../controllers/groceryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getGroceries)
  .post(protect, createGrocery);

router.route('/:id')
  .get(protect, getGrocery)
  .put(protect, updateGrocery)
  .delete(protect, deleteGrocery);

export default router;

