# News Portal - Complete Setup Guide

This guide will help you set up and run the complete News Portal application (Frontend + Backend).

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)
- **Git** (optional)

## 🏗️ Project Structure

```
news_portal/
├── frontend/          # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/           # Node.js + Express + Prisma backend
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── ...
├── db.json           # Old JSON server file (can be removed)
└── README.md         # This file
```

## 🚀 Complete Setup (Step by Step)

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Backend Environment

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` file with your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/news_portal?schema=public"
PORT=5000
NODE_ENV=development
JWT_SECRET=news_portal_secret_key_2026_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### Step 3: Setup PostgreSQL Database

**Option A: Using psql command line**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE news_portal;

# Exit psql
\q
```

**Option B: Using pgAdmin or another GUI tool**
- Open pgAdmin
- Create a new database named `news_portal`

### Step 4: Initialize Database with Prisma

```bash
# Still in backend directory

# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# When prompted, enter migration name: "init"

# Seed database with sample data
npm run prisma:seed
```

### Step 5: Install Frontend Dependencies

```bash
# Go back to root and then to frontend
cd ../frontend
npm install
```

### Step 6: Configure Frontend

The frontend is already configured to connect to `http://localhost:5000` (backend).
No changes needed unless you changed the backend port.

### Step 7: Run the Application

You need **TWO terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📝 Environment: development
🔗 API URL: http://localhost:5000
🌐 Frontend URL: http://localhost:5173
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v7.2.7  ready in 182 ms

➜  Local:   http://localhost:5173/
```

### Step 8: Access the Application

Open your browser and go to:
```
http://localhost:5173
```

## 👤 Test Credentials

After running the seed script, you can login with these test accounts:

| Email | Password | Role |
|-------|----------|------|
| alice@example.com | password123 | USER |
| karim@example.com | password123 | USER |
| nusrat@example.com | password123 | ADMIN |
| mrinmoy@gmail.com | password123 | USER |

## 🧪 Testing the Backend API

### Using cURL

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Register New User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }'
```

**Get All News:**
```bash
curl http://localhost:5000/api/news
```

**Create News (requires token):**
```bash
# First login to get token, then:
curl -X POST http://localhost:5000/api/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My News Title",
    "body": "This is the news content..."
  }'
```

### Using Postman or Thunder Client

Import this API collection:

**Base URL:** `http://localhost:5000`

**Endpoints:**
- POST `/api/auth/register` - Register
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user (requires auth)
- GET `/api/news` - Get all news
- GET `/api/news/:id` - Get single news
- POST `/api/news` - Create news (requires auth)
- PUT `/api/news/:id` - Update news (requires auth)
- DELETE `/api/news/:id` - Delete news (requires auth)
- GET `/api/comments/news/:newsId` - Get comments
- POST `/api/comments/news/:newsId` - Create comment (requires auth)
- DELETE `/api/comments/:id` - Delete comment (requires auth)

## 🐛 Troubleshooting

### Backend won't start

**Error: "Can't reach database server"**
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env` file
- Verify PostgreSQL username and password

**Solution:**
```bash
# Check if PostgreSQL is running (macOS)
brew services list | grep postgresql

# Start PostgreSQL (macOS)
brew services start postgresql

# Check if PostgreSQL is running (Linux)
sudo systemctl status postgresql

# Start PostgreSQL (Linux)
sudo systemctl start postgresql
```

### Database migration errors

**Reset database:**
```bash
cd backend

# Delete migration files
rm -rf prisma/migrations

# Reset database
npx prisma migrate reset

# Run migrations again
npm run prisma:migrate

# Seed database
npm run prisma:seed
```

### Frontend can't connect to backend

**Error: "Network Error" or CORS issues**
- Ensure backend is running on port 5000
- Check FRONTEND_URL in backend `.env`
- Verify CORS is enabled in backend

### Port already in use

**Backend port 5000 in use:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in backend/.env to different port (e.g., 5001)
```

**Frontend port 5173 in use:**
```bash
# Kill process
lsof -i :5173
kill -9 <PID>

# Or Vite will automatically use next available port
```

## 🛠️ Useful Commands

### Backend Commands
```bash
cd backend

# Development with auto-reload
npm run dev

# Production mode
npm start

# Generate Prisma Client
npm run prisma:generate

# Create new migration
npm run prisma:migrate

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Reset database
npx prisma migrate reset

# View database schema
npx prisma db pull
```

### Frontend Commands
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📊 Database Management

### Prisma Studio
Visual database browser:
```bash
cd backend
npm run prisma:studio
```

Opens at: `http://localhost:5555`

### View Database Structure
```bash
cd backend
npx prisma studio
```

## 🔄 Migrating from JSON Server

The old `db.json` file is no longer needed. All data is now in PostgreSQL.

**To migrate existing data:**
1. Export data from `db.json`
2. Create seed script in `prisma/seed.js`
3. Run `npm run prisma:seed`

## 📝 Environment Variables Reference

### Backend `.env`
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/news_portal?schema=public"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend
No environment variables needed for development.

## 🚀 Production Deployment

### Backend Deployment (e.g., Railway, Render, Heroku)

1. Set environment variables on hosting platform
2. Ensure DATABASE_URL points to production database
3. Set NODE_ENV=production
4. Run migrations: `npm run prisma:migrate`
5. Start server: `npm start`

### Frontend Deployment (e.g., Vercel, Netlify)

1. Update API URLs in frontend code to production backend URL
2. Build: `npm run build`
3. Deploy `dist` folder

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🆘 Getting Help

If you encounter any issues:

1. Check the troubleshooting section above
2. Review backend logs in terminal
3. Check browser console for frontend errors
4. Verify database connection
5. Ensure all dependencies are installed

## ✅ Verification Checklist

Before reporting issues, verify:

- [ ] PostgreSQL is running
- [ ] Database `news_portal` exists
- [ ] Backend `.env` file is configured correctly
- [ ] All dependencies installed (`npm install` in both directories)
- [ ] Migrations ran successfully
- [ ] Database seeded with sample data
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] No CORS errors in browser console
- [ ] Can login with test credentials

## 🎉 Success!

If everything is working:
- ✅ Backend API running at `http://localhost:5000`
- ✅ Frontend running at `http://localhost:5173`
- ✅ Can login with test credentials
- ✅ Can create, read, update, delete news
- ✅ Can add comments to news

**You're all set! Happy coding! 🚀**
