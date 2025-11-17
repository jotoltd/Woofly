import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './ActivateTag.css';

const ActivateTag = () => {
  const [activationCode, setActivationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const code = activationCode.trim().toUpperCase();

      if (!isAuthenticated) {
        // Store pending activation code and send the user to login/register
        localStorage.setItem('pendingActivationCode', code);
        const choice = window.confirm(
          'To save this tag, you need a free Wooftrace account.\n\n' +
          'Click OK to create an account, or Cancel to sign in to an existing account.'
        );
        navigate(choice ? '/register' : '/login');
        return;
      }

      await api.post('/tags/activate', { activationCode: code });
      setSuccess(true);

      // After 2 seconds, navigate to dashboard to create pet profile
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to activate tag');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="activate-container">
        <div className="activate-card glass-card">
          <div className="success-animation">
            <div className="checkmark-circle">
              <div className="checkmark"></div>
            </div>
          </div>
          <h2 className="gradient-text">Tag Activated!</h2>
          <p className="success-text">
            Your WoofTrace tag has been successfully activated.
            <br />
            Redirecting you to create your pet's profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="activate-container">
      <div className="activate-card glass-card">
        <div className="activate-header">
          <h1 className="gradient-text">Activate Your Tag</h1>
          <p className="activate-subtitle">
            Enter the activation code that came with your WoofTrace smart tag
          </p>
        </div>

        <form onSubmit={handleActivate} className="activate-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label className="form-label">Activation Code</label>
            <input
              type="text"
              className="form-input activation-input"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
              placeholder="XXXX-XXXX-XXXX"
              required
              autoFocus
              maxLength={20}
            />
            <p className="input-hint">
              Find this code on the packaging that came with your tag
            </p>
          </div>

          <button
            type="submit"
            className="btn"
            disabled={loading || !activationCode}
          >
            {loading ? 'Activating...' : 'Activate Tag'}
          </button>
        </form>

        <div className="activate-info">
          <div className="info-card">
            <h3>What happens next?</h3>
            <ol>
              <li>Your tag will be activated and linked to your account</li>
              <li>You'll create a profile for your pet</li>
              <li>Anyone who scans your tag will see your pet's info</li>
            </ol>
          </div>

          <div className="help-text">
            <p>
              <strong>Need help?</strong> Can't find your activation code?
              <br />
              It's printed on the card that came with your tag or on the tag packaging.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivateTag;
