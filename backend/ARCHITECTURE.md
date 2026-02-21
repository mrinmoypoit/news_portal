# Backend Architecture Overview

## 🏛️ Architecture Pattern

The backend follows a **Layered MVC Architecture** with clean separation of concerns:

```
┌─────────────────────────────────────────────┐
│           Client (Frontend/API)             │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│              Routes Layer                   │
│  (API endpoint definitions & validation)    │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          Middleware Layer                   │
│  (Auth, Validation, Error Handling)         │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          Controller Layer                   │
│  (Business logic & request handling)        │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          Database Layer (Prisma)            │
│  (Data access & ORM)                        │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          PostgreSQL Database                │
└─────────────────────────────────────────────┘
```

## 📁 Detailed Folder Structure

```
backend/
│
├── prisma/                          # Database layer
│   ├── schema.prisma               # Database schema definition
│   └── seed.js                     # Database seeding script
│
├── src/
│   │
│   ├── config/                     # Configuration files
│   │   └── database.js            # Prisma client setup
│   │
│   ├── controllers/                # Request handlers (Business Logic)
│   │   ├── auth.controller.js     # Authentication logic
│   │   ├── news.controller.js     # News CRUD operations
│   │   └── comment.controller.js  # Comment operations
│   │
│   ├── middleware/                 # Express middleware
│   │   ├── auth.js                # JWT verification & authorization
│   │   ├── errorHandler.js        # Global error handling
│   │   ├── notFound.js            # 404 handler
│   │   └── validate.js            # Zod validation wrapper
│   │
│   ├── routes/                     # API route definitions
│   │   ├── auth.routes.js         # /api/auth endpoints
│   │   ├── news.routes.js         # /api/news endpoints
│   │   └── comment.routes.js      # /api/comments endpoints
│   │
│   ├── validators/                 # Zod validation schemas
│   │   ├── auth.validator.js      # Auth input validation
│   │   ├── news.validator.js      # News input validation
│   │   └── comment.validator.js   # Comment input validation
│   │
│   ├── utils/                      # Utility functions
│   │   ├── ApiError.js            # Custom error class
│   │   ├── ApiResponse.js         # Standard response wrapper
│   │   └── jwt.js                 # JWT token utilities
│   │
│   └── server.js                   # Application entry point
│
├── .env                            # Environment variables
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies & scripts
├── README.md                       # Full documentation
└── API_REFERENCE.md                # Quick API reference
```

## 🔄 Request Flow

### Example: Creating a News Article

```
1. Client Request
   POST /api/news
   Authorization: Bearer <token>
   Body: { "title": "...", "body": "..." }
   
   ↓

2. Express Server (server.js)
   - CORS middleware
   - Body parser
   - Route matching
   
   ↓

3. Routes Layer (news.routes.js)
   - Route: POST /
   - Apply middleware: protect, validate
   
   ↓

4. Middleware Chain
   a. protect (auth.js)
      - Extract JWT token
      - Verify token
      - Attach user to req.user
   
   b. validate (validate.js)
      - Run Zod schema validation
      - Validate title & body
      - Throw error if invalid
   
   ↓

5. Controller (news.controller.js)
   - Extract data from req.body
   - Get user ID from req.user
   - Call Prisma to create news
   
   ↓

6. Database Layer (Prisma)
   - Generate SQL query
   - Execute on PostgreSQL
   - Return created record
   
   ↓

7. Response
   - Wrap in ApiResponse
   - Return JSON with status 201
   
   ↓

8. Client receives response
   {
     "statusCode": 201,
     "success": true,
     "message": "News created successfully",
     "data": { ... }
   }
```

## 🔐 Authentication Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. POST /api/auth/login
       │    { email, password }
       ↓
┌─────────────────────────┐
│  Auth Controller        │
│  1. Find user by email  │
│  2. Compare passwords   │
│  3. Generate JWT        │
└──────┬──────────────────┘
       │
       │ 2. Return token
       │    { user, token }
       ↓
┌─────────────┐
│   Client    │
│ Store token │
└──────┬──────┘
       │
       │ 3. All subsequent requests
       │    Authorization: Bearer <token>
       ↓
┌─────────────────────────┐
│  Auth Middleware        │
│  1. Extract token       │
│  2. Verify token        │
│  3. Get user from DB    │
│  4. Attach to req.user  │
└──────┬──────────────────┘
       │
       │ 4. Request proceeds
       ↓
┌─────────────────────────┐
│  Protected Controller   │
│  Access req.user        │
└─────────────────────────┘
```

## 🛡️ Security Layers

### 1. **Authentication**
- JWT tokens with expiry
- Password hashing with bcrypt (10 rounds)
- Token verification on protected routes

### 2. **Authorization**
- Role-based access (USER, ADMIN)
- Resource ownership checks
- Middleware-based protection

### 3. **Validation**
- Zod schema validation
- Type safety
- Input sanitization

### 4. **Error Handling**
- Centralized error handler
- Prisma error transformation
- Environment-aware error details

### 5. **CORS**
- Configured frontend URL
- Credentials support
- Secure cross-origin requests

## 📊 Database Schema Design

### Entity Relationship Diagram

```
┌─────────────────┐
│      User       │
│─────────────────│
│ id (PK)         │
│ name            │
│ email (unique)  │
│ password (hash) │
│ role            │
│ createdAt       │
│ updatedAt       │
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────▼─────────────┐
    │                  │
