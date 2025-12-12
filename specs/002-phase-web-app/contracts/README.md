# API Contracts

**Phase**: Phase II - Full-Stack Web Application  
**Date**: 2025-12-07  
**Status**: Complete

## Overview

This directory contains API contracts for Phase II. Contracts define the interface between frontend and backend, enabling parallel development and automated testing.

---

## Contract Files

### 1. `openapi.yaml`
Complete OpenAPI 3.0 specification for all 8 REST endpoints. Used for:
- API documentation generation
- Client SDK generation (future)
- Contract testing (Pact, Dredd)
- Swagger UI interactive documentation

### 2. `request-schemas.json`
JSON Schema definitions for all request bodies. Used for:
- Frontend form validation
- Backend Pydantic model generation
- Testing request validation

### 3. `response-schemas.json`
JSON Schema definitions for all response bodies. Used for:
- Frontend TypeScript type generation
- Backend response validation
- Testing response format

---

## Contract Testing Strategy

### Backend Contract Tests
```python
# tests/contract/test_api_contract.py
def test_create_task_contract():
    """Verify POST /api/{user_id}/tasks matches contract."""
    response = client.post(
        f"/api/{user_id}/tasks",
        json={"title": "Test", "description": "Test task"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    assert validate_against_schema(response.json(), "TaskDTO")
```

### Frontend Contract Tests
```typescript
// tests/contract/api.test.ts
test('createTask matches contract', async () => {
  const response = await api.createTask({ title: 'Test' });
  expect(response).toMatchSchema(TaskDTOSchema);
});
```

---

## Schema Validation Tools

**Backend**: JSON Schema validation with `jsonschema` library  
**Frontend**: JSON Schema validation with `ajv` library  
**Documentation**: Swagger UI at `/docs` (FastAPI auto-generated)

---

## See Also

- `api/rest-endpoints.md` - Detailed endpoint documentation with examples
- `data-model.md` - Entity definitions and validation rules
- `openapi.yaml` - Machine-readable API specification
