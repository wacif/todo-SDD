"""Integration tests for task routes."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

from src.api.main import app
from src.infrastructure.persistence.database import get_session


@pytest.fixture(scope="function")
def engine():
    """Create in-memory SQLite database engine for testing."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    return engine


@pytest.fixture(scope="function")
def session(engine):
    """Create database session for testing."""
    connection = engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection, expire_on_commit=False)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(session):
    """Create test client with database dependency override."""

    def get_test_session():
        return session

    app.dependency_overrides[get_session] = get_test_session
    client = TestClient(app)
    yield client
    app.dependency_overrides = {}


@pytest.fixture
def auth_user(client):
    """Create and authenticate a test user."""
    # Signup
    signup_response = client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "name": "Test User",
            "password": "SecurePass123!",
        },
    )
    assert signup_response.status_code == 201
    data = signup_response.json()
    return {"user_id": data["user_id"], "token": data["access_token"]}


def test_create_task_success(client, auth_user):
    """Test successful task creation."""
    response = client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "Buy groceries", "description": "Milk, eggs, bread"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Buy groceries"
    assert data["description"] == "Milk, eggs, bread"
    assert data["completed"] is False
    assert data["user_id"] == auth_user["user_id"]
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_create_task_without_jwt(client, auth_user):
    """Test task creation without JWT token."""
    response = client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "Buy groceries"},
    )

    assert response.status_code == 401  # HTTPBearer returns 401 for missing auth


def test_create_task_mismatched_user_id(client, auth_user):
    """Test task creation with mismatched user_id in path."""
    # Try to create task for different user
    fake_user_id = "550e8400-e29b-41d4-a716-446655440000"

    response = client.post(
        f"/api/{fake_user_id}/tasks",
        json={"title": "Buy groceries"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )

    assert response.status_code == 403
    assert "Cannot access or modify another user's tasks" in response.json()["detail"]


def test_create_task_empty_title(client, auth_user):
    """Test task creation with empty title."""
    response = client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "", "description": "Some description"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )

    assert response.status_code == 422  # Pydantic validation error


def test_create_task_title_too_long(client, auth_user):
    """Test task creation with title exceeding 200 characters."""
    long_title = "a" * 201

    response = client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": long_title},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )

    assert response.status_code == 422  # Pydantic validation error


def test_create_task_description_too_long(client, auth_user):
    """Test task creation with description exceeding 1000 characters."""
    long_description = "a" * 1001

    response = client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "Valid title", "description": long_description},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )

    assert response.status_code == 422  # Pydantic validation error


def test_list_tasks_empty(client, auth_user):
    """Test listing tasks when user has no tasks."""
    response = client.get(
        f"/api/{auth_user['user_id']}/tasks",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["tasks"] == []
    assert data["total"] == 0


def test_list_tasks_with_data(client, auth_user):
    """Test listing tasks when user has tasks."""
    # Create 3 tasks
    for i in range(3):
        client.post(
            f"/api/{auth_user['user_id']}/tasks",
            json={"title": f"Task {i + 1}", "description": f"Description {i + 1}"},
            headers={"Authorization": f"Bearer {auth_user['token']}"},
        )

    # List tasks
    response = client.get(
        f"/api/{auth_user['user_id']}/tasks",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data["tasks"]) == 3
    assert data["total"] == 3
    assert all(task["user_id"] == auth_user["user_id"] for task in data["tasks"])


def test_list_tasks_without_jwt(client, auth_user):
    """Test listing tasks without JWT token."""
    response = client.get(f"/api/{auth_user['user_id']}/tasks")

    assert response.status_code == 401  # HTTPBearer returns 401 for missing auth


def test_list_tasks_mismatched_user_id(client, auth_user):
    """Test listing tasks with mismatched user_id in path."""
    fake_user_id = "550e8400-e29b-41d4-a716-446655440000"

    response = client.get(
        f"/api/{fake_user_id}/tasks",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )

    assert response.status_code == 403
    assert "Cannot access or modify another user's tasks" in response.json()["detail"]


def test_user_isolation(client, auth_user):
    """Test that users can only see their own tasks."""
    # Create task for first user
    response_create1 = client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "User 1 task"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    if response_create1.status_code != 201:
        print(f"Error creating task for user 1: {response_create1.json()}")
    assert response_create1.status_code == 201

    # Create second user
    signup_response = client.post(
        "/api/auth/signup",
        json={
            "email": "user2@example.com",
            "name": "User 2",
            "password": "SecurePass123!",
        },
    )
    user2 = {"user_id": signup_response.json()["user_id"], "token": signup_response.json()["access_token"]}

    # Create task for second user
    response_create2 = client.post(
        f"/api/{user2['user_id']}/tasks",
        json={"title": "User 2 task"},
        headers={"Authorization": f"Bearer {user2['token']}"},
    )
    assert response_create2.status_code == 201

    # User 1 should only see their own task
    response1 = client.get(
        f"/api/{auth_user['user_id']}/tasks",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert response1.status_code == 200
    data1 = response1.json()
    assert len(data1["tasks"]) == 1
    assert data1["tasks"][0]["title"] == "User 1 task"

    # User 2 should only see their own task
    response2 = client.get(
        f"/api/{user2['user_id']}/tasks",
        headers={"Authorization": f"Bearer {user2['token']}"},
    )
    assert response2.status_code == 200
    data2 = response2.json()
    assert len(data2["tasks"]) == 1
    assert data2["tasks"][0]["title"] == "User 2 task"
