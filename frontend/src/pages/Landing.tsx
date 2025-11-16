import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="landing-page">
      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <h1 className="hero-title gradient-text">
            The Trusted Smart Tag for Your Pet
          </h1>
          <p className="hero-subtitle">
            Make it easy for someone to identify your pet, share where they are,
            and contact you – just by tapping or scanning the tag.
          </p>
          <div className="hero-badges">
            <span className="aurora-badge">No Apps Required</span>
            <span className="aurora-badge">No Batteries</span>
            <span className="aurora-badge">No Monthly Fees</span>
          </div>
          <div className="hero-cta">
            <a className="btn btn-secondary" href="#">
              Buy a Tag
            </a>
            <button className="btn" onClick={() => navigate('/activate')}>
              Activate Tag
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <h2 className="section-title gradient-text">How It Works</h2>
          <div className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-icon">📦</div>
              <h3>1. Order Your Tag</h3>
              <p>Purchase a durable, epoxy-coated WoofTrace smart tag</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon">✨</div>
              <h3>2. Activate Online</h3>
              <p>Enter your unique activation code to link the tag to your account</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon">🐕</div>
              <h3>3. Create Pet Profile</h3>
              <p>Add your pet's photo, medical info, and emergency contacts</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon">🏷️</div>
              <h3>4. Attach to Collar</h3>
              <p>Securely attach the tag to your pet's collar - it's built to last</p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits">
          <h2 className="section-title gradient-text">Why Pet Owners Love WoofTrace</h2>
          <div className="benefits-grid">
            <div className="benefit-item glass-card">
              <h3>📱 Instant Scanning</h3>
              <p>Anyone can tap or scan the tag with their phone - no app download needed</p>
            </div>
            <div className="benefit-item glass-card">
              <h3>📍 Location Alerts</h3>
              <p>Share where your pet was last seen with emergency contacts instantly</p>
            </div>
            <div className="benefit-item glass-card">
              <h3>👥 Unlimited Contacts</h3>
              <p>Add as many emergency contacts as you need - family, friends, vets</p>
            </div>
            <div className="benefit-item glass-card">
              <h3>🔒 Privacy Controls</h3>
              <p>Choose exactly what information is visible to the public</p>
            </div>
            <div className="benefit-item glass-card">
              <h3>🏥 Medical Information</h3>
              <p>Store important medical notes, allergies, and vet contact details</p>
            </div>
            <div className="benefit-item glass-card">
              <h3>🇬🇧 UK Data Hosting</h3>
              <p>Your data is securely stored in the UK with GDPR compliance</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="final-cta">
          <div className="cta-card glass-card">
            <h2 className="gradient-text">Ready to Protect Your Pet?</h2>
            <p>Join thousands of pet owners who trust WoofTrace</p>
            <button className="btn" onClick={() => navigate('/activate')}>
              Activate Tag
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <p>© 2025 WoofTrace. Built with love for pet owners.</p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
