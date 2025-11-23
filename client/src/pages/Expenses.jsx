import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import api from '../utils/api';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    paidBy: '',
    participants: [],
    date: new Date().toISOString().split('T')[0],
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchExpenses();
    fetchUsers();
    fetchSummary();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/api/expenses');
      setExpenses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
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

  const fetchSummary = async () => {
    try {
      const response = await api.get('/api/expenses/summary');
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleOpen = (expense = null) => {
    if (expense) {
      setFormData({
        amount: expense.amount,
        description: expense.description,
        paidBy: expense.paidBy._id,
        participants: expense.participants.map(p => p._id),
        date: expense.date.split('T')[0],
      });
      setEditingId(expense._id);
    } else {
      setFormData({
        amount: '',
        description: '',
        paidBy: '',
        participants: [],
        date: new Date().toISOString().split('T')[0],
      });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      amount: '',
      description: '',
      paidBy: '',
      participants: [],
      date: new Date().toISOString().split('T')[0],
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/expenses/${editingId}`, formData);
      } else {
        await api.post('/api/expenses', formData);
      }
      fetchExpenses();
      fetchSummary();
      handleClose();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/api/expenses/${id}`);
        fetchExpenses();
        fetchSummary();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Expenses</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Expense
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Balance Summary
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(summary).map(([userId, data]) => (
                <Grid item xs={12} sm={6} md={4} key={userId}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1">{data.name}</Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        <Typography variant="h6" sx={{ mr: 1 }}>
                          ${Math.abs(data.balance).toFixed(2)}
                        </Typography>
                        <Chip
                          label={data.balance >= 0 ? 'To Receive' : 'To Pay'}
                          color={data.balance >= 0 ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Paid By</TableCell>
              <TableCell>Split Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense._id}>
                <TableCell>{expense.description}</TableCell>
                <TableCell>${expense.amount.toFixed(2)}</TableCell>
                <TableCell>{expense.paidBy?.name}</TableCell>
                <TableCell>${expense.splitAmount?.toFixed(2)}</TableCell>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(expense)} size="small">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(expense._id)} size="small" color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingId ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              margin="normal"
              required
              inputProps={{ step: '0.01', min: '0' }}
            />
            <TextField
              fullWidth
              select
              label="Paid By"
              value={formData.paidBy}
              onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
              margin="normal"
              required
            >
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </TextField>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Participants</InputLabel>
              <Select
                multiple
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                input={<OutlinedInput label="Participants" />}
                renderValue={(selected) =>
                  selected.map(id => users.find(u => u._id === id)?.name).join(', ')
                }
              >
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
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

export default Expenses;

