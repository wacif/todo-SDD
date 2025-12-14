# API Documentation

## Base URL
- Development: `http://localhost:8000`
- Production: TBD

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Health Check

#### GET /health
Check API health status.

**Response:**
```json
{
  "status": "healthy"
}
```

---

### Authentication

#### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token_string"
}
```

**Errors:**
- `400 Bad Request`: Invalid email or password format
- `409 Conflict`: Email already registered

---

#### POST /api/auth/login
Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token_string"
}
```

**Errors:**
- `401 Unauthorized`: Invalid credentials
- `400 Bad Request`: Missing required fields

---

### Tasks

#### GET /api/tasks
Get all tasks for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (`pending`, `completed`)
- `limit` (optional): Number of results (default: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:** `200 OK`
```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Complete project",
      "description": "Finish DoBot",
      "completed": false,
      "createdAt": "2025-12-12T10:00:00Z",
      "updatedAt": "2025-12-12T10:00:00Z"
    }
  ],
  "total": 1
}
```

**Errors:**
- `401 Unauthorized`: Missing or invalid token

---

#### POST /api/tasks
Create a new task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New task",
  "description": "Optional description"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "title": "New task",
  "description": "Optional description",
  "completed": false,
  "createdAt": "2025-12-12T10:00:00Z",
  "updatedAt": "2025-12-12T10:00:00Z"
}
```

**Errors:**
- `400 Bad Request`: Missing title or invalid format
- `401 Unauthorized`: Missing or invalid token

---

#### PATCH /api/tasks/:id
Update an existing task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "title": "Updated title",
  "description": "Updated description",
  "completed": true,
  "createdAt": "2025-12-12T10:00:00Z",
  "updatedAt": "2025-12-12T11:00:00Z"
}
```

**Errors:**
- `404 Not Found`: Task not found
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Task belongs to another user

---

#### DELETE /api/tasks/:id
Delete a task.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `204 No Content`

**Errors:**
- `404 Not Found`: Task not found
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Task belongs to another user

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1702382400
```

## Pagination

List endpoints support pagination:
- `limit`: Number of items per page (default: 100, max: 1000)
- `offset`: Number of items to skip (default: 0)

Response includes:
```json
{
  "data": [],
  "pagination": {
    "total": 150,
    "limit": 100,
    "offset": 0,
    "hasMore": true
  }
}
```
