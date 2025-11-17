import React from 'react';
import './Auth.css';

const FAQ: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="auth-card glass-card" style={{ maxWidth: '900px', textAlign: 'left' }}>
        <div className="auth-header">
          <h1 className="gradient-text">Frequently Asked Questions</h1>
          <p className="auth-subtitle">Answers about Wooftrace tags, profiles and safety</p>
        </div>

        <div className="legal-content">
          <h2>What is Wooftrace?</h2>
          <p>
            Wooftrace is a smart pet tag system operated by <strong>Wooftrace Ltd</strong>. Each tag links to an
            online pet profile with your contact details, so if your pet is found the finder can quickly reach you
            by scanning the tag with a phone.
          </p>

          <h2>How does the tag work?</h2>
          <p>
            Each tag has a unique QR code and can also be written to an NFC chip. When someone scans the tag, they
            are taken to a secure public profile showing your pet's details and your contact information (and any
            emergency contacts you add).
          </p>

          <h2>Do finders need an app?</h2>
          <p>
            No. Wooftrace is designed to be app-free for finders. They just scan the QR code or tap the NFC tag
            with a modern smartphone and the pet profile opens in the browser.
          </p>

          <h2>What happens when someone scans my pet's tag?</h2>
          <p>
            The finder sees your pet's public profile with your contact details and any emergency contacts you've
            added. They can call or email you directly, and they can optionally share their current location and
            their own contact details so you know where your pet is and how to reach them.
          </p>

          <h2>Do you track my pet in real time?</h2>
          <p>
            No. Wooftrace is <strong>not</strong> a GPS tracker. We only record an approximate location when someone
            scans your pet's tag and chooses to share their location. This location is then sent to you by email and
            appears in your pet's scan history.
          </p>

          <h2>What data do you store about me?</h2>
          <p>
            We store the information you choose to add: your account details (name and email), pet profile
            information, owner and emergency contacts, and scan history. For more details, see our
            <a href="/privacy"> Privacy Policy</a>.
          </p>

          <h2>Is my data shared with anyone else?</h2>
          <p>
            We share your data only with service providers needed to operate Wooftrace (like email delivery and
            hosting) and with authorities if required by law. We do <strong>not</strong> sell your personal data to
            third parties.
          </p>

          <h2>Can I remove my data or close my account?</h2>
          <p>
            Yes. You can update or remove most information from your dashboard. If you want your account and data
            deleted entirely, please contact <strong>Wooftrace Ltd</strong> using the contact details on our
            website and we will help you.
          </p>

          <h2>What if my pet is lost?</h2>
          <p>
            You can mark your pet as <strong>Lost</strong> from the pet profile page. This clearly flags the profile
            as a lost pet, highlights your contact information, and ensures you receive instant email notifications
            when the tag is scanned.
          </p>

          <h2>Is Wooftrace an emergency or veterinary service?</h2>
          <p>
            No. Wooftrace is not an emergency service or veterinary provider. If your pet needs urgent help, please
            contact your local vet or emergency services directly.
          </p>

          <h2>Who operates Wooftrace?</h2>
          <p>
            Wooftrace is operated by <strong>Wooftrace Ltd</strong>, based at Nutting Grove, LS1 3DL, Company
            Number: 4454434.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
