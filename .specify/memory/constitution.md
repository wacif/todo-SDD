<!--
Sync Impact Report

- Version change: 1.1.0 → 1.2.0
- Modified principles:
   - I. Spec-Driven Development (clarified “no manual code” enforcement)
   - III. Test-First Development (clarified required test mapping to acceptance scenarios)
- Added sections:
   - VIII. Spec Re-baselining & Alignment (NON-NEGOTIABLE)
   - IX. Documentation & Research Discipline (Context7-first)
   - X. Monorepo Organization (NON-NEGOTIABLE)
   - Better Auth token verification compatibility note (Phase II security)
- Removed sections: none
- Templates requiring updates:
   - ✅ `.specify/templates/plan-template.md`
   - ✅ `.specify/templates/spec-template.md`
   - ✅ `.specify/templates/tasks-template.md` (no change needed)
- Follow-up TODOs: none
-->

# Evolution of Todo Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)

**Every feature MUST be specification-first:**
- Write comprehensive Markdown specifications before any implementation
- Specifications must include user stories, acceptance criteria, and test cases
- Use Claude Code to generate implementation from specifications
- Manual code writing is prohibited; refine specs until Claude generates correct output
- All specifications must be versioned and stored in `specs/` directory

**Rationale**: This hackathon explicitly tests spec-driven methodology. The constraint forces architectural thinking before coding and validates AI-assisted development workflows.

### II. Progressive Evolution Architecture

**Each phase builds upon the previous:**
- Phase I: In-memory Python console (foundation)
- Phase II: Full-stack web with persistent storage
- Phase III: AI-powered conversational interface
- Phase IV: Local Kubernetes deployment
- Phase V: Distributed cloud-native system

**Architecture decisions must consider future phases:**
- Design interfaces that can evolve (CLI → Web → AI → Cloud)
- Maintain backward compatibility when possible
- Document migration paths between phases
- Use abstraction layers to isolate phase-specific implementations

**Rationale**: Simulates real-world software evolution from prototype to production-scale distributed systems.

### III. Test-First Development (NON-NEGOTIABLE)

**TDD cycle strictly enforced:**
- Write tests FIRST, based on specification acceptance criteria
- Verify tests FAIL before implementation
- Implement via Claude Code generation from spec
- Verify tests PASS after implementation
- Refactor for quality while maintaining green tests

**Testing requirements:**
- Unit tests for all core functionality
- Integration tests for cross-component interactions
- Contract tests for API boundaries (Phase II+)
- End-to-end tests for user workflows (Phase II+)

**Rationale**: Ensures correctness, enables confident refactoring, and validates spec completeness.

### VIII. Spec Re-baselining & Alignment (NON-NEGOTIABLE)

**When requirements change, specs MUST be re-baselined before code changes:**
- Specs are the source of truth; implementation is disposable
- If an implemented behavior does not match current hackathon requirements, update the spec first
- Existing specs MUST be brought up to date (or explicitly marked **Deprecated**) before planning new work
- Each phase MUST have a complete spec set for its required features before it is considered “done”

**Spec status rules:**
- Each feature spec MUST declare a status: Draft | Approved | Deprecated
- Deprecated specs MUST remain in the repo for auditability, but MUST NOT drive new implementation

**Rationale**: The hackathon grading is based on spec-driven iteration. Re-baselining prevents drift.

### IX. Documentation & Research Discipline (Context7-first)

**When gathering library/framework documentation, agents MUST use Context7 first:**
- Prefer Context7 for authoritative, up-to-date API references and examples
- If Context7 does not have the needed library/page, document the gap in the plan and use the next
   most authoritative source (official docs), noting the URL
- Avoid copy-pasting large blocks of external text; summarize and link

**Rationale**: Reduces hallucinations and keeps design decisions grounded in current docs.

### X. Monorepo Organization (NON-NEGOTIABLE)

**This project MUST remain a monorepo with clear boundaries:**
- `frontend/` contains the Next.js app and frontend-only dependencies
- `backend/` contains the FastAPI app, migrations, and backend-only dependencies
- `specs/` contains all specs (per-phase and per-feature)
- `.specify/` contains templates, memory, and Spec-Kit workflow assets
- `history/` contains PHRs and ADRs

**Rules:**
- No accidental extra app scaffolds in repository root (e.g., stray `package.json`, `node_modules/`)
- Shared docs live at repo root (`README.md`, `CLAUDE.md`, `AGENTS.md` if used)
- Cross-cutting changes MUST update both stack parts when required (API contract, auth, env vars)

**Rationale**: Enables cross-stack, spec-driven iteration with a single source of truth.

### IV. Clean Architecture & Separation of Concerns

**Layer isolation:**
- **Domain Layer**: Core business logic (task management, validation)
- **Application Layer**: Use cases and orchestration
- **Interface Layer**: CLI, Web API, AI chatbot adapters
- **Infrastructure Layer**: Storage, external services, deployment

