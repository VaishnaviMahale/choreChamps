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
  Chip,
  Box,
  LinearProgress,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import api from '../utils/api';

const Groceries = () => {
  const [groceries, setGroceries] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    item: '',
    quantity: '',
    status: 'needed',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchGroceries();
  }, []);

  const fetchGroceries = async () => {
    try {
      const response = await api.get('/api/groceries');
      setGroceries(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching groceries:', error);
      setLoading(false);
    }
  };

  const handleOpen = (grocery = null) => {
    if (grocery) {
      setFormData({
        item: grocery.item,
        quantity: grocery.quantity,
        status: grocery.status,
      });
      setEditingId(grocery._id);
    } else {
      setFormData({
        item: '',
        quantity: '',
        status: 'needed',
      });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      item: '',
      quantity: '',
      status: 'needed',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/groceries/${editingId}`, formData);
      } else {
        await api.post('/api/groceries', formData);
      }
      fetchGroceries();
      handleClose();
    } catch (error) {
      console.error('Error saving grocery:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/api/groceries/${id}`);
        fetchGroceries();
      } catch (error) {
        console.error('Error deleting grocery:', error);
      }
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Groceries</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Item
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Added By</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groceries.map((grocery) => (
              <TableRow key={grocery._id}>
                <TableCell>{grocery.item}</TableCell>
                <TableCell>{grocery.quantity}</TableCell>
                <TableCell>
                  <Chip
                    label={grocery.status}
                    color={grocery.status === 'purchased' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{grocery.addedBy?.name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(grocery)} size="small">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(grocery._id)} size="small" color="error">
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
          <DialogTitle>{editingId ? 'Edit Grocery Item' : 'Add Grocery Item'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Item"
              value={formData.item}
              onChange={(e) => setFormData({ ...formData, item: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              margin="normal"
            >
              <MenuItem value="needed">Needed</MenuItem>
              <MenuItem value="purchased">Purchased</MenuItem>
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

export default Groceries;

