#!/bin/bash

echo "🚀 Setting up admin account..."

# Navigate to backend
cd backend

# Apply database migrations
echo "📦 Applying database migrations..."
npx prisma migrate deploy

# Wait for migrations to complete
sleep 2

# Create admin account
echo "👤 Creating admin account..."
curl -X POST http://localhost:3000/api/admin/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wooftrace.com","password":"R1l3yj014!","name":"Josh"}'

echo ""
echo "✅ Admin account created!"
echo ""
echo "📧 Email: admin@wooftrace.com"
echo "🔐 Password: R1l3yj014!"
echo "👤 Name: Josh"
echo ""

# Navigate back to root
cd ..

# Git operations
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Add admin table migration and setup"
git push origin main

echo ""
echo "🎉 Done! Changes pushed to GitHub (Vercel will auto-deploy)"
