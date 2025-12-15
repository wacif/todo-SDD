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


def test_create_task_with_priority_and_tags(client, auth_user):
    """Phase II: create task with priority and tags/categories."""
    response = client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={
            "title": "Pay invoices",
            "description": "Before Friday",
            "priority": "high",
            "tags": ["work", "finance"],
        },
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )

    assert response.status_code == 201
    data = response.json()
    assert data["priority"] == "high"
    assert set(data["tags"]) == {"work", "finance"}


def test_list_tasks_filter_by_status_completed(client, auth_user):
    """Phase II: filter tasks by completion status."""
    # Create two tasks
    t1 = client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "Task A"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    ).json()
    t2 = client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "Task B"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    ).json()

    # Mark Task A complete
    resp_toggle = client.patch(
        f"/api/{auth_user['user_id']}/tasks/{t1['id']}/complete",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert resp_toggle.status_code == 200

    # Filter completed
    response = client.get(
        f"/api/{auth_user['user_id']}/tasks?status=completed",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert all(t["completed"] is True for t in data["tasks"])
    assert {t["id"] for t in data["tasks"]} == {t1["id"]}
    # Ensure incomplete task not returned
    assert t2["id"] not in {t["id"] for t in data["tasks"]}


def test_list_tasks_filter_by_priority(client, auth_user):
    """Phase II: filter tasks by priority."""
    client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "High task", "priority": "high"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "Low task", "priority": "low"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )

    response = client.get(
        f"/api/{auth_user['user_id']}/tasks?priority=high",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert all(t["priority"] == "high" for t in data["tasks"])


def test_list_tasks_filter_by_tag(client, auth_user):
    """Phase II: filter tasks by tag/category."""
    client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "Work thing", "tags": ["work"]},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "Home thing", "tags": ["home"]},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )

    response = client.get(
        f"/api/{auth_user['user_id']}/tasks?tag=work",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert all("work" in t["tags"] for t in data["tasks"])


def test_list_tasks_search_keyword(client, auth_user):
    """Phase II: search tasks by keyword in title/description."""
    client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "Buy milk", "description": "From store"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "Call mom", "description": "Weekend"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )

    response = client.get(
        f"/api/{auth_user['user_id']}/tasks?q=milk",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["tasks"]) == 1
    assert data["tasks"][0]["title"] == "Buy milk"


