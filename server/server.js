import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import groceryRoutes from './routes/groceryRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import mealRoutes from './routes/mealRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Bachelor\'s Flat Life Manager API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/groceries', groceryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/calendar', calendarRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

