# REST API Endpoints Specification

**Version**: 2.0  
**Base URL**: `http://localhost:8000` (dev), `https://api.example.com` (prod)  
**Protocol**: HTTP/1.1 with JSON  
**Authentication**: JWT Bearer Token (except auth endpoints)  
**Created**: 2025-12-07

## API Overview

The REST API provides 8 endpoints for authentication and task management:
- 2 Authentication endpoints (signup, signin)
- 6 Task management endpoints (CRUD + complete)

All endpoints except authentication require JWT token in `Authorization` header.

## Global Headers

### Request Headers

```http
Authorization: Bearer <jwt_token>  # Required for all non-auth endpoints
Content-Type: application/json     # For POST/PUT/PATCH requests
Accept: application/json            # Expected response format
```

### Response Headers

```http
Content-Type: application/json
X-Request-ID: <uuid>               # For request tracking
X-RateLimit-Limit: 100             # Requests per minute
X-RateLimit-Remaining: 95          # Remaining requests
```

## Global Error Responses

All endpoints may return these error responses:

### 401 Unauthorized
```json
{
  "error": "Authentication required",
  "message": "Missing or invalid JWT token",
  "status": 401
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred",
  "status": 500
}
```

---

## Authentication Endpoints

### POST /api/auth/signup

Register a new user account.

**Authentication**: Not required

**Request Body**:
```json
{
  "email": "sarah@example.com",
  "name": "Sarah Johnson",
  "password": "SecurePass123!"
}
```

**Request Schema**:
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| email | string | Yes | Valid email format, max 255 chars | User email address |
| name | string | Yes | 2-100 chars | User display name |
| password | string | Yes | Min 8 chars, 1 uppercase, 1 lowercase, 1 digit | User password |

**Success Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "sarah@example.com",
  "name": "Sarah Johnson",
  "created_at": "2025-12-07T10:00:00Z"
}
```

**Response Schema**:
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique user identifier |
| email | string | User email address |
| name | string | User display name |
| created_at | ISO 8601 | Account creation timestamp |

**Error Responses**:

**400 Bad Request** - Validation error:
```json
{
  "error": "Validation error",
  "message": "Password must be at least 8 characters",
  "field": "password",
  "status": 400
}
```

**409 Conflict** - Email already exists:
```json
{
  "error": "Email already exists",
  "message": "An account with this email already exists",
  "status": 409
}
```

**Example cURL**:
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah@example.com",
    "name": "Sarah Johnson",
    "password": "SecurePass123!"
  }'
```

---

### POST /api/auth/signin

Authenticate user and receive JWT token.

**Authentication**: Not required

**Request Body**:
```json
{
  "email": "sarah@example.com",
  "password": "SecurePass123!"
}
```

**Request Schema**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User email address |
| password | string | Yes | User password |

**Success Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "sarah@example.com",
    "name": "Sarah Johnson"
  },
  "expires_at": "2025-12-14T10:00:00Z"
}
```

**Response Schema**:
| Field | Type | Description |
|-------|------|-------------|
| token | string | JWT token for authentication |
| user.id | UUID | User identifier |
| user.email | string | User email |
| user.name | string | User display name |
| expires_at | ISO 8601 | Token expiration timestamp (7 days) |

**Error Responses**:

**401 Unauthorized** - Invalid credentials:
```json
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect",
  "status": 401
}
```

**Example cURL**:
```bash
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah@example.com",
    "password": "SecurePass123!"
  }'
```

---

## Task Endpoints

All task endpoints require JWT authentication and operate on the authenticated user's data only.

### GET /api/{user_id}/tasks

List all tasks for the authenticated user.

**Authentication**: Required (JWT)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | UUID | User identifier (must match JWT token) |

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| status | string | No | all | Filter: "all", "pending", "completed" |
| sort | string | No | created | Sort: "created", "title", "updated" |
| order | string | No | desc | Order: "asc", "desc" |
| limit | integer | No | 100 | Max results (1-1000) |
| offset | integer | No | 0 | Pagination offset |

**Success Response (200 OK)**:
```json
{
  "tasks": [
    {
      "id": 5,
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "created_at": "2025-12-07T10:00:00Z",
      "updated_at": "2025-12-07T10:00:00Z"
    },
    {
      "id": 1,
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Finish report",
      "description": "Q4 financial report",
      "completed": true,
      "created_at": "2025-12-06T15:00:00Z",
      "updated_at": "2025-12-07T09:00:00Z"
    }
  ],
  "total": 2,
  "limit": 100,
  "offset": 0
}
```

**Response Schema**:
| Field | Type | Description |
|-------|------|-------------|
| tasks | array | Array of task objects |
| total | integer | Total number of tasks matching filters |
| limit | integer | Current limit applied |
| offset | integer | Current offset applied |

**Error Responses**:

**403 Forbidden** - user_id mismatch:
```json
{
  "error": "Access denied",
  "message": "You can only access your own tasks",
  "status": 403
}
```

**Example cURL**:
```bash
curl -X GET "http://localhost:8000/api/550e8400-e29b-41d4-a716-446655440000/tasks?status=pending" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### POST /api/{user_id}/tasks

