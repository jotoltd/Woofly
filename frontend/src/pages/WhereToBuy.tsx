import React from 'react';
import './Auth.css';

const WhereToBuy: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="auth-card glass-card" style={{ maxWidth: '900px', textAlign: 'left' }}>
        <div className="auth-header">
          <h1 className="gradient-text">Where to Buy</h1>
          <p className="auth-subtitle">Get your Wooftrace smart pet tags</p>
        </div>

        <div className="legal-content">
          <h2>Official Wooftrace Store</h2>
          <p>
            Purchase authentic Wooftrace smart pet tags directly from our official online store. Each tag comes with:
          </p>
          <ul>
            <li>Durable QR code and NFC chip technology</li>
            <li>Weatherproof and pet-safe materials</li>
            <li>Lifetime access to your pet's online profile</li>
            <li>Free profile updates anytime</li>
            <li>Email notifications when your tag is scanned</li>
          </ul>
          <p>
            <strong>Coming Soon:</strong> Our online store is launching soon. Register for an account today to be
            notified when tags become available for purchase.
          </p>

          <h2>Retail Partners</h2>
          <p>
            We're working with select pet stores and veterinary clinics to make Wooftrace tags available in your area.
            Check back soon for a list of authorized retailers near you.
          </p>

          <h2>Bulk Orders</h2>
          <p>
            Are you a pet store, veterinary clinic, animal shelter, or rescue organization interested in carrying
            Wooftrace tags? We offer special pricing for bulk orders and partnerships.
          </p>
          <p>
            Contact us at <a href="mailto:sales@wooftrace.com">sales@wooftrace.com</a> for wholesale inquiries.
          </p>

          <h2>Verify Authenticity</h2>
          <p>
            To ensure you're getting a genuine Wooftrace tag, only purchase from:
          </p>
          <ul>
            <li>The official Wooftrace website</li>
            <li>Authorized retail partners listed on this page</li>
            <li>Direct from Wooftrace Ltd</li>
          </ul>
          <p>
            Each authentic tag includes a unique activation code and links to the official Wooftrace service.
            Beware of counterfeit tags that may not provide the same security and reliability.
          </p>

          <h2>Questions?</h2>
          <p>
            For questions about purchasing, shipping, or product availability, please visit our <a href="/faq">FAQ</a> or
            contact us directly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhereToBuy;