**Dependencies flow inward:**
- Domain has zero external dependencies
- Application depends only on domain
- Interfaces depend on application
- Infrastructure provides implementations

**File organization:**
```
src/
├── domain/          # Core entities and business rules
├── application/     # Use cases and services
├── interface/       # CLI, API, chatbot adapters
└── infrastructure/  # Database, external APIs, config
```

**Rationale**: Enables phase evolution, testability, and technology swaps without business logic changes.

### V. Feature Completeness Standards

**Basic Level Features (Phase I - REQUIRED):**
- Add Task (title, description)
- Delete Task (by ID)
- Update Task (modify details)
- View Task List (all tasks with status)
- Mark as Complete (toggle completion status)

**Intermediate Level Features (Phase II - REQUIRED):**
- Priorities & Tags/Categories (high/medium/low, work/home labels)
- Search & Filter (by keyword, status, priority, date)
- Sort Tasks (by due date, priority, alphabetically)

**Advanced Level Features (Phase III+ - REQUIRED):**
- Recurring Tasks (auto-reschedule weekly/monthly)
- Due Dates & Time Reminders (date/time pickers, notifications)

**Each feature MUST have:**
- Specification with user stories
- Acceptance criteria
- Test coverage
- Documentation

**Rationale**: Defines MVP scope and ensures progressive feature enhancement across phases.

### VI. AI Integration Standards (Phase III+)

**Conversational interface requirements:**
- Natural language understanding ("Reschedule my morning meetings to 2 PM")
- Context awareness (remembers conversation history)
- Confirmation for destructive actions
- Graceful error handling with helpful suggestions

**Technology stack (Phase III):**
- OpenAI ChatKit for chat interface and agent orchestration
- Official MCP SDK for tool integration

**Integration pattern:**
- AI layer sits above application layer
- Uses same use cases as other interfaces
- Maintains conversation state separately
- Provides natural language → structured command translation

**Rationale**: Tests AI integration capabilities while maintaining clean architecture.

### VII. Cloud-Native & DevOps Excellence (Phase IV+)

**Containerization:**
- All components must be containerized (Docker)
- Multi-stage builds for optimal image size
- Health checks and readiness probes
- 12-factor app principles

**Kubernetes deployment:**
- Helm charts for all components
- ConfigMaps and Secrets for configuration
- Horizontal Pod Autoscaling where applicable
- Service mesh ready (Phase V)

**Observability:**
- Structured logging (JSON format)
- Metrics exposure (Prometheus format)
- Distributed tracing (Phase V)
- Health and readiness endpoints

**Rationale**: Prepares for production-grade distributed systems and validates cloud-native knowledge.

## Technology Stack Requirements

### Phase-Specific Stack

**Phase I (In-Memory Python Console):**
- Python 3.13+
- UV for dependency management
- Pytest for testing
- Rich library for CLI formatting
- No external databases (in-memory only)

**Phase II (Full-Stack Web Application):**
- Frontend: Next.js (latest)
- Backend: FastAPI
- ORM: SQLModel
- Database: Neon DB (PostgreSQL)
- API Documentation: OpenAPI/Swagger

**Phase III (AI-Powered Chatbot):**
- OpenAI ChatKit
- OpenAI Agents SDK
- Official MCP SDK
- All Phase II technologies

**Phase IV (Local Kubernetes):**
- Docker & Docker Compose
- Minikube
- Helm
- kubectl-ai
- kagent
- All Phase III technologies

**Phase V (Cloud Deployment):**
- DigitalOcean Kubernetes (DOKS)
- Apache Kafka (event streaming)
- Dapr (distributed application runtime)
- All Phase IV technologies

### Cross-Cutting Technology Requirements

**Version Control:**
- Git with semantic commit messages
- Feature branch workflow
- PR-based code review

**AI Development Tools:**
- Claude Code (primary development assistant)
- Spec-Kit Plus (specification framework)

**Documentation:**
- README.md (setup and usage)
- CLAUDE.md (AI assistant instructions)
- specs/ directory (all specifications)
- history/ directory (PHRs and ADRs)

## Development Workflow

### Specification-First Process

1. **Create Feature Specification** (`/sp.specify`)
   - Write user stories with acceptance criteria
   - Define functional and non-functional requirements
   - Identify edge cases and error scenarios
   - Store in `specs/<feature-name>/spec.md`

2. **Clarify Ambiguities** (`/sp.clarify`)
   - Resolve unclear requirements
   - Document assumptions
   - Get stakeholder confirmation

3. **Generate Implementation Plan** (`/sp.plan`)
   - Research technical approaches
   - Define data models
   - Design API contracts
   - Create architecture diagrams

4. **Break Down into Tasks** (`/sp.tasks`)
   - Generate dependency-ordered task list
   - Identify parallel execution opportunities
   - Define test requirements per task

5. **Generate Checklists** (`/sp.checklist`)
   - Create quality validation checklists
   - Define acceptance criteria per feature

