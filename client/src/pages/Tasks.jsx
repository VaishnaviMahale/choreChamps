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

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    status: 'pending',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/api/tasks');
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
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

  const handleOpen = (task = null) => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        assignedTo: task.assignedTo._id,
        dueDate: task.dueDate.split('T')[0],
        status: task.status,
      });
      setEditingId(task._id);
    } else {
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        status: 'pending',
      });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
      status: 'pending',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/tasks/${editingId}`, formData);
      } else {
        await api.post('/api/tasks', formData);
      }
      fetchTasks();
      handleClose();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/api/tasks/${id}`);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Tasks</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Task
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task._id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.assignedTo?.name}</TableCell>
                <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip label={task.status} color={getStatusColor(task.status)} size="small" />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(task)} size="small">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(task._id)} size="small" color="error">
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
          <DialogTitle>{editingId ? 'Edit Task' : 'Add Task'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
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
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
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
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
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

export default Tasks;

