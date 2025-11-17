# Wooftrace API Documentation

Backend base URL: `https://your-backend-url/api`

Authentication is via JSON Web Tokens (JWT). For protected endpoints, send:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Auth

### POST /auth/register
Create a new user.

**Body**
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "password123"
}
```

Returns user and JWT token. A verification email is sent.

### POST /auth/login
Log in an existing user.

**Body**
```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

**Response** contains `token` and user object.

### POST /auth/forgot-password
Request password reset email.

**Body**
```json
{ "email": "alice@example.com" }
```

### POST /auth/reset-password
Reset password using token from email.

**Body**
```json
{
  "token": "<reset-token>",
  "password": "newPassword"
}
```

---

## Pets

### GET /pets
Get all pets for current user.

### POST /pets
Create a pet linked to one of the user's activated tags.

**Body** (simplified)
```json
{
  "name": "Buddy",
  "species": "Dog",
  "breed": "Labrador",
  "tagId": "<tag-id>",
  "ownerPhone": "+44...",
  "ownerEmail": "owner@example.com"
}
```

### GET /pets/:id
Get a single pet for the current user.

### PUT /pets/:id
Update pet details (name, species, contact, vet, medical info, etc.).

### DELETE /pets/:id
Delete a pet (and unlink its tag).

### POST /pets/:id/upload
Upload a pet image (multipart/form-data, field `image`). Stored in Supabase Storage.

### PATCH /pets/:id/lost-status
Update lost/found status.

**Body**
```json
{
  "isLost": true,
  "lastSeenLocation": "Central Park, near fountain",
  "lostDate": "2024-01-01T12:00:00.000Z" // optional, server can set
}
```

---

## Public Pet Profile

These endpoints do not require authentication and are used by QR/NFC scans.

### GET /pets/public/qr/:qrCode
Get public profile by QR code.

### GET /pets/public/nfc/:nfcId
Get public profile by NFC ID.

The response includes basic pet info, owner name and selected contact details, vet/medical info, and isLost status.

---

## Tags

### GET /tags
Get all tags for the current user.

### POST /tags/activate
Activate a tag using its activation code and link it to the current user.

**Body**
```json
{
  "activationCode": "ABC-DEF-123"
}
```

Returns an activated tag that can be linked to a pet.

---

## Contacts (Emergency Contacts)

All contact routes require authentication.

### GET /contacts/pet/:petId
Get all contacts for a pet (owner only).

### POST /contacts/pet/:petId
Create a contact for a pet.

**Body**
```json
{
  "name": "Mum",
  "relation": "Family",
  "phone": "+44...",
  "email": "mum@example.com",
  "address": "...",
  "facebook": "username or URL",
  "instagram": "username",
  "priority": 10
}
```

### PUT /contacts/:contactId
Update a contact.

### DELETE /contacts/:contactId
Delete a contact.

### GET /contacts/public/pet/:petId
Public endpoint to get contacts for the public profile (only exposes safe fields like name, relation, phone, email, address, social links).

---

## Location Scans

### POST /location/scan/:petId
Record a scan when someone finds a pet and optionally share location and finder contact details.

**Body**
```json
{
  "latitude": 53.8008,
  "longitude": -1.5491,
  "accuracy": 25,
  "finderName": "Sarah",
  "finderPhone": "+44 7123 456789",
  "finderEmail": "finder@example.com"
}
```

The backend:
- Creates a `LocationScan` record (including optional finderName/finderPhone/finderEmail).
- Sends an email alert to the owner and emergency contacts.

**Response**
```json
{
  "message": "Location recorded successfully",
  "scanId": "..."
}
```

### GET /pets/:petId/scans
Get recent location scans for a pet (owner only). Returns an array of `LocationScan` records, including finder contact info (if provided) and whether an email was sent.

---

## Admin & Factory

Admin endpoints require an admin JWT (via `/api/admin/auth/login`).

Base path for admin auth: `/api/admin/auth`

### POST /admin/auth/login
Admin login.

**Body**
```json
{
  "email": "admin@example.com",
  "password": "adminPassword"
}
```

### POST /admin/auth/setup
One-time endpoint to create the first admin if none exists.

---

Factory endpoints (manage tags, stats, etc.) under `/api/factory` (all admin-only):

- `POST /factory/tags/generate` – generate batches of tags
- `GET /factory/tags` – list tags
- `GET /factory/tags/stats` – tag statistics
- `GET /factory/tags/:id/programming` – data for NFC/QR programming
- `GET /factory/users-with-assets` – list users with pets/tags (if enabled)
- `POST /factory/tags/:tagId/unlink` – admin unlink a tag from a pet

---

## Error Handling

Errors are returned as JSON with an `error` message and appropriate HTTP status code:

```json
{ "error": "Pet not found" }
```

Common statuses:
- `400` – bad request / validation error
- `401` – unauthenticated / invalid token
- `403` – forbidden (not owner / not admin)
- `404` – not found
- `500` – internal server error

---

This document is a high-level overview for developers integrating with the Wooftrace backend. For full details, refer to the source controllers in `backend/src/controllers` and routes in `backend/src/routes`.