Create a new task for the authenticated user.

**Authentication**: Required (JWT)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | UUID | User identifier (must match JWT token) |

**Request Body**:
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

**Request Schema**:
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| title | string | Yes | 1-200 chars | Task title |
| description | string | No | 0-1000 chars | Task description |

**Success Response (201 Created)**:
```json
{
  "id": 6,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2025-12-07T15:30:00Z",
  "updated_at": "2025-12-07T15:30:00Z"
}
```

**Error Responses**:

**400 Bad Request** - Validation error:
```json
{
  "error": "Validation error",
  "message": "Title is required",
  "field": "title",
  "status": 400
}
```

**403 Forbidden** - user_id mismatch:
```json
{
  "error": "Access denied",
  "message": "You can only create tasks for yourself",
  "status": 403
}
```

**Example cURL**:
```bash
curl -X POST http://localhost:8000/api/550e8400-e29b-41d4-a716-446655440000/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread"
  }'
```

---

### GET /api/{user_id}/tasks/{id}

Get details of a specific task.

**Authentication**: Required (JWT)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | UUID | User identifier (must match JWT token) |
| id | integer | Task identifier |

**Success Response (200 OK)**:
```json
{
  "id": 5,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2025-12-07T10:00:00Z",
  "updated_at": "2025-12-07T10:00:00Z"
}
```

**Error Responses**:

**403 Forbidden** - Task belongs to another user:
```json
{
  "error": "Access denied",
  "message": "You can only access your own tasks",
  "status": 403
}
```

**404 Not Found** - Task doesn't exist:
```json
{
  "error": "Task not found",
  "message": "Task with id 999 does not exist",
  "status": 404
}
```

**Example cURL**:
```bash
curl -X GET http://localhost:8000/api/550e8400-e29b-41d4-a716-446655440000/tasks/5 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### PUT /api/{user_id}/tasks/{id}

Update an existing task.

**Authentication**: Required (JWT)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | UUID | User identifier (must match JWT token) |
| id | integer | Task identifier |

**Request Body**:
```json
{
  "title": "Buy groceries and supplies",
  "description": "Milk, eggs, bread, cheese, cleaning supplies"
}
```

**Request Schema**:
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| title | string | Yes | 1-200 chars | Updated task title |
| description | string | No | 0-1000 chars | Updated task description |

**Success Response (200 OK)**:
```json
{
  "id": 5,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries and supplies",
  "description": "Milk, eggs, bread, cheese, cleaning supplies",
  "completed": false,
  "created_at": "2025-12-07T10:00:00Z",
  "updated_at": "2025-12-07T16:00:00Z"
}
```

**Error Responses**:

**400 Bad Request** - Validation error:
```json
{
  "error": "Validation error",
  "message": "Title cannot be empty",
  "field": "title",
  "status": 400
}
```

**403 Forbidden** - Task belongs to another user:
```json
{
  "error": "Access denied",
  "message": "You can only update your own tasks",
  "status": 403
}
```

**404 Not Found** - Task doesn't exist:
```json
{
  "error": "Task not found",
  "message": "Task with id 999 does not exist",
  "status": 404
}
```

**Example cURL**:
```bash
curl -X PUT http://localhost:8000/api/550e8400-e29b-41d4-a716-446655440000/tasks/5 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries and supplies",
    "description": "Milk, eggs, bread, cheese, cleaning supplies"
  }'
