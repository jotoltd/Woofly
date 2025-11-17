import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './Auth.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccess(true);
      setEmail('');
      alert(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <h1 className="gradient-text">Reset Password</h1>
          <p className="auth-subtitle">
            {success 
              ? 'Check your email for the reset link'
              : 'Enter your email to receive a password reset link'
            }
          </p>
        </div>

        {success ? (
          <div className="success-message" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📧</div>
            <p style={{ marginBottom: '20px' }}>
              If an account exists with that email, we've sent a password reset link.
            </p>
            <p style={{ marginBottom: '20px', color: 'var(--cloud-gray)' }}>
              The link will expire in 1 hour.
            </p>
            <Link to="/login" className="btn">
              Back to Login
            </Link>
          </div>
        ) : (
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

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>
            Remember your password? <Link to="/login">Sign in</Link>
          </p>
          <p className="auth-note">
            <Link to="/">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
