# WoofTrace - The Trusted Smart Tag for Your Pet

Make it easy for someone to identify your pet, share where they are, and contact you – just by tapping or scanning the tag.

## Why WoofTrace?

No batteries. No apps. No monthly subscriptions. Just a simple, durable smart tag that helps bring your pet home safely.

### Key Features

- **Customisable Pet Profile**: Add your pet's photo, name, medical information, and emergency contacts
- **Location Alerts**: Share where your pet was last seen with emergency contacts instantly
- **Unlimited Emergency Contacts**: Add as many trusted contacts as you need
- **Simple Activation**: Receive your tag, activate it online with your unique code, and attach it to your pet's collar
- **Instant Scanning**: Anyone can tap or scan the tag to see your pet's profile and contact you immediately
- **Privacy Controls**: Choose what information is visible to the public
- **Veterinary Information**: Store emergency vet details and medical notes for quick access
- **UK Data Hosting**: Your data is securely stored in the UK with GDPR compliance
- **Durable Design**: Epoxy-coated tags built to withstand everyday wear and weather

### No App Required

Finders don't need to download anything - they simply tap or scan the tag with their phone to see your pet's profile and contact you.

## How It Works

1. **Order Your Tag**: Purchase a WoofTrace smart tag
2. **Receive & Activate**: Your tag arrives with a unique activation code - activate it online in minutes
3. **Create Pet Profile**: Add your pet's details, photo, and emergency contacts
4. **Attach to Collar**: Securely attach the durable tag to your pet's collar
5. **Peace of Mind**: If your pet is found, anyone can tap or scan the tag to contact you instantly

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM (UK hosted)
- **Authentication**: JWT with bcrypt
- **Storage**: Supabase Storage
- **Tag Technology**: QR Code and NFC compatible

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **HTTP Client**: Axios
- **Styling**: CSS

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd WoofTrace
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:

Create a `.env` file in the `backend` directory:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_jwt_secret_here
PORT=3000
FRONTEND_URL=http://localhost:5173
```

5. Run database migrations:
```bash
cd backend
npx prisma migrate dev
```

6. Start the backend server:
```bash
cd backend
npm run dev
```

7. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## For Developers

### Local Development Setup

1. **Register an account**: Create a new user account
2. **Activate a tag**: Use the activation code system to link a tag to your account
3. **Create pet profile**: Add your pet's details, photo, and emergency contacts
4. **Tag management**: View and manage your active tags
5. **Location sharing**: When a tag is scanned, share location with emergency contacts
6. **Privacy settings**: Control what information is publicly visible

## Project Structure

```
WoofTrace/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth and upload middleware
│   │   └── routes/         # API routes
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── uploads/            # Uploaded pet images
├── frontend/
│   ├── src/
│   │   ├── api/           # API configuration
│   │   ├── components/    # React components
│   │   ├── context/       # Auth context
│   │   └── pages/         # Page components
│   └── public/
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tag Activation
- `POST /api/tags/activate` - Activate a tag with activation code
- `GET /api/tags` - Get user's active tags

### Pets (Protected)
- `GET /api/pets` - Get user's pets
- `POST /api/pets` - Create new pet profile
- `GET /api/pets/:id` - Get pet details
- `PUT /api/pets/:id` - Update pet information
- `DELETE /api/pets/:id` - Delete pet profile
- `POST /api/pets/:id/upload` - Upload pet photo
- `PATCH /api/pets/:id/lost-status` - Toggle lost/found status
- `PATCH /api/pets/:id/privacy` - Update privacy settings

### Public (Tag Scanning)
- `GET /api/scan/:tagCode` - Get pet profile by scanning tag
- `POST /api/scan/:tagCode/alert` - Send location alert to emergency contacts

### Emergency Contacts
- `GET /api/pets/:id/contacts` - Get emergency contacts for pet
- `POST /api/pets/:id/contacts` - Add emergency contact
- `DELETE /api/contacts/:id` - Remove emergency contact

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
