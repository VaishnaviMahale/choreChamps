import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import api from '../utils/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'];

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    day: 'Monday',
    mealType: 'dinner',
    dish: '',
    assignedTo: '',
    weekStartDate: getMonday(new Date()).toISOString().split('T')[0],
  });
  const [editingId, setEditingId] = useState(null);

  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  useEffect(() => {
    fetchMeals();
    fetchUsers();
  }, []);

  const fetchMeals = async () => {
    try {
      const weekStart = getMonday(new Date()).toISOString().split('T')[0];
      const response = await api.get(`/api/meals?weekStart=${weekStart}`);
      setMeals(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching meals:', error);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/auth/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleOpen = (meal = null) => {
    if (meal) {
      setFormData({
        day: meal.day,
        mealType: meal.mealType,
        dish: meal.dish,
        assignedTo: meal.assignedTo._id,
        weekStartDate: meal.weekStartDate.split('T')[0],
      });
      setEditingId(meal._id);
    } else {
      setFormData({
        day: 'Monday',
        mealType: 'dinner',
        dish: '',
        assignedTo: '',
        weekStartDate: getMonday(new Date()).toISOString().split('T')[0],
      });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      day: 'Monday',
      mealType: 'dinner',
      dish: '',
      assignedTo: '',
      weekStartDate: getMonday(new Date()).toISOString().split('T')[0],
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/meals/${editingId}`, formData);
      } else {
        await api.post('/api/meals', formData);
      }
      fetchMeals();
      handleClose();
    } catch (error) {
      console.error('Error saving meal:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await api.delete(`/api/meals/${id}`);
        fetchMeals();
      } catch (error) {
        console.error('Error deleting meal:', error);
      }
    }
  };

  const getMealsByDay = (day) => {
    return meals.filter(meal => meal.day === day);
  };

  const getMealByType = (dayMeals, mealType) => {
    return dayMeals.find(meal => meal.mealType === mealType);
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Weekly Meal Planner</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Meal
        </Button>
      </Box>

      <Grid container spacing={2}>
        {DAYS.map((day) => {
          const dayMeals = getMealsByDay(day);
          return (
            <Grid item xs={12} key={day}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {day}
                </Typography>
                <Grid container spacing={2}>
                  {MEAL_TYPES.map((mealType) => {
                    const meal = getMealByType(dayMeals, mealType);
                    return (
                      <Grid item xs={12} md={4} key={mealType}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Chip label={mealType} size="small" color="primary" />
                              {meal && (
                                <Box>
                                  <IconButton onClick={() => handleOpen(meal)} size="small">
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => handleDelete(meal._id)}
                                    size="small"
                                    color="error"
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              )}
                            </Box>
                            {meal ? (
                              <>
                                <Typography variant="body1" fontWeight="bold">
                                  {meal.dish}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  By: {meal.assignedTo?.name}
                                </Typography>
                              </>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No meal planned
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingId ? 'Edit Meal' : 'Add Meal'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              select
              label="Day"
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              margin="normal"
              required
            >
              {DAYS.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Meal Type"
              value={formData.mealType}
              onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
              margin="normal"
              required
            >
              {MEAL_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Dish"
              value={formData.dish}
              onChange={(e) => setFormData({ ...formData, dish: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              select
              label="Assigned To"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              margin="normal"
              required
            >
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingId ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Meals;

