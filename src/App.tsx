import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Redirect from './components/Redirect';
import Dashboard from './components/Dashboard';
import UserLinks from './components/Links';
import AnalyticsChart from './components/AnalyticsChart';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseConfig';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;

  return user ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/links" element={<UserLinks />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/analytics" element={<AnalyticsChart />} />
      <Route path="/:id" element={<Redirect />} />
    </Routes>
  );
};

export default App;
