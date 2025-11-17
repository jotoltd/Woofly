import React from 'react';
import './Auth.css';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="auth-card glass-card" style={{ maxWidth: '800px', textAlign: 'left' }}>
        <div className="auth-header">
          <h1 className="gradient-text">Privacy Policy</h1>
          <p className="auth-subtitle">How Wooftrace Ltd handles your data</p>
        </div>

        <div className="legal-content">
          <p><strong>Last updated:</strong> {new Date().getFullYear()}</p>

          <h2>1. Who we are</h2>
          <p>
            This service is operated by <strong>Wooftrace Ltd</strong> ("we", "us", "our").
            We provide pet safety and tag tracking services so that lost pets can be reunited with their owners.
          </p>

          <h2>2. What data we collect</h2>
          <p>We collect and process the following types of personal data:</p>
          <ul>
            <li>Account details (name, email address, password hash)</li>
            <li>Pet profile details (name, species, photo, medical info you choose to add)</li>
            <li>Owner and emergency contact details (phone, email, address, social links)</li>
            <li>Location scan data when someone scans a pet tag (approximate location, device info)</li>
            <li>Optional finder contact details (name, phone, email) when a finder chooses to share them</li>
          </ul>

          <h2>3. How we use your data</h2>
          <p>We use your data to:</p>
          <ul>
            <li>Provide and maintain the Wooftrace service</li>
            <li>Send important notifications (e.g. tag scan alerts, password reset emails)</li>
            <li>Help reunite lost pets with their owners</li>
            <li>Improve and protect the service (security, abuse prevention, analytics)</li>
          </ul>

          <h2>4. Location and finder data</h2>
          <p>
            When someone scans a tag and shares their location, we store the approximate GPS coordinates and
            basic device information. If the finder chooses to share their name, phone number or email address,
            we will include those details in the scan alert email sent to the owner and their emergency contacts.
          </p>
          <p>
            Finder contact details are only used to help the owner contact the finder and are not used for
            marketing by Wooftrace Ltd.
          </p>

          <h2>5. Data sharing</h2>
          <p>We may share your data with:</p>
          <ul>
            <li>Email and infrastructure providers needed to operate the service</li>
            <li>Law enforcement or authorities where we are legally required to do so</li>
          </ul>
          <p>
            We do <strong>not</strong> sell your personal data to third parties.
          </p>

          <h2>6. Data retention</h2>
          <p>
            We retain your account, pet and scan data for as long as your account is active or as needed to
            provide the service. You can request deletion of your account, and we will remove or anonymise
            personal data where legally possible.
          </p>

          <h2>7. Your rights</h2>
          <p>
            Depending on your location, you may have rights to access, correct or delete your personal data,
            or to object to certain types of processing. To exercise these rights, please contact us using the
            details below.
          </p>

          <h2>8. Contact</h2>
          <p>
            If you have any questions about this Privacy Policy or how we handle your data, please contact
            <strong> Wooftrace Ltd</strong>:
          </p>
          <p>
            Wooftrace Ltd<br />
            Nutting Grove<br />
            LS1 3DL<br />
            Company Number: 4454434
          </p>

          <p style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--cloud-gray)' }}>
            This Privacy Policy is a general template and does not constitute legal advice. Please consult a
            qualified legal professional to ensure compliance with applicable laws in your jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
