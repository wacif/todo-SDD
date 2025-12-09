"""Integration tests for authentication routes."""

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
    session = Session(bind=connection)

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


def test_signup_success(client):
    """Test successful user signup."""
    response = client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "name": "Test User",
            "password": "SecurePass123!",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test User"
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_signup_duplicate_email(client):
    """Test signup with duplicate email."""
    # First signup
    client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "name": "Test User",
            "password": "SecurePass123!",
        },
    )

    # Second signup with same email
    response = client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "name": "Another User",
            "password": "AnotherPass123!",
        },
    )

    assert response.status_code == 409
    assert "already exists" in response.json()["detail"]


def test_signup_weak_password(client):
    """Test signup with weak password."""
    response = client.post(
        "/api/auth/signup",
        json={"email": "test@example.com", "name": "Test User", "password": "weak"},
    )

    # Pydantic validation for min_length=8 returns 422
    assert response.status_code == 422


def test_signup_invalid_email(client):
    """Test signup with invalid email."""
    response = client.post(
        "/api/auth/signup",
        json={"email": "invalid-email", "name": "Test User", "password": "SecurePass123!"},
    )

    assert response.status_code == 422  # Pydantic validation error


def test_signin_success(client):
    """Test successful user signin."""
    # First create a user
    client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "name": "Test User",
            "password": "SecurePass123!",
        },
    )

    # Now sign in
    response = client.post(
        "/api/auth/signin",
        json={"email": "test@example.com", "password": "SecurePass123!"},
    )

    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["name"] == "Test User"
    assert "expires_at" in data


def test_signin_wrong_password(client):
    """Test signin with incorrect password."""
    # First create a user
    client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "name": "Test User",
            "password": "SecurePass123!",
        },
    )

    # Try to sign in with wrong password
    response = client.post(
        "/api/auth/signin",
        json={"email": "test@example.com", "password": "WrongPassword123!"},
    )

    assert response.status_code == 401
    assert "incorrect" in response.json()["detail"].lower()


def test_signin_nonexistent_email(client):
    """Test signin with email that doesn't exist."""
    response = client.post(
        "/api/auth/signin",
        json={"email": "nonexistent@example.com", "password": "SomePass123!"},
    )

    assert response.status_code == 401
    assert "incorrect" in response.json()["detail"].lower()