```

---

### PATCH /api/{user_id}/tasks/{id}/complete

Toggle task completion status.

**Authentication**: Required (JWT)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | UUID | User identifier (must match JWT token) |
| id | integer | Task identifier |

**Request Body**: None

**Success Response (200 OK)**:
```json
{
  "id": 5,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": true,
  "created_at": "2025-12-07T10:00:00Z",
  "updated_at": "2025-12-07T16:30:00Z"
}
```

**Error Responses**:

**403 Forbidden** - Task belongs to another user:
```json
{
  "error": "Access denied",
  "message": "You can only modify your own tasks",
  "status": 403
}
```

**404 Not Found** - Task doesn't exist:
```json
{
  "error": "Task not found",
  "message": "Task with id 999 does not exist",
  "status": 404
}
```

**Example cURL**:
```bash
curl -X PATCH http://localhost:8000/api/550e8400-e29b-41d4-a716-446655440000/tasks/5/complete \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### DELETE /api/{user_id}/tasks/{id}

Permanently delete a task.

**Authentication**: Required (JWT)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | UUID | User identifier (must match JWT token) |
| id | integer | Task identifier |

**Success Response (204 No Content)**:
```
(No response body)
```

**Error Responses**:

**403 Forbidden** - Task belongs to another user:
```json
{
  "error": "Access denied",
  "message": "You can only delete your own tasks",
  "status": 403
}
```

**404 Not Found** - Task doesn't exist:
```json
{
  "error": "Task not found",
  "message": "Task with id 999 does not exist",
  "status": 404
}
```

**Example cURL**:
```bash
curl -X DELETE http://localhost:8000/api/550e8400-e29b-41d4-a716-446655440000/tasks/5 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Rate Limiting

All endpoints are rate-limited to prevent abuse:

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Authentication | 5 requests | 15 minutes |
| Task Operations | 100 requests | 1 minute |
| Read Operations | 200 requests | 1 minute |

**Rate Limit Exceeded (429)**:
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again in 45 seconds",
  "retry_after": 45,
  "status": 429
}
```

---

## CORS Configuration

**Allowed Origins** (Development):
- `http://localhost:3000`
- `http://localhost:3001`

**Allowed Origins** (Production):
- `https://yourdomain.com`
- `https://www.yourdomain.com`

**Allowed Methods**:
- GET, POST, PUT, PATCH, DELETE, OPTIONS

**Allowed Headers**:
- Authorization, Content-Type, Accept

**Credentials**: Allowed

---

## OpenAPI/Swagger Documentation

Interactive API documentation available at:
- Development: `http://localhost:8000/docs`
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

---

## Testing the API

### Postman Collection

Import the provided Postman collection at `docs/postman/Phase-II-API.json`

### Test Sequence

1. **Signup**: POST /api/auth/signup
2. **Signin**: POST /api/auth/signin → Save token
3. **Create Task**: POST /api/{user_id}/tasks (with token)
4. **List Tasks**: GET /api/{user_id}/tasks (with token)
5. **Get Task**: GET /api/{user_id}/tasks/{id} (with token)
6. **Update Task**: PUT /api/{user_id}/tasks/{id} (with token)
7. **Mark Complete**: PATCH /api/{user_id}/tasks/{id}/complete (with token)
8. **Delete Task**: DELETE /api/{user_id}/tasks/{id} (with token)

### Integration Tests

Located in `backend/tests/integration/test_api_endpoints.py`

Run with:
```bash
pytest backend/tests/integration/ -v
```

---

## Security Considerations

### JWT Token Security

- Token stored in HTTP-only cookies (frontend)
- Token expires after 7 days
- No token refresh implemented (user must re-authenticate)
- Tokens invalidated on password change

### Input Validation

- All inputs sanitized before database queries
- SQLModel provides SQL injection protection
- Maximum field lengths enforced
- Email format validation using RFC 5322

### Authorization

- Every request validates user_id matches JWT token
- Database queries filtered by authenticated user_id
- No cross-user data access possible

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Response Time (p50) | < 100ms | Endpoint monitoring |
| Response Time (p95) | < 500ms | Endpoint monitoring |
| Response Time (p99) | < 1000ms | Endpoint monitoring |
| Throughput | > 1000 req/s | Load testing |
| Error Rate | < 0.1% | Error tracking |

---

**Status**: ✅ API Specification Complete  
**OpenAPI Version**: 3.1.0  
**Last Updated**: 2025-12-07
