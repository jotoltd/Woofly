# Woofly - Pet Registration & Lost Pet Tracker

A full-stack web application for pet registration with unique QR codes and NFC identifiers. Helps reunite lost pets with their owners through scannable tags.

## Features

- **Pet Registration**: Register your pets with detailed information (name, species, breed, age, description)
- **Photo Upload**: Add photos to pet profiles
- **QR Code Generation**: Generate unique QR codes for each pet that can be printed and attached to collars
- **NFC Support**: Each pet gets a unique NFC ID for NFC tag integration
- **Public Pet Profiles**: Anyone can scan a QR code or NFC tag to view pet information
- **Lost Pet Tracking**: Mark pets as lost with location and date information
- **Lost Pet Alerts**: Public profiles show prominent alerts when pets are reported lost
- **Owner Contact Info**: Display owner contact details on public profiles
- **Veterinary Information**: Store and display emergency vet contact information
- **Medical Information**: Track important medical notes, allergies, and medications
- **Secure Authentication**: JWT-based authentication system
- **Pet Management**: Edit pet information and delete pet profiles with confirmation

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer
- **QR Code Generation**: qrcode library

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
cd Woofly
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

## Usage

1. **Register an account**: Create a new user account
2. **Add a pet**: Register your pet with details and a photo
3. **Generate QR code**: Create a QR code for your pet's collar tag
4. **Print and attach**: Print the QR code and attach it to your pet's collar
5. **Mark as lost**: If your pet goes missing, mark them as lost with location details
6. **Public access**: Anyone who finds your pet can scan the QR code to see your contact information

## Project Structure

```
Woofly/
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

### Pets (Protected)
- `GET /api/pets` - Get user's pets
- `POST /api/pets` - Create new pet
- `GET /api/pets/:id` - Get pet details
- `PUT /api/pets/:id` - Update pet
- `DELETE /api/pets/:id` - Delete pet
- `POST /api/pets/:id/upload` - Upload pet photo
- `GET /api/pets/:id/qrcode` - Generate QR code
- `PATCH /api/pets/:id/lost-status` - Toggle lost/found status

### Public
- `GET /api/pets/public/qr/:qrCode` - Get pet by QR code
- `GET /api/pets/public/nfc/:nfcId` - Get pet by NFC ID

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
