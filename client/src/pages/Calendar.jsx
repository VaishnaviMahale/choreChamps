import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import api from '../utils/api';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    date: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/api/calendar');
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleOpen = (event = null) => {
    if (event) {
      setFormData({
        eventName: event.eventName,
        description: event.description || '',
        date: event.date.split('T')[0],
      });
      setEditingId(event._id);
    } else {
      setFormData({
        eventName: '',
        description: '',
        date: '',
      });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      eventName: '',
      description: '',
      date: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/calendar/${editingId}`, formData);
      } else {
        await api.post('/api/calendar', formData);
      }
      fetchEvents();
      handleClose();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/api/calendar/${id}`);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const getEventsByMonth = () => {
    const eventsByMonth = {};
    events.forEach(event => {
      const date = new Date(event.date);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!eventsByMonth[monthYear]) {
        eventsByMonth[monthYear] = [];
      }
      eventsByMonth[monthYear].push(event);
    });
    return eventsByMonth;
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) >= new Date();
  };

  if (loading) {
    return <LinearProgress />;
  }

  const eventsByMonth = getEventsByMonth();

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Calendar</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Event
        </Button>
      </Box>

      {Object.keys(eventsByMonth).length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No events scheduled</Typography>
        </Paper>
      ) : (
        Object.entries(eventsByMonth).map(([monthYear, monthEvents]) => (
          <Paper key={monthYear} sx={{ mb: 3, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {monthYear}
            </Typography>
            <List>
              {monthEvents.map((event) => (
                <ListItem
                  key={event._id}
                  secondaryAction={
                    <Box>
                      <IconButton onClick={() => handleOpen(event)} size="small">
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(event._id)}
                        size="small"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  }
                  sx={{
                    borderLeft: isUpcoming(event.date) ? '4px solid #1976d2' : '4px solid #ccc',
                    mb: 1,
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  }}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1">{event.eventName}</Typography>
                        {isUpcoming(event.date) && (
                          <Chip label="Upcoming" size="small" color="primary" />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(event.date).toLocaleDateString('default', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Typography>
                        {event.description && (
                          <Typography variant="body2" color="text.secondary">
                            {event.description}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          Created by: {event.createdBy?.name}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        ))
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingId ? 'Edit Event' : 'Add Event'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Event Name"
              value={formData.eventName}
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
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

export default Calendar;

