# News Portal API - Quick Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Register
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

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Update Profile
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

## 📰 News Endpoints

### Get All News (Public)
```http
GET /api/news?page=1&limit=10&search=startup
```
**Query params:** `page`, `limit`, `search` (all optional)

### Get Single News (Public)
```http
GET /api/news/:id
```

### Get News by Author (Public)
```http
GET /api/news/author/:authorId
```

### Create News (Protected)
```http
POST /api/news
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "News Title Here",
  "body": "Full article content..."
}
```

### Update News (Protected - Author/Admin only)
```http
PUT /api/news/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "body": "Updated content"
}
```

### Delete News (Protected - Author/Admin only)
```http
DELETE /api/news/:id
Authorization: Bearer <token>
```

---

## 💬 Comment Endpoints

### Get Comments by News ID (Public)
```http
GET /api/comments/news/:newsId
```

### Get Comments by User ID (Public)
```http
GET /api/comments/user/:userId
```

### Create Comment (Protected)
```http
POST /api/comments/news/:newsId
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "This is a great article!"
}
```

### Update Comment (Protected - Author/Admin only)
```http
PUT /api/comments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Updated comment text"
}
```

### Delete Comment (Protected - Author/Admin only)
```http
DELETE /api/comments/:id
Authorization: Bearer <token>
```

---

## 📊 Response Format

### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message"
}
```

---

## 🚦 Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

---

## 🧪 Test Users

After running seed:

```
Email: alice@example.com     | Password: password123 | Role: USER
Email: karim@example.com     | Password: password123 | Role: USER
Email: nusrat@example.com    | Password: password123 | Role: ADMIN
Email: mrinmoy@gmail.com     | Password: password123 | Role: USER
```

---

## 📦 Pagination Example

**Request:**
```http
GET /api/news?page=2&limit=5
```

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "news": [...],
    "pagination": {
      "page": 2,
      "limit": 5,
      "total": 25,
      "pages": 5
    }
  }
}
```

---

## 🔍 Search Example

**Request:**
```http
GET /api/news?search=technology
```

Searches in both `title` and `body` fields (case-insensitive).

---

## 🛡️ Authorization Rules

### News
- **Create**: Authenticated users only
- **Read**: Public
- **Update**: Author or Admin only
- **Delete**: Author or Admin only

### Comments
- **Create**: Authenticated users only
- **Read**: Public
- **Update**: Comment author or Admin only
- **Delete**: Comment author or Admin only

---

## 💡 Tips

1. Always include `Content-Type: application/json` header for POST/PUT requests
2. Store JWT token after login for subsequent requests
3. Token expires after 7 days (configurable)
4. Use pagination for large datasets
5. Search is case-insensitive
