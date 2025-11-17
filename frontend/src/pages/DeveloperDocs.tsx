import React from 'react';
import './Auth.css';

const DeveloperDocs: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="auth-card glass-card" style={{ maxWidth: '960px', textAlign: 'left' }}>
        <div className="auth-header">
          <h1 className="gradient-text">Developer API</h1>
          <p className="auth-subtitle">Integrate with the Wooftrace backend</p>
        </div>

        <div className="legal-content">
          <p>
            The Wooftrace API lets you manage users, pets, tags and scans programmatically. It uses JSON over HTTP
            with JWT authentication.
          </p>

          <h2>Base URL & Authentication</h2>
          <p>
            All endpoints are served from your backend base URL, for example:
          </p>
          <pre className="code-block">https://your-backend-url/api</pre>
          <p>For protected routes, send a JWT in the <code>Authorization</code> header:</p>
          <pre className="code-block">Authorization: Bearer &lt;token&gt;</pre>

          <h2>Auth</h2>
          <h3>Register</h3>
          <pre className="code-block">POST /auth/register</pre>
          <pre className="code-block">
{`{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "password123"
}`}
          </pre>

          <h3>Login</h3>
          <pre className="code-block">POST /auth/login</pre>
          <pre className="code-block">
{`{
  "email": "alice@example.com",
  "password": "password123"
}`}
          </pre>

          <h3>Password reset</h3>
          <pre className="code-block">POST /auth/forgot-password</pre>
          <pre className="code-block">POST /auth/reset-password</pre>

          <h2>Pets</h2>
          <ul>
            <li><code>GET /pets</code> – list pets for current user</li>
            <li><code>POST /pets</code> – create a pet linked to an activated tag</li>
            <li><code>GET /pets/:id</code> – get a single pet</li>
            <li><code>PUT /pets/:id</code> – update pet data</li>
            <li><code>DELETE /pets/:id</code> – delete a pet</li>
            <li><code>POST /pets/:id/upload</code> – upload pet image (multipart, field <code>image</code>)</li>
            <li><code>PATCH /pets/:id/lost-status</code> – toggle lost / found</li>
          </ul>

          <h2>Public pet profile</h2>
          <ul>
            <li><code>GET /pets/public/qr/:qrCode</code> – public profile by QR code</li>
            <li><code>GET /pets/public/nfc/:nfcId</code> – public profile by NFC ID</li>
          </ul>

          <h2>Tags</h2>
          <ul>
            <li><code>GET /tags</code> – list user tags</li>
            <li><code>POST /tags/activate</code> – activate a tag via activation code</li>
          </ul>

          <h2>Emergency contacts</h2>
          <ul>
            <li><code>GET /contacts/pet/:petId</code> – contacts for a pet (owner)</li>
            <li><code>POST /contacts/pet/:petId</code> – create contact</li>
            <li><code>PUT /contacts/:contactId</code> – update contact</li>
            <li><code>DELETE /contacts/:contactId</code> – delete contact</li>
            <li><code>GET /contacts/public/pet/:petId</code> – public-safe contacts for public profile</li>
          </ul>

          <h2>Location scans</h2>
          <h3>Record a scan</h3>
          <pre className="code-block">POST /location/scan/:petId</pre>
          <pre className="code-block">
{`{
  "latitude": 53.8008,
  "longitude": -1.5491,
  "accuracy": 25,
  "finderName": "Sarah",
  "finderPhone": "+44 7123 456789",
  "finderEmail": "finder@example.com"
}`}
          </pre>
          <p>
            The API stores the scan, optional finder contact details and triggers an email notification to the
            owner and emergency contacts.
          </p>

          <h3>Get scan history</h3>
          <pre className="code-block">GET /pets/:petId/scans</pre>
          <p>Returns recent scans for a pet (owner only), including finder contact details when provided.</p>

          <h2>Admin & factory</h2>
          <p>Admin routes require an admin JWT from <code>/admin/auth/login</code>.</p>
          <ul>
            <li><code>POST /admin/auth/login</code> – admin login</li>
            <li><code>POST /admin/auth/setup</code> – one-time create first admin</li>
            <li><code>POST /factory/tags/generate</code> – generate tags</li>
            <li><code>GET /factory/tags</code> – list tags</li>
            <li><code>GET /factory/tags/stats</code> – tag stats</li>
            <li><code>GET /factory/tags/:id/programming</code> – programming payload for QR/NFC</li>
            <li><code>POST /factory/tags/:tagId/unlink</code> – admin unlink tag from pet</li>
          </ul>

          <h2>Error handling</h2>
          <p>Errors are returned as JSON with an <code>error</code> property:</p>
          <pre className="code-block">
{`{ "error": "Pet not found" }`}
          </pre>
          <p>Common status codes:</p>
          <ul>
            <li><code>400</code> – validation / bad request</li>
            <li><code>401</code> – unauthenticated</li>
            <li><code>403</code> – forbidden</li>
            <li><code>404</code> – not found</li>
            <li><code>500</code> – internal server error</li>
          </ul>

          <p style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--cloud-gray)' }}>
            This is a high-level developer overview. For the full implementation, see the controllers in
            <code> backend/src/controllers</code> and routes in <code> backend/src/routes</code>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDocs;
