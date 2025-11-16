import dotenv from 'dotenv';

// IMPORTANT: Load environment variables BEFORE any other imports
// so that modules like supabase.ts can access process.env values
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import petRoutes from './routes/petRoutes';
import contactRoutes from './routes/contactRoutes';
import locationRoutes from './routes/locationRoutes';
import tagRoutes from './routes/tagRoutes';
import adminAuthRoutes from './routes/adminAuthRoutes';
import factoryRoutes from './routes/factoryRoutes';

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
app.use('/api/tags', tagRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/factory', factoryRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`WoofTrace backend server running on port ${PORT}`);
});
