import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Auth.css';

const ResendVerification: React.FC<{ email: string }> = ({ email }) => {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  const handleResend = async () => {
    setSending(true);
    setMessage('');
    try {
      const response = await api.post('/auth/resend-verification', { email });
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to resend email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="resend-verification" style={{ marginTop: '15px', padding: '15px', background: 'rgba(0, 180, 216, 0.1)', borderRadius: '8px' }}>
      <p style={{ marginBottom: '10px', color: '#00b4d8' }}>Didn't receive the verification email?</p>
      <button
        type="button"
        onClick={handleResend}
        disabled={sending}
        className="btn btn-secondary"
        style={{ width: '100%' }}
      >
        {sending ? 'Sending...' : 'Resend Verification Email'}
      </button>
      {message && <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#00d4aa' }}>{message}</p>}
    </div>
  );
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);

      // If user came from /activate with a pending code, activate it now
      const pendingCode = localStorage.getItem('pendingActivationCode');
      if (pendingCode) {
        try {
          await api.post('/tags/activate', { activationCode: pendingCode });
        } catch (err: any) {
          // Surface activation error but still log user in
          setError(err.response?.data?.error || 'Tag activation failed after login');
        } finally {
          localStorage.removeItem('pendingActivationCode');
        }
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
      // Check if error is due to unverified email
      if (err.response?.status === 403 && err.response?.data?.emailVerified === false) {
        setIsEmailVerified(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <h1 className="gradient-text">WoofTrace</h1>
          <p className="auth-subtitle">Sign in to activate your tag and manage your pets</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <div style={{ textAlign: 'right', marginTop: '8px' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: 'var(--aurora-teal)' }}>
                Forgot password?
              </Link>
            </div>
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {!isEmailVerified && email && <ResendVerification email={email} />}
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Create free account</Link>
          </p>
          <p className="auth-note">
            <Link to="/">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