6. **Implement via Claude Code** (`/sp.implement`)
   - Claude generates code from specifications
   - Human validates generated code
   - Tests must pass before proceeding

7. **Document Decisions** (`/sp.adr`)
   - Capture architectural decisions
   - Record alternatives considered
   - Document tradeoffs

8. **Record History** (`/sp.phr`)
   - Create prompt history records
   - Track learning and patterns
   - Build searchable knowledge base

### Quality Gates

**Before Implementation:**
- [ ] Specification reviewed and approved
- [ ] All ambiguities resolved
- [ ] Test cases defined
- [ ] Architecture planned

**Before Commit:**
- [ ] All tests passing (unit + integration)
- [ ] Code generated by Claude (no manual code)
- [ ] Documentation updated
- [ ] Checklist validated

**Before Phase Completion:**
- [ ] All required features implemented
- [ ] End-to-end tests passing
- [ ] README and CLAUDE.md complete
- [ ] Demo video recorded (optional)

### Git Workflow

**Branch Naming:**
- Feature branches: `<phase>-<feature-name>` (e.g., `phase1-add-task`)
- Bug fixes: `fix-<issue-description>`
- Phase releases: `phase<N>-release`

**Commit Messages:**
```
<type>(<scope>): <subject>

<body>

Refs: <spec-file>
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`

## Phase-Specific Requirements

### Phase I Requirements (Due: Dec 7, 2025)

**Deliverables:**
- Constitution file (this document)
- `specs/` directory with all feature specifications
- `history/` directory with PHRs and ADRs
- `src/` directory with Python source code
- `tests/` directory with test suite
- `README.md` with setup and usage instructions
- `CLAUDE.md` with Claude Code configuration
- Working console application

**Success Criteria:**
- All 5 Basic Level features functional
- In-memory storage (no persistence)
- Clean code with proper structure
- Test coverage ≥ 80%
- Specifications for every feature
- PHR for every development session

### Phase II Requirements (Due: Dec 14, 2025)

**Additional Deliverables:**
- Next.js frontend application
- FastAPI backend with OpenAPI docs
- SQLModel data models
- Neon DB integration
- Migration scripts
- API contract tests
- All Basic + Intermediate features

**Success Criteria:**
- Web UI with responsive design
- RESTful API with proper status codes
- Database persistence with migrations
- Search, filter, and sort functionality
- Priorities and tags/categories working
- Test coverage ≥ 85%

**Security note (Phase II):**
- The backend MUST verify Better Auth-issued tokens in a way that matches the configured signing
   strategy (e.g., shared-secret JWT verification or JWKS-based verification).
- The authenticated user identity MUST be enforced consistently across API routes and persistence.

### Phase III Requirements (Due: Dec 21, 2025)

**Additional Deliverables:**
- OpenAI ChatKit integration
- Agents SDK implementation
- MCP SDK integration
- Conversational interface
- Natural language command processing
- All Advanced features

**Success Criteria:**
- Natural language task management
- Context-aware conversations
- Command confirmation workflow
- Recurring tasks automated
- Due dates and reminders functional
- Test coverage ≥ 85%

### Phase IV Requirements (Due: Jan 4, 2026)

**Additional Deliverables:**
- Dockerfiles for all components
- Helm charts
- Minikube deployment scripts
- kubectl-ai integration
- kagent configuration
- Local K8s deployment guide

**Success Criteria:**
- All components containerized
- Successful Minikube deployment
- Health checks and probes working
- Scalability demonstrated
- Logging and monitoring functional

### Phase V Requirements (Due: Jan 18, 2026)

**Additional Deliverables:**
- DOKS deployment configuration
- Kafka event streaming
- Dapr integration
- Production-ready manifests
- Cloud deployment guide

**Success Criteria:**
- Successful cloud deployment on DOKS
- Event-driven architecture working
- Distributed tracing functional
- Auto-scaling demonstrated
- Production-grade observability

## Governance

**Constitution Authority:**
- This constitution supersedes all other development practices
- All specifications must comply with these principles
- All generated code must adhere to these standards

**Amendment Process:**
- Amendments require explicit documentation
- Use `/sp.constitution` command for updates
- Version must increment semantically:
  - MAJOR: Breaking changes to principles
  - MINOR: New principles or sections added
  - PATCH: Clarifications or refinements

**Compliance Verification:**
- Every PR must pass quality gates
- Specifications reviewed before implementation
- Tests must validate constitution compliance
- PHR required for every development session

**Conflict Resolution:**
- Constitution principles are non-negotiable
- When conflicts arise, constitution wins
- Exceptions require ADR with strong justification
- Human judgment required for ambiguous cases

**Runtime Guidance:**
- Use `CLAUDE.md` for Claude Code instructions
- Reference this constitution for all decisions
- Create ADRs for architectural decisions
- Record PHRs for learning and traceability

**Version**: 1.2.0 | **Ratified**: 2025-12-06 | **Last Amended**: 2025-12-12
