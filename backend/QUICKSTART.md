# 🚀 Quick Start Guide - News Portal Backend

## ⚡ 5-Minute Setup

### Prerequisites Check
- ✅ Node.js v18+ installed
- ✅ PostgreSQL running
- ✅ Terminal/Command prompt

### Step 1: Navigate to Backend
```bash
cd backend
```

### Step 2: Run Automated Setup (Recommended)
```bash
./setup.sh
```

This script will:
1. Check Node.js installation
2. Install all dependencies
3. Create .env file if needed
4. Generate Prisma client
5. Guide you through database setup
6. Optionally seed sample data

### Alternative: Manual Setup

#### A. Install Dependencies
```bash
npm install
```

#### B. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/news_portal?schema=public"
JWT_SECRET=your_secret_key_here
PORT=5000
```

#### C. Setup Database
```bash
# Create database (in PostgreSQL)
psql -U postgres -c "CREATE DATABASE news_portal;"

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed sample data
npm run prisma:seed
```

#### D. Start Server
```bash
npm run dev
```

## 🧪 Quick Test

### 1. Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

### 2. Login Test
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}'
```

Expected: JWT token in response

### 3. Get News
```bash
curl http://localhost:5000/api/news
```

Expected: List of news articles

## 📝 Test Credentials

```
Email: alice@example.com     | Password: password123
Email: karim@example.com     | Password: password123
Email: nusrat@example.com    | Password: password123 (ADMIN)
Email: mrinmoy@gmail.com     | Password: password123
```

## 🔧 Available Commands

```bash
npm run dev              # Start development server
npm start                # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open database GUI
npm run prisma:seed      # Seed sample data
```

## 🌐 Default URLs

- **API Server**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **API Docs**: http://localhost:5000 (root)
- **Prisma Studio**: http://localhost:5555 (after running `npm run prisma:studio`)

## 📚 Next Steps

1. ✅ Server is running? → Test endpoints
2. ✅ Endpoints working? → Read API_REFERENCE.md
3. ✅ Ready to code? → Check ARCHITECTURE.md
4. ✅ Deploying? → Review README.md production section

## 🆘 Common Issues

### Issue: Port 5000 already in use
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

### Issue: Can't connect to database
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL
brew services start postgresql
```

### Issue: Prisma errors
```bash
# Reset everything
npx prisma migrate reset
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## ✅ Success Checklist

- [ ] Dependencies installed
- [ ] `.env` configured
- [ ] PostgreSQL running
- [ ] Database created
- [ ] Migrations ran
- [ ] Data seeded
- [ ] Server starts without errors
- [ ] Health check returns 200
- [ ] Login returns JWT token
- [ ] Can fetch news

## 🎉 Ready!

Your backend is now running at **http://localhost:5000**

**What's Next?**
- Start the frontend: `cd ../frontend && npm run dev`
- Test API with Postman
- Read full docs in README.md
- Explore endpoints in API_REFERENCE.md

---

**Need Help?** Check README.md troubleshooting section or SETUP_GUIDE.md in parent directory.
