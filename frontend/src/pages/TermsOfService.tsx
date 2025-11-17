import React from 'react';
import './Auth.css';

const TermsOfService: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="auth-card glass-card" style={{ maxWidth: '800px', textAlign: 'left' }}>
        <div className="auth-header">
          <h1 className="gradient-text">Terms of Service</h1>
          <p className="auth-subtitle">The rules for using Wooftrace</p>
        </div>

        <div className="legal-content">
          <p><strong>Last updated:</strong> {new Date().getFullYear()}</p>

          <h2>1. Introduction</h2>
          <p>
            These Terms of Service ("Terms") govern your use of the Wooftrace website and services (the
            "Service") operated by <strong>Wooftrace Ltd</strong> ("we", "us", "our"). By creating an account,
            activating a tag or using the Service, you agree to these Terms.
          </p>

          <h2>2. Use of the Service</h2>
          <p>You agree to:</p>
          <ul>
            <li>Provide accurate information for your account, pets and emergency contacts</li>
            <li>Keep your login credentials secure and not share them with others</li>
            <li>Use the Service only for lawful purposes and in a reasonable way</li>
          </ul>

          <p>You must not:</p>
          <ul>
            <li>Misuse the Service or attempt to access data you are not authorised to see</li>
            <li>Upload content that is illegal, offensive or infringes others' rights</li>
            <li>Use Wooftrace for any purpose other than pet safety and identification</li>
          </ul>

          <h2>3. Finder information</h2>
          <p>
            When someone scans a tag, they may choose to share their location and optional contact details.
            This information is shared with the pet's owner and emergency contacts so they can coordinate the
            safe return of the pet. You agree not to misuse finder information for harassment, spam or any
            purpose unrelated to the pet's safety.
          </p>

          <h2>4. No emergency or medical service</h2>
          <p>
            Wooftrace is <strong>not</strong> an emergency service or veterinary provider. In an emergency, you
            should contact local authorities or a qualified veterinarian directly.
          </p>

          <h2>5. Service availability</h2>
          <p>
            We aim to keep the Service available, but we do not guarantee uninterrupted operation. The Service
            may be unavailable from time to time due to maintenance, technical issues or factors outside our
            control.
          </p>

          <h2>6. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, Wooftrace Ltd is not liable for any indirect, incidental or
            consequential damages arising from the use of, or inability to use, the Service. We do not guarantee
            that using Wooftrace will result in a lost pet being found.
          </p>

          <h2>7. Account termination</h2>
          <p>
            You may stop using the Service at any time. We reserve the right to suspend or terminate accounts
            that violate these Terms, abuse the Service, or are used for fraudulent or illegal activity.
          </p>

          <h2>8. Changes to these Terms</h2>
          <p>
            We may update these Terms from time to time. If we make material changes, we will notify you by email
            or via the Service. Continued use of the Service after changes take effect constitutes your
            acceptance of the new Terms.
          </p>

          <h2>9. Contact</h2>
          <p>
            If you have any questions about these Terms, please contact <strong>Wooftrace Ltd</strong>:
          </p>
          <p>
            Wooftrace Ltd<br />
            Nutting Grove<br />
            LS1 3DL<br />
            Company Number: 4454434
          </p>

          <p style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--cloud-gray)' }}>
            These Terms are a general template and do not constitute legal advice. Please consult a qualified
            legal professional to ensure they are appropriate for your business and jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
