# News Portal Backend API

A professional RESTful API for a news portal application built with Node.js, Express, PostgreSQL, and Prisma ORM.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Password Hashing**: bcryptjs
- **Environment Config**: dotenv

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.js                # Database seeding script
├── src/
│   ├── config/
│   │   └── database.js        # Prisma client configuration
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── news.controller.js
│   │   └── comment.controller.js
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── errorHandler.js    # Global error handler
│   │   ├── notFound.js        # 404 handler
│   │   └── validate.js        # Zod validation middleware
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── news.routes.js
│   │   └── comment.routes.js
│   ├── utils/
│   │   ├── ApiError.js        # Custom error class
│   │   ├── ApiResponse.js     # Standard response class
│   │   └── jwt.js             # JWT utilities
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── news.validator.js
│   │   └── comment.validator.js
│   └── server.js              # Application entry point
├── .env                       # Environment variables
├── .env.example               # Environment template
├── .gitignore
└── package.json
```

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  password  String
  role      Role      @default(USER)  // USER or ADMIN
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  news      News[]
  comments  Comment[]
}
```

### News Model
```prisma
model News {
  id        Int       @id @default(autoincrement())
  title     String
  body      String    @db.Text
  authorId  Int
  author    User      @relation(...)
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

### Comment Model
```prisma
model Comment {
  id        Int      @id @default(autoincrement())
  text      String   @db.Text
  newsId    Int
  userId    Int
  news      News     @relation(...)
  user      User     @relation(...)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables
Create `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/news_portal?schema=public"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

### Step 3: Setup Database

1. Create PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE news_portal;
\q
```

2. Generate Prisma Client:
```bash
npm run prisma:generate
```

3. Run database migrations:
```bash
npm run prisma:migrate
```

4. Seed the database with sample data:
```bash
npm run prisma:seed
```

### Step 4: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will be running at: `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"  // Optional: USER or ADMIN
}
```

**Response:**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2026-02-21T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.new@example.com"
}
```

---

### News Endpoints

#### Get All News (with pagination)
```http
GET /api/news?page=1&limit=10&search=startup
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in title and body

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "News retrieved successfully",
  "data": {
    "news": [
      {
        "id": 1,
        "title": "Local Startup Wins Award",
        "body": "A Dhaka-based startup...",
        "authorId": 2,
        "author": {
          "id": 2,
          "name": "Karim Hossain",
          "email": "karim@example.com"
        },
        "_count": {
          "comments": 5
        },
        "createdAt": "2026-02-21T...",
        "updatedAt": "2026-02-21T..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

#### Get Single News
```http
GET /api/news/:id
```

**Response includes comments:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "News retrieved successfully",
  "data": {
    "id": 1,
    "title": "Local Startup Wins Award",
    "body": "Full article content...",
    "authorId": 2,
    "author": {
      "id": 2,
      "name": "Karim Hossain",
      "email": "karim@example.com"
    },
    "comments": [
      {
        "id": 1,
        "text": "Great news!",
        "userId": 3,
        "user": {
          "id": 3,
          "name": "Alice",
          "email": "alice@example.com"
        },
        "createdAt": "2026-02-21T..."
      }
    ],
    "createdAt": "2026-02-21T...",
    "updatedAt": "2026-02-21T..."
  }
}
```

#### Create News
```http
POST /api/news
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Breaking News Title",
  "body": "Full article content goes here..."
}
```

**Response:**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "News created successfully",
  "data": {
    "id": 5,
    "title": "Breaking News Title",
    "body": "Full article content...",
    "authorId": 1,
    "author": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2026-02-21T...",
    "updatedAt": "2026-02-21T..."
  }
}
```

#### Update News
```http
PUT /api/news/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "body": "Updated content"
}
```

**Authorization:** Only the author or admin can update

#### Delete News
```http
DELETE /api/news/:id
Authorization: Bearer <token>
```

**Authorization:** Only the author or admin can delete

#### Get News by Author
```http
GET /api/news/author/:authorId
```

---

### Comment Endpoints

#### Get Comments for News Article
```http
GET /api/comments/news/:newsId
```

#### Create Comment
```http
POST /api/comments/news/:newsId
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "This is a great article!"
}
```

#### Update Comment
```http
PUT /api/comments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Updated comment text"
}
```

**Authorization:** Only the comment author or admin can update

#### Delete Comment
```http
DELETE /api/comments/:id
Authorization: Bearer <token>
```

**Authorization:** Only the comment author or admin can delete

#### Get Comments by User
```http
GET /api/comments/user/:userId
```

---

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Token is returned upon successful login or registration.

## ⚠️ Error Handling

All errors follow this format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message here"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

## 🧪 Testing

### Default Test Users
After running `npm run prisma:seed`:

```
Email: alice@example.com
Email: karim@example.com
Email: nusrat@example.com (ADMIN)
Email: mrinmoy@gmail.com
Password: password123 (for all users)
```

### Test with cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}'
```

**Get News:**
```bash
curl http://localhost:5000/api/news
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run prisma:generate   # Generate Prisma Client
npm run prisma:migrate    # Run database migrations
npm run prisma:studio     # Open Prisma Studio (GUI)
npm run prisma:seed       # Seed database with sample data
```

## 🛡️ Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based access control (USER, ADMIN)
- Request validation with Zod
- Protected routes with middleware
- CORS configuration
- Environment variable security

## 📝 Notes

- Change `JWT_SECRET` in production to a strong random string
- Update database credentials in `.env`
- Configure `FRONTEND_URL` for CORS
- Keep `.env` file secure and never commit it
- Use HTTPS in production

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=<production_database_url>
JWT_SECRET=<strong_random_secret>
PORT=5000
FRONTEND_URL=<production_frontend_url>
```

## 📧 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ by the News Portal Team**
