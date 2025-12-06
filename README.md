# Todo App - Phase I: Basic Todo Management

[![Python 3.13+](https://img.shields.io/badge/python-3.13+-blue.svg)](https://www.python.org/downloads/)
[![Tests](https://img.shields.io/badge/tests-108%20passing-brightgreen.svg)](tests/)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](htmlcov/)
[![Code style: ruff](https://img.shields.io/badge/code%20style-ruff-000000.svg)](https://github.com/astral-sh/ruff)

A clean, well-tested command-line todo application built with Python 3.13+ following **Clean Architecture** principles and **Test-Driven Development (TDD)**.

## ✨ Features

### Phase I - Basic Todo Management (Current)

- ✅ **Add Task**: Create new tasks with title and optional description
- ✅ **View All Tasks**: Display tasks in a formatted table with status indicators
- ✅ **Mark Complete/Incomplete**: Toggle task completion status  
- ✅ **Update Task**: Modify task title and description
- ✅ **Delete Task**: Permanently remove tasks (with confirmation)

### Key Characteristics

- 🎯 **In-Memory Storage**: No database required for Phase I
- 🧪 **100% Test Coverage**: 108 passing tests across all layers
- 🏗️ **Clean Architecture**: Domain → Application → Interface → Infrastructure
- 🎨 **Rich Console UI**: Beautiful terminal interface with colors and emojis
- 📝 **Comprehensive Validation**: Input validation with helpful error messages
- 🔒 **Type-Safe**: Full type hints throughout the codebase

## 🚀 Quick Start

### Prerequisites

- Python 3.13 or higher
- [UV](https://github.com/astral-sh/uv) (recommended) or pip

### Installation

```bash
# Clone the repository
git clone https://github.com/wacif/todo-SDD.git
cd todo-SDD

# Install dependencies with UV (recommended)
uv sync --all-extras

# Or with pip
pip install -e ".[dev]"
```

### Running the Application

```bash
# With UV
uv run python main.py

# Or directly
python main.py
```

### Usage Example

```
📝 Todo App - Phase I

Main Menu
  [1] ➕ Add Task
  [2] 📋 View All Tasks
  [3] ✓  Mark Task Complete/Incomplete
  [4] ✏️  Update Task
  [5] 🗑️  Delete Task
  [6] 👋 Exit

Select an option [1/2/3/4/5/6]: 1

Add New Task
Title: Buy groceries
Description (optional): Milk, eggs, bread, coffee

✅ Task added successfully! (ID: 1)
```

## 🧪 Running Tests

```bash
# Run all tests
uv run pytest

# Run with coverage report
uv run pytest --cov=src --cov-report=html

# Run specific test file
uv run pytest tests/unit/domain/test_task_entity.py

# Run with verbose output
uv run pytest -v
```

### Test Statistics

- **Total Tests**: 108 passing
- **Domain Layer**: 20 tests (94% coverage)
- **Application Layer**: 37 tests (100% coverage)
- **Infrastructure Layer**: 27 tests (100% coverage)
- **Interface Layer**: 24 tests (100% coverage)

## 📁 Project Structure

```
todo-app/
├── src/
│   ├── domain/              # Business entities and rules
│   │   ├── entities/        # Task entity
│   │   ├── repositories/    # Repository interfaces
│   │   └── exceptions/      # Domain exceptions
│   ├── application/         # Use cases and DTOs
│   │   ├── use_cases/       # Business logic orchestration
│   │   └── dto/             # Data Transfer Objects
│   ├── infrastructure/      # External concerns
│   │   ├── persistence/     # In-memory repository
│   │   ├── config/          # Configuration
│   │   └── logging/         # Logging setup
│   └── interface/           # User interface
│       └── cli/             # Console interface with Rich
├── tests/
│   ├── unit/                # Unit tests by layer
│   └── integration/         # Integration tests
├── specs/                   # Specifications
├── main.py                  # Application entry point
└── pyproject.toml          # Project configuration
```

## 🏗️ Architecture

This application follows **Clean Architecture** principles:

1. **Domain Layer** (Innermost)
   - Pure business logic, no dependencies
   - Task entity with validation
   - Repository interfaces (ports)

2. **Application Layer**
   - Use cases coordinating domain logic
   - DTOs for data transfer
   - No framework dependencies

3. **Infrastructure Layer**
   - InMemoryTaskRepository implementation
   - Configuration and logging
   - External tool integrations

4. **Interface Layer** (Outermost)
   - CLI with Rich library
   - Input validation
   - Output formatting

## 🔧 Development

### Code Quality

```bash
# Format code
uv run ruff format .

# Lint code
uv run ruff check .

# Fix linting issues
uv run ruff check --fix .
```

### Configuration

- **Python**: 3.13+
- **Line Length**: 100 characters
- **Test Framework**: Pytest 8.0+
- **Coverage Tool**: pytest-cov 4.1+
- **Linter/Formatter**: Ruff 0.1+
- **UI Library**: Rich 13.7+

## 📋 Requirements

### Functional Requirements

- ✅ Add tasks with title (required) and description (optional)
- ✅ View all tasks ordered by creation date
- ✅ Mark tasks as complete or incomplete
- ✅ Update task title and/or description
- ✅ Delete tasks permanently
- ✅ Auto-increment task IDs (never reused)
- ✅ Input validation (title 1-200 chars, description 0-1000 chars)

### Non-Functional Requirements

- ✅ Python 3.13+ compatible
- ✅ 80%+ test coverage achieved (100% actual)
- ✅ Clean Architecture separation
- ✅ Type hints throughout
- ✅ Comprehensive error handling
- ✅ Rich console formatting

## 🗺️ Roadmap

### Phase I - Basic Todo Management ✅ (Complete)
- In-memory storage
- Console interface
- CRUD operations

### Phase II - Persistence (Planned)
- SQLite database
- Data persistence across sessions
- Migration support

### Phase III - Advanced Features (Planned)
- Due dates and priorities
- Categories/tags
- Search and filter

### Phase IV - Web Interface (Planned)
- REST API with FastAPI
- Web UI

### Phase V - Cloud & Collaboration (Planned)
- Multi-user support
- Cloud storage
- Real-time sync

## 📄 License

This project is part of the Evolution of Todo hackathon using Spec-Driven Development methodology.

## 🙏 Acknowledgments

- Built following [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) by Robert C. Martin
- Test-Driven Development approach
- [Rich](https://github.com/Textualize/rich) library for beautiful CLI
- [UV](https://github.com/astral-sh/uv) for fast Python package management

## 📞 Support

For issues, questions, or contributions, please refer to the project specifications in the `specs/` directory.

---

**Status**: Phase I Complete ✅  
**Next**: Phase II - Persistence Layer
