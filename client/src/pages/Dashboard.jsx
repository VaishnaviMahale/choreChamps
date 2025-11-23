import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  CheckCircle,
  ShoppingCart,
  AttachMoney,
  Restaurant,
  CalendarToday,
} from '@mui/icons-material';
import api from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    tasks: 0,
    groceries: 0,
    expenses: 0,
    meals: 0,
    events: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [tasksRes, groceriesRes, expensesRes, mealsRes, eventsRes] = await Promise.all([
        api.get('/api/tasks'),
        api.get('/api/groceries'),
        api.get('/api/expenses'),
        api.get('/api/meals'),
        api.get('/api/calendar'),
      ]);

      setStats({
        tasks: tasksRes.data.filter(t => t.status !== 'completed').length,
        groceries: groceriesRes.data.filter(g => g.status === 'needed').length,
        expenses: expensesRes.data.length,
        meals: mealsRes.data.length,
        events: eventsRes.data.length,
      });

      setRecentTasks(tasksRes.data.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<CheckCircle sx={{ color: 'white' }} />}
            title="Pending Tasks"
            value={stats.tasks}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<ShoppingCart sx={{ color: 'white' }} />}
            title="Groceries Needed"
            value={stats.groceries}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<AttachMoney sx={{ color: 'white' }} />}
            title="Total Expenses"
            value={stats.expenses}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<Restaurant sx={{ color: 'white' }} />}
            title="Planned Meals"
            value={stats.meals}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<CalendarToday sx={{ color: 'white' }} />}
            title="Upcoming Events"
            value={stats.events}
            color="#d32f2f"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Tasks
        </Typography>
        {recentTasks.length === 0 ? (
          <Typography color="text.secondary">No tasks yet</Typography>
        ) : (
          <List>
            {recentTasks.map((task) => (
              <ListItem key={task._id}>
                <ListItemText
                  primary={task.title}
                  secondary={`Assigned to: ${task.assignedTo?.name || 'Unknown'} | Due: ${new Date(
                    task.dueDate
                  ).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;

