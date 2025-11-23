import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeContextProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Groceries from './pages/Groceries';
import Expenses from './pages/Expenses';
import Meals from './pages/Meals';
import Calendar from './pages/Calendar';

function App() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="groceries" element={<Groceries />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="meals" element={<Meals />} />
              <Route path="calendar" element={<Calendar />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;