def test_list_tasks_sort_title_asc(client, auth_user):
    """Phase II: sort tasks by title alphabetically."""
    client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "Z task"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "A task"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )

    response = client.get(
        f"/api/{auth_user['user_id']}/tasks?sort=title&order=asc",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert response.status_code == 200
    titles = [t["title"] for t in response.json()["tasks"]]
    assert titles == sorted(titles)


def test_list_tasks_sort_priority_desc(client, auth_user):
    """Phase II: sort tasks by priority (high > medium > low)."""
    client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "Low", "priority": "low"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "High", "priority": "high"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "Medium", "priority": "medium"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )

    response = client.get(
        f"/api/{auth_user['user_id']}/tasks?sort=priority&order=desc",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert response.status_code == 200
    priorities = [t["priority"] for t in response.json()["tasks"]]
    assert priorities[:3] == ["high", "medium", "low"]


def test_list_tasks_pagination_default_20_and_load_more(client, auth_user):
    """Phase II scaling: list endpoint paginates with limit=20 and supports offset."""
    # Create 25 tasks
    for i in range(25):
        resp = client.post(
            f"/api/{auth_user['user_id']}/tasks",
            json={"title": f"Task {i}"},
            headers={"Authorization": f"Bearer {auth_user['token']}"},
        )
        assert resp.status_code == 201

    # Default request should return first 20
    resp_page1 = client.get(
        f"/api/{auth_user['user_id']}/tasks",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert resp_page1.status_code == 200
    data1 = resp_page1.json()
    assert len(data1["tasks"]) == 20
    assert data1["total"] == 25
    assert data1["has_more"] is True

    # Next page should return remaining 5
    resp_page2 = client.get(
        f"/api/{auth_user['user_id']}/tasks?limit=20&offset=20",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert resp_page2.status_code == 200
    data2 = resp_page2.json()
    assert len(data2["tasks"]) == 5
    assert data2["total"] == 25
    assert data2["has_more"] is False


def test_toggle_task_complete_success(client, auth_user):
    """Test successfully toggling task completion status."""
    # Create a task
    create_response = client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "Task to complete"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]
    assert create_response.json()["completed"] is False

    # Toggle to completed
    toggle_response = client.patch(
        f"/api/{auth_user['user_id']}/tasks/{task_id}/complete",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert toggle_response.status_code == 200
    assert toggle_response.json()["completed"] is True
    assert toggle_response.json()["id"] == task_id

    # Toggle back to incomplete
    toggle_response2 = client.patch(
        f"/api/{auth_user['user_id']}/tasks/{task_id}/complete",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert toggle_response2.status_code == 200
    assert toggle_response2.json()["completed"] is False


def test_toggle_task_complete_without_jwt(client, auth_user):
    """Test toggling task completion without JWT token."""
    response = client.patch(f"/api/{auth_user['user_id']}/tasks/1/complete")
    assert response.status_code == 401


def test_toggle_task_complete_mismatched_user_id(client, auth_user):
    """Test toggling task with mismatched user_id in path."""
    # Create a task first
    create_response = client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "My task"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    task_id = create_response.json()["id"]

    # Try to toggle with different user_id
    fake_user_id = "550e8400-e29b-41d4-a716-446655440000"
    response = client.patch(
        f"/api/{fake_user_id}/tasks/{task_id}/complete",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert response.status_code == 403


def test_toggle_task_complete_nonexistent_task(client, auth_user):
    """Test toggling a task that doesn't exist."""
    response = client.patch(
        f"/api/{auth_user['user_id']}/tasks/99999/complete",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert response.status_code == 404


def test_get_task_success(client, auth_user):
    """US-W6: get task by id returns full details."""
    create_response = client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={
            "title": "Read a book",
            "description": "Start with chapter 1",
            "priority": "low",
            "tags": ["personal"],
        },
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    response = client.get(
        f"/api/{auth_user['user_id']}/tasks/{task_id}",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == task_id
    assert data["user_id"] == auth_user["user_id"]
    assert data["title"] == "Read a book"
    assert data["description"] == "Start with chapter 1"
    assert data["priority"] == "low"
    assert data["tags"] == ["personal"]


def test_get_task_nonexistent_returns_404(client, auth_user):
    response = client.get(
        f"/api/{auth_user['user_id']}/tasks/99999",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert response.status_code == 404


def test_get_task_mismatched_user_id_returns_403(client, auth_user):
    create_response = client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "My task"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    task_id = create_response.json()["id"]

    fake_user_id = "550e8400-e29b-41d4-a716-446655440000"
    response = client.get(
        f"/api/{fake_user_id}/tasks/{task_id}",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert response.status_code == 403


def test_update_task_success_updates_fields_and_timestamp(client, auth_user):
    """US-W6: update task modifies fields and bumps updated_at."""
    create_response = client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "Draft", "description": "v1", "priority": "medium", "tags": ["work"]},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert create_response.status_code == 201
    created = create_response.json()
    task_id = created["id"]
    old_updated_at = created["updated_at"]

    update_response = client.put(
        f"/api/{auth_user['user_id']}/tasks/{task_id}",
        json={"title": "Final", "description": "v2", "priority": "high", "tags": ["work", "urgent"]},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert update_response.status_code == 200
    updated = update_response.json()
    assert updated["id"] == task_id
    assert updated["title"] == "Final"
    assert updated["description"] == "v2"
    assert updated["priority"] == "high"
    assert updated["tags"] == ["work", "urgent"]
    assert updated["updated_at"] != old_updated_at


def test_update_task_empty_title_returns_422(client, auth_user):
    create_response = client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "Valid"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    task_id = create_response.json()["id"]

    update_response = client.put(
        f"/api/{auth_user['user_id']}/tasks/{task_id}",
        json={"title": ""},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert update_response.status_code == 422


def test_update_task_nonexistent_returns_404(client, auth_user):
    response = client.put(
        f"/api/{auth_user['user_id']}/tasks/99999",
        json={"title": "Anything"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert response.status_code == 404


def test_delete_task_success_removes_task(client, auth_user):
    """US-W7: delete returns 204 and task is gone."""
    create_response = client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "Disposable"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    task_id = create_response.json()["id"]

    delete_response = client.delete(
        f"/api/{auth_user['user_id']}/tasks/{task_id}",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert delete_response.status_code == 204

    get_response = client.get(
        f"/api/{auth_user['user_id']}/tasks/{task_id}",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert get_response.status_code == 404


def test_delete_task_nonexistent_returns_404(client, auth_user):
    response = client.delete(
        f"/api/{auth_user['user_id']}/tasks/99999",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert response.status_code == 404


def test_delete_task_mismatched_user_id_returns_403(client, auth_user):
    create_response = client.post(
        f"/api/{auth_user['user_id']}/tasks",
        json={"title": "My task"},
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    task_id = create_response.json()["id"]

    fake_user_id = "550e8400-e29b-41d4-a716-446655440000"
    response = client.delete(
        f"/api/{fake_user_id}/tasks/{task_id}",
        headers={"Authorization": f"Bearer {auth_user['token']}"},
    )
    assert response.status_code == 403
