import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import petRoutes from './routes/petRoutes';
import contactRoutes from './routes/contactRoutes';
import locationRoutes from './routes/locationRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Note: Images are now stored in Supabase Storage, not local filesystem

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/location', locationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`WoofTrace backend server running on port ${PORT}`);
});
