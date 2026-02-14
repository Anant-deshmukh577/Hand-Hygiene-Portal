import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AuditorLogin from './pages/AuditorLogin';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ObservationEntry from './pages/ObservationEntry';
import ObservationHistory from './pages/ObservationHistory';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Rewards from './pages/Rewards';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ForgotPassword from './components/auth/ForgotPassword';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageWards from './pages/admin/ManageWards';
import ManageRewards from './pages/admin/ManageRewards';
import ViewReports from './pages/admin/ViewReports';

// Auditor Pages
import AuditorDashboard from './pages/auditor/AuditorDashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'admin-login',
        element: <AdminLogin />,
      },
      {
        path: 'auditor-login',
        element: <AuditorLogin />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'observation-entry',
        element: (
          <ProtectedRoute roles={['auditor', 'admin']}>
            <ObservationEntry />
          </ProtectedRoute>
        ),
      },
      {
        path: 'observation-history',
        element: (
          <ProtectedRoute>
            <ObservationHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: 'leaderboard',
        element: (
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'rewards',
        element: (
          <ProtectedRoute>
            <Rewards />
          </ProtectedRoute>
        ),
      },
      {
        path: 'reports',
        element: (
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      // Admin Routes
      {
        path: 'admin/dashboard',
        element: (
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      // Auditor Routes
      {
        path: 'auditor/dashboard',
        element: (
          <ProtectedRoute roles={['auditor']}>
            <AuditorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <ProtectedRoute roles={['admin']}>
            <ManageUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/wards',
        element: (
          <ProtectedRoute roles={['admin']}>
            <ManageWards />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/rewards',
        element: (
          <ProtectedRoute roles={['admin']}>
            <ManageRewards />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/reports',
        element: (
          <ProtectedRoute roles={['admin']}>
            <ViewReports />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
