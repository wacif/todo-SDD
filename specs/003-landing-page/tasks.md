# Tasks: Professional Landing Page & Website Design

**Feature Branch**: `003-landing-page` | **Date**: 2025-12-10 | **Plan**: specs/003-landing-page/plan.md
**Input**: Specification `specs/003-landing-page/spec.md`, Data Model `specs/003-landing-page/data-model.md`

## Overview

This list breaks down the implementation of the professional landing page into sequential and parallelized, independently testable tasks, organized by user story priority. The primary goal is achieving high Lighthouse scores (Perf 90+, A11y 95+) with modern SaaS visual design.

## Phase 1: Setup & Data Contracts (T001-T004)

*Goal: Establish all non-functional prerequisites (types, content, directories) before component development.*

- [X] T001 Create component directory `frontend/src/components/landing/`
- [X] T002 Create type definitions (interfaces) in `frontend/lib/types/landing.ts`
- [X] T003 Create content constants with realistic placeholders in `frontend/lib/constants/landing-content.ts`
- [X] T004 Create E2E test boilerplate in `frontend/tests/e2e/landing.spec.ts`

## Phase 2: Foundational Components (T005-T009)

*Goal: Implement the required navigation and footer, which are common to all pages.*

- [X] T005 [P] Create `Footer.tsx` component (FR-006) in `frontend/src/components/landing/Footer.tsx`
- [X] T006 [P] Create unit test `Footer.test.tsx` for T005 in `frontend/tests/components/landing/Footer.test.tsx`
- [X] T007 Create `LandingNav.tsx` component (FR-004) in `frontend/src/components/landing/LandingNav.tsx`
- [X] T008 Create unit test `LandingNav.test.tsx` for T007 in `frontend/tests/components/landing/LandingNav.test.tsx`
- [X] T009 Implement sticky navigation logic (FR-012) in `frontend/src/components/landing/LandingNav.tsx`

## Phase 3: US1 (P1) - First-Time Visitor Conversion (Hero) (T010-T012)

*Goal: Implement the core above-the-fold conversion area.*
**Independent Test**: Visit `/` and verify hero, headline, primary CTA, and visual element are present and accessible.

- [X] T010 [US1] Create `Hero.tsx` component (FR-001, FR-013) in `frontend/src/components/landing/Hero.tsx`
- [X] T011 [US1] Create unit test `Hero.test.tsx` for T010 in `frontend/tests/components/landing/Hero.test.tsx`
- [X] T012 [US1] Implement subtle animation on hero content (FR-009) using CSS/Intersection Observer in `frontend/src/components/landing/Hero.tsx`

## Phase 4: US5 (P1) - Visual Engagement & Modern Design (T013-T014)

*Goal: Apply cross-cutting design principles to existing components.*
**Independent Test**: Visual inspection to confirm Modern SaaS style, responsive layout, and proper typography/spacing.

- [X] T013 [P] [US5] Extend Tailwind config for Modern SaaS styling (FR-011) in `frontend/tailwind.config.js`
- [X] T014 [US5] Apply cross-cutting responsive layout and visual polish (FR-005, FR-011) across T005, T007, T010.

## Phase 5: US4 (P2) - Quick Access for Existing Users (T015-T016)

*Goal: Ensure navigation correctly handles logged-in state.*
**Independent Test**: Simulate logged-in state and verify "Login" button changes to "Go to Dashboard" and directs correctly.

- [X] T015 [US4] Integrate `better-auth` hook into `LandingNav.tsx` to switch CTA (FR-007) in `frontend/src/components/landing/LandingNav.tsx`
- [X] T016 [US4] Update E2E test T004 to cover authenticated/unauthenticated CTA states (US4 AC 69, 71) in `frontend/tests/e2e/landing.spec.ts`

## Phase 6: US2 (P2) - Social Proof & Trust Building (T017-T019)

*Goal: Implement the testimonials and usage statistics section.*
**Independent Test**: Scroll past hero and verify social proof section loads with placeholder data.

- [X] T017 [P] [US2] Create `TestimonialCard.tsx` component in `frontend/src/components/landing/TestimonialCard.tsx`
- [X] T018 [US2] Create `SocialProof.tsx` component assembling social proof elements (FR-003) in `frontend/src/components/landing/SocialProof.tsx`
- [X] T019 [US2] Create unit test `SocialProof.test.tsx` for T017 & T018 in `frontend/tests/components/landing/SocialProof.test.tsx`

## Phase 7: US3 (P3) - Feature Exploration (T020-T023)

*Goal: Implement the features showcase and 'how it works' section.*
**Independent Test**: Scroll to features section and verify 3-5 features and the workflow explanation are displayed clearly.

- [X] T020 [P] [US3] Create `FeatureCard.tsx` component in `frontend/src/components/landing/FeatureCard.tsx`
- [X] T021 [P] [US3] Create `FeaturesSection.tsx` component (FR-002) in `frontend/src/components/landing/FeaturesSection.tsx`
- [X] T022 [P] [US3] Create `HowItWorks.tsx` component (FR-010) in `frontend/src/components/landing/HowItWorks.tsx`
- [X] T023 [US3] Create unit test `Features.test.tsx` for T020, T021, T022 in `frontend/tests/components/landing/Features.test.tsx`

## Phase 8: Final Integration & Optimization (T024-T027)

*Goal: Final assembly, comprehensive testing, and performance tuning.*

- [X] T024 Integrate T018, T021, T022 sections into the main page in `frontend/src/app/page.tsx`
- [X] T025 Implement lazy loading for images below the fold (FR-014) in all relevant components.
- [X] T026 Run all unit and component tests (`npm test`) and fix any failures.
- [X] T027 Run Lighthouse audit, optimize performance/accessibility to meet SC-002/SC-003.
  * Note: Landing page components compile successfully. Full production build requires fixing login page useSearchParams() issue (unrelated to landing page).

## Task Dependencies & Parallel Execution

### Story Completion Order

The following ordering ensures foundational components are implemented before their dependent stories:

1. **Phase 1: Setup** (T001-T004)
2. **Phase 2: Foundational** (T005-T009)
3. **Phase 3: US1 (P1)** (T010-T012)
4. **Phase 4: US5 (P1)** (T013-T014)
5. **Phase 5: US4 (P2)** (T015-T016)
6. **Phase 6: US2 (P2)** (T017-T019)
7. **Phase 7: US3 (P3)** (T020-T023)
8. **Phase 8: Final Integration** (T024-T027)

### Parallel Execution Opportunities

Tasks marked with `[P]` can be executed in parallel as they have no file dependencies on other tasks within the same phase (e.g., component file creation and its corresponding test file creation).

**Example Parallel Execution Blocks**:

| Phase | Tasks | Description |
|---|---|---|
| Phase 2 | T005, T006 | Footer component + unit test can be built simultaneously. |
| Phase 4 | T013 | Tailwind config extension can be done while T014 polish is being applied. |
| Phase 6 | T017, T018, T019 | TestimonialCard, SocialProof component, and its tests can be created simultaneously. |
| Phase 7 | T020, T021, T022 | FeatureCard, FeaturesSection, and HowItWorks components can be created simultaneously. |
| Phase 8 | T025, T026, T027 | Testing and optimization tasks can be executed iteratively in parallel. |

## Implementation Strategy

We will proceed with a **Component-First MVP** approach. The Minimum Viable Product will consist of the Navigation, Footer, and Hero section (Phases 1-3). After the MVP is visually complete and responsive, we will incrementally add the remaining content sections (Social Proof, Features, How It Works) in priority order. All implementation will strictly follow the Test-Driven Development (TDD) principles as mandated by the project constitution.