┌───▼──────────┐  ┌───▼──────────┐
│     News     │  │   Comment    │
│──────────────│  │──────────────│
│ id (PK)      │  │ id (PK)      │
│ title        │  │ text         │
│ body         │  │ newsId (FK)  │
│ authorId (FK)│  │ userId (FK)  │
│ createdAt    │  │ createdAt    │
│ updatedAt    │  │ updatedAt    │
└──────┬───────┘  └──────────────┘
       │
       │ 1:N
       │
       └─────────────┐
                     │
                 (comments)
```

### Cascading Deletes
- Delete User → Deletes all their News and Comments
- Delete News → Deletes all its Comments
- Maintains referential integrity

### Indexes
- `users.email` - Unique index for login
- `news.authorId` - Index for author queries
- `comments.newsId` - Index for news comments
- `comments.userId` - Index for user comments

## 🔧 Middleware Pipeline

### Public Route (e.g., GET /api/news)
```
Request → CORS → Body Parser → Route Handler → Response
```

### Protected Route (e.g., POST /api/news)
```
Request → CORS → Body Parser → Auth Middleware → Validation → Controller → Response
```

### Admin Route (e.g., DELETE /api/users/:id)
```
Request → CORS → Body Parser → Auth → Admin Check → Controller → Response
```

## 🎯 Design Principles

### 1. **Separation of Concerns**
- Routes: Endpoint definition only
- Controllers: Business logic
- Middleware: Cross-cutting concerns
- Validators: Input validation
- Utils: Reusable functions

### 2. **Single Responsibility**
- Each file has one clear purpose
- Controllers handle one resource
- Middleware performs one task

### 3. **DRY (Don't Repeat Yourself)**
- Reusable middleware
- Common utilities (ApiError, ApiResponse)
- Centralized error handling

### 4. **SOLID Principles**
- Dependency injection (Prisma client)
- Interface segregation (validators)
- Open/closed (middleware chain)

### 5. **Error Handling Strategy**
- Try-catch in controllers (via asyncHandler)
- Custom ApiError class
- Global error handler
- Environment-aware responses

## 🚀 Performance Optimizations

### 1. **Database**
- Prisma connection pooling
- Indexed foreign keys
- Efficient queries with `select` and `include`
- Pagination for large datasets

### 2. **API**
- Express middleware caching
- JSON response compression (can be added)
- Rate limiting (can be added)

### 3. **Security**
- Password hashing (not on every request)
- Token verification (cached user data)
- Validation before database queries

## 📈 Scalability Considerations

### Current Architecture Supports:
- ✅ Horizontal scaling (stateless API)
- ✅ Database connection pooling
- ✅ JWT-based auth (no session storage)
- ✅ Modular code structure

### Future Enhancements:
- 🔄 Redis caching layer
- 🔄 Rate limiting
- 🔄 File upload (images)
- 🔄 WebSocket for real-time features
- 🔄 Background jobs (email, notifications)
- 🔄 Microservices separation

## 🧪 Testing Strategy

### Unit Tests (Can be added)
- Controller logic
- Utility functions
- Validation schemas

### Integration Tests (Can be added)
- API endpoints
- Database operations
- Authentication flow

### Test Framework Recommendations:
- Jest
- Supertest
- Prisma test database

## 📦 Deployment Architecture

```
┌─────────────────┐
│   Frontend      │ (Vercel/Netlify)
│   (React)       │
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼─────────┐
│   Backend API    │ (Railway/Render/Heroku)
│   (Express)      │
└────────┬─────────┘
         │
         │ SSL
         │
┌────────▼─────────┐
│   PostgreSQL     │ (Supabase/Neon/Railway)
│   (Database)     │
└──────────────────┘
```

## 🔍 Monitoring & Logging

### Current Setup:
- Console.log for errors
- Prisma query logging in dev

### Production Recommendations:
- Winston/Morgan for logging
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Database query analytics

## 🛠️ Development Workflow

### 1. **Adding New Feature**
```
1. Define Prisma schema (if database changes needed)
2. Create migration
3. Create validator (Zod schema)
4. Create controller (business logic)
5. Create route (endpoint definition)
6. Add middleware (if needed)
7. Test with curl/Postman
8. Update documentation
```

### 2. **Database Changes**
```
1. Edit schema.prisma
2. Run: npm run prisma:migrate
3. Generate client: npm run prisma:generate
4. Update seed.js if needed
```

### 3. **Adding Validation**
```
1. Create Zod schema in validators/
2. Import in route file
3. Apply with validate() middleware
```

## 📚 Key Technologies Explained

### **Prisma ORM**
- Type-safe database client
- Auto-generated types
- Migration system
- Query builder

### **Express.js**
- Minimalist web framework
- Middleware-based
- Routing system
- Large ecosystem

### **Zod**
- TypeScript-first validation
- Runtime type checking
- Composable schemas
- Great error messages

### **JWT**
- Stateless authentication
- Signed tokens
- Payload encryption
- Expiry handling

### **bcryptjs**
- Password hashing
- Salt generation
- Secure comparison
- One-way encryption

---

**This architecture provides a solid foundation for a scalable, maintainable, and secure news portal backend.**
