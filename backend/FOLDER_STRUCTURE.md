```
backend/
│
├── .env                          # Environment variables (DO NOT COMMIT)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts
│
├── README.md                     # Full documentation
├── API_REFERENCE.md              # Quick API reference
├── ARCHITECTURE.md               # Architecture overview
│
├── prisma/
│   ├── schema.prisma            # Database schema definition
│   └── seed.js                  # Database seeding script
│
└── src/
    │
    ├── server.js                # Application entry point
    │
    ├── config/
    │   └── database.js          # Prisma client configuration
    │
    ├── controllers/             # Business logic layer
    │   ├── auth.controller.js   # Authentication handlers
    │   ├── news.controller.js   # News CRUD operations
    │   └── comment.controller.js # Comment operations
    │
    ├── routes/                  # API endpoint definitions
    │   ├── auth.routes.js       # /api/auth/*
    │   ├── news.routes.js       # /api/news/*
    │   └── comment.routes.js    # /api/comments/*
    │
    ├── middleware/              # Express middleware
    │   ├── auth.js              # JWT verification & authorization
    │   ├── errorHandler.js      # Global error handler
    │   ├── notFound.js          # 404 handler
    │   └── validate.js          # Zod validation wrapper
    │
    ├── validators/              # Input validation schemas
    │   ├── auth.validator.js    # Register & login validation
    │   ├── news.validator.js    # News CRUD validation
    │   └── comment.validator.js # Comment validation
    │
    └── utils/                   # Utility functions
        ├── ApiError.js          # Custom error class
        ├── ApiResponse.js       # Standard response wrapper
        └── jwt.js               # JWT token utilities
```

## File Purposes

### Root Level
- **`.env`**: Your actual environment variables (database credentials, secrets)
- **`.env.example`**: Template showing what variables are needed
- **`.gitignore`**: Prevents committing sensitive files
- **`package.json`**: Project metadata, dependencies, scripts

### Documentation
- **`README.md`**: Complete setup guide and API documentation
- **`API_REFERENCE.md`**: Quick reference for all endpoints
- **`ARCHITECTURE.md`**: System design and architecture patterns

### Database (`prisma/`)
- **`schema.prisma`**: Defines database tables and relations
- **`seed.js`**: Populates database with sample data

### Application (`src/`)

#### Entry Point
- **`server.js`**: Starts Express server, configures middleware, routes

#### Configuration (`config/`)
- **`database.js`**: Prisma client instance for database access

#### Controllers (`controllers/`)
- **`auth.controller.js`**: Register, login, get user profile
- **`news.controller.js`**: Create, read, update, delete news
- **`comment.controller.js`**: Create, read, update, delete comments

#### Routes (`routes/`)
- **`auth.routes.js`**: Maps URLs to auth controllers
- **`news.routes.js`**: Maps URLs to news controllers
- **`comment.routes.js`**: Maps URLs to comment controllers

#### Middleware (`middleware/`)
- **`auth.js`**: Protects routes, verifies JWT tokens
- **`errorHandler.js`**: Catches all errors, formats responses
- **`notFound.js`**: Handles 404 errors
- **`validate.js`**: Validates request data with Zod

#### Validators (`validators/`)
- **`auth.validator.js`**: Zod schemas for register/login
- **`news.validator.js`**: Zod schemas for news operations
- **`comment.validator.js`**: Zod schemas for comments

#### Utilities (`utils/`)
- **`ApiError.js`**: Custom error class with status codes
- **`ApiResponse.js`**: Standard response format
- **`jwt.js`**: Generate and verify JWT tokens

## File Count Summary
- **Total files**: ~25 files
- **Controllers**: 3 files
- **Routes**: 3 files
- **Middleware**: 4 files
- **Validators**: 3 files
- **Utils**: 3 files
- **Config**: 1 file
- **Entry point**: 1 file
- **Database**: 2 files
- **Documentation**: 3 files
- **Config files**: 4 files
