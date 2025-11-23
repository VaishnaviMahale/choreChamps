import express from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/calendarController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getEvents)
  .post(protect, createEvent);

router.route('/:id')
  .get(protect, getEvent)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

export default router;

