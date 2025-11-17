import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
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
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import FAQ from './pages/FAQ';
import './App.css';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdminAuthenticated } = useAdmin();
  return isAdminAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
};

const TopNav: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { isAdminAuthenticated } = useAdmin();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-logo">
          <span className="site-logo-mark">🐾</span>
          <span className="site-logo-text">Wooftrace</span>
        </Link>

        <nav className="site-nav-links">
          <Link to="/faq">FAQ</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          {isAdminAuthenticated && <Link to="/admin/factory">Admin</Link>}
        </nav>

        <div className="site-nav-cta">
          {isAuthenticated ? (
            <Link to="/dashboard" className="nav-btn">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="nav-link-muted">Log in</Link>
              <Link to="/register" className="nav-btn">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <div className="aurora-background"></div>
        <Router>
          <div className="app-shell">
            <TopNav />
            <main className="app-main">
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

                {/* Legal pages */}
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/faq" element={<FAQ />} />

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
            </main>

            <footer className="site-footer">
              <div className="site-footer-inner">
                <span className="site-footer-brand">© {new Date().getFullYear()} Wooftrace Ltd</span>
                <nav className="site-footer-links">
                  <a href="/privacy">Privacy Policy</a>
                  <a href="/terms">Terms of Service</a>
                  <a href="/faq">FAQ</a>
                </nav>
              </div>
            </footer>
          </div>
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
