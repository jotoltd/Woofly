import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import PetProfile from './pages/PetProfile';
import PublicPetProfile from './pages/PublicPetProfile';
import ActivateTag from './pages/ActivateTag';
import AdminLogin from './pages/AdminLogin';
import FactoryPanel from './pages/FactoryPanel';
import './App.css';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdminAuthenticated } = useAdmin();
  return isAdminAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <div className="aurora-background"></div>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/activate" element={<ActivateTag />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/pet/qr/:qrCode" element={<PublicPetProfile />} />
            <Route path="/pet/nfc/:nfcId" element={<PublicPetProfile />} />
            <Route
              path="/pet/:id"
              element={
                <PrivateRoute>
                  <PetProfile />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/factory"
              element={
                <AdminRoute>
                  <FactoryPanel />
                </AdminRoute>
              }
            />
          </Routes>
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
