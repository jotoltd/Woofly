import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PetProfile from './pages/PetProfile';
import PublicPetProfile from './pages/PublicPetProfile';
import ActivateTag from './pages/ActivateTag';
import './App.css';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <div className="aurora-background"></div>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/activate"
            element={
              <PrivateRoute>
                <ActivateTag />
              </PrivateRoute>
            }
          />
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
