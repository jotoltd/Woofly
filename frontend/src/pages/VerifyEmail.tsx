import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import './VerifyEmail.css';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    // Call verify endpoint
    api.get(`/auth/verify-email?token=${token}`)
      .then((response) => {
        setStatus('success');
        setMessage(response.data.message);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      })
      .catch((error) => {
        setStatus('error');
        setMessage(error.response?.data?.error || 'Verification failed. The link may be invalid or expired.');
      });
  }, [searchParams, navigate]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResending(true);

    try {
      const response = await api.post('/auth/resend-verification', { email });
      alert(response.data.message);
      setEmail('');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verify-email-page">
      <div className="verify-card glass-card">
        {status === 'verifying' && (
          <>
            <div className="spinner"></div>
            <h2>Verifying your email...</h2>
            <p>Please wait while we verify your account.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="success-icon">✓</div>
            <h2>Email Verified!</h2>
            <p>{message}</p>
            <p className="redirect-info">Redirecting to login page...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="error-icon">✗</div>
            <h2>Verification Failed</h2>
            <p className="error-message">{message}</p>

            <div className="resend-section">
              <p>Need a new verification link?</p>
              <form onSubmit={handleResend}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn" disabled={resending}>
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </form>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => navigate('/login')}
              style={{ marginTop: '20px' }}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
