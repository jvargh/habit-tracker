# Tasks: Habit Tracker App

**Input**: Design documents from `/specs/001-habit-tracker-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are included based on the plan.md testing strategy (Jest + React Testing Library, Playwright for E2E)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and Next.js structure

- [x] T001 Create Next.js project structure with TypeScript and Tailwind CSS
- [x] T002 Configure Next.js for static export in next.config.js
- [x] T003 [P] Setup TypeScript configuration in tsconfig.json
- [x] T004 [P] Configure ESLint and Prettier in .eslintrc.json and .prettierrc
- [x] T005 [P] Setup Jest and React Testing Library in jest.config.js and jest.setup.js
- [x] T006 [P] Configure Playwright for E2E testing in playwright.config.ts
- [x] T007 Create project directory structure (app/, components/, lib/, tests/)
- [x] T008 [P] Install dependencies: recharts, uuid, date-fns, @types/uuid
- [x] T009 [P] Setup global styles in app/globals.css
- [x] **T010** - Create package.json scripts for dev, build, test, and export

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] **T011** - Create TypeScript type definitions for Habit, HabitEntry, Achievement, etc.
- [x] **T012** - Create storage service for localStorage operations
- [x] **T013** - Create utility functions for date calculations, habit stats, etc.
- [x] **T014** - Create base UI components (Button, Card, Input, Modal)
- [x] **T015** - Create Layout components (Header, Navigation, Layout)
- [x] T016 Create base Button component in components/ui/Button.tsx
- [x] T017 [P] Create Modal component in components/ui/Modal.tsx
- [x] T018 [P] Create root layout component in app/layout.tsx
- [x] T019 Setup dummy/sample habit data for testing and demonstration
- [x] T020 Create error handling and user feedback utilities

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Habit Dashboard (Priority: P1) 🎯 MVP

**Goal**: Display dashboard showing all habits with progress indicators, achievements, and graphs

**Independent Test**: Load app with sample habit data and verify dashboard displays habits, streaks, completion percentages, and achievement indicators

### Tests for User Story 1

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T021 [P] [US1] Unit test for HabitCard component in tests/components/HabitCard.test.tsx
- [x] T022 [P] [US1] Unit test for HabitList component in tests/components/HabitList.test.tsx
- [x] T023 [P] [US1] Integration test for dashboard loading in tests/integration/dashboard.test.tsx
- [x] T024 [P] [US1] E2E test for dashboard viewing in tests/e2e/dashboard.spec.ts

### Implementation for User Story 1

- [ ] T025 [P] [US1] Create HabitCard component in components/habits/HabitCard.tsx
- [ ] T026 [P] [US1] Create HabitList component in components/habits/HabitList.tsx
- [ ] T027 [P] [US1] Create ProgressChart component in components/charts/ProgressChart.tsx
- [ ] T028 [P] [US1] Create WeeklyChart component in components/charts/WeeklyChart.tsx
- [ ] T029 [P] [US1] Create achievement badge components in components/ui/AchievementBadge.tsx
- [ ] T030 [US1] Implement dashboard page logic in app/page.tsx
- [ ] T031 [US1] Add streak calculation logic to statistics utils
- [ ] T032 [US1] Integrate charts with habit data and display on dashboard
- [ ] T033 [US1] Add achievement milestone detection and display

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Track Daily Habit Progress (Priority: P1)

**Goal**: Allow users to mark habits complete for current day, update streaks, and trigger achievements

**Independent Test**: Create habit, mark as complete, verify progress indicators update and streaks increment

### Tests for User Story 2

- [ ] T034 [P] [US2] Unit test for habit completion logic in tests/components/HabitCard.test.tsx
- [ ] T035 [P] [US2] Unit test for streak calculation in tests/utils/statistics.test.ts
- [ ] T036 [P] [US2] Integration test for progress tracking in tests/integration/progress.test.tsx
- [ ] T037 [P] [US2] E2E test for marking habit complete in tests/e2e/progress-tracking.spec.ts

### Implementation for User Story 2

- [ ] T038 [US2] Add completion tracking methods to storage service in lib/storage/localStorage.ts
- [ ] T039 [US2] Implement habit completion toggle in HabitCard component
- [ ] T040 [US2] Add achievement notification component in components/ui/AchievementNotification.tsx
- [ ] T041 [US2] Create milestone detection logic in lib/utils/achievements.ts
- [ ] T042 [US2] Integrate completion tracking with dashboard updates
- [ ] T043 [US2] Add celebration effects for achievement unlocks
- [ ] T044 [US2] Implement daily completion blocking (prevent multiple completions per day)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Manage Habit Collection (Priority: P2)

**Goal**: Create, edit, delete, and reorder habits with persistence

**Independent Test**: Create habit, edit its details, delete habits, reorder habits, verify all operations persist correctly

### Tests for User Story 3

- [ ] T045 [P] [US3] Unit test for HabitForm component in tests/components/HabitForm.test.tsx
- [ ] T046 [P] [US3] Unit test for habit CRUD operations in tests/storage/localStorage.test.ts
- [ ] T047 [P] [US3] Integration test for habit management in tests/integration/habit-management.test.tsx
- [ ] T048 [P] [US3] E2E test for habit CRUD workflow in tests/e2e/habit-management.spec.ts

### Implementation for User Story 3

- [ ] T049 [P] [US3] Create HabitForm component in components/habits/HabitForm.tsx
- [ ] T050 [P] [US3] Add form validation logic in lib/utils/validation.ts
- [ ] T051 [US3] Implement habit creation functionality in storage service
- [ ] T052 [US3] Implement habit editing functionality in storage service
- [ ] T053 [US3] Implement habit deletion with confirmation modal
- [ ] T054 [US3] Add drag-and-drop reordering to HabitList component
- [ ] T055 [US3] Create habit management page in app/habits/page.tsx
- [ ] T056 [US3] Integrate habit management with dashboard updates

**Checkpoint**: All P1 and P2 user stories should now be independently functional

---

## Phase 6: User Story 4 - Rate and Review Habit Performance (Priority: P3)

**Goal**: Allow users to assign 1-5 star ratings to habits for evaluation and sorting

**Independent Test**: Add ratings to existing habits, verify ratings display and can be modified

### Tests for User Story 4

- [ ] T057 [P] [US4] Unit test for rating component in tests/components/HabitRating.test.tsx
- [ ] T058 [P] [US4] Unit test for rating storage in tests/storage/localStorage.test.ts
- [ ] T059 [P] [US4] Integration test for rating workflow in tests/integration/rating.test.tsx
- [ ] T060 [P] [US4] E2E test for habit rating in tests/e2e/habit-rating.spec.ts

### Implementation for User Story 4

- [ ] T061 [P] [US4] Create StarRating component in components/ui/StarRating.tsx
- [ ] T062 [US4] Add rating field to Habit interface in lib/types/index.ts
- [ ] T063 [US4] Implement rating storage in localStorage service
- [ ] T064 [US4] Integrate rating display in HabitCard component
- [ ] T065 [US4] Add rating functionality to HabitForm component
- [ ] T066 [US4] Implement rating-based sorting in HabitList component

**Checkpoint**: At this point, User Stories 1, 2, 3, and 4 should all work independently

---

## Phase 7: User Story 5 - Share Progress Snapshots (Priority: P3)

**Goal**: Generate and share text summaries of habit progress with key metrics

**Independent Test**: Generate shareable snapshot from habit data, verify sharing functionality works

### Tests for User Story 5

- [ ] T067 [P] [US5] Unit test for snapshot generation in tests/utils/snapshot.test.ts
- [ ] T068 [P] [US5] Unit test for sharing component in tests/components/ShareSnapshot.test.tsx
- [ ] T069 [P] [US5] Integration test for sharing workflow in tests/integration/sharing.test.tsx
- [ ] T070 [P] [US5] E2E test for progress sharing in tests/e2e/progress-sharing.spec.ts

### Implementation for User Story 5

- [ ] T071 [P] [US5] Create snapshot generation utility in lib/utils/snapshot.ts
- [ ] T072 [P] [US5] Create ShareSnapshot component in components/ui/ShareSnapshot.tsx
- [ ] T073 [US5] Implement progress summary text generation
- [ ] T074 [US5] Add native sharing API integration (Web Share API)
- [ ] T075 [US5] Add fallback sharing methods (copy to clipboard)
- [ ] T076 [US5] Integrate sharing functionality in dashboard
- [ ] T077 [US5] Create stats page with sharing feature in app/stats/page.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T078 [P] Add responsive design styles across all components
- [ ] T079 [P] Implement accessibility improvements (ARIA labels, keyboard navigation)
- [ ] T080 [P] Add loading states and error handling across the app
- [ ] T081 [P] Performance optimization (code splitting, lazy loading)
- [ ] T082 [P] Add PWA manifest and service worker for offline support
- [ ] T083 [P] Create comprehensive documentation in README.md
- [ ] T084 Code cleanup and refactoring across components
- [ ] T085 [P] Add comprehensive E2E test coverage
- [ ] T086 Security review and input sanitization
- [ ] T087 Run static export build and deployment validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 & US2 → US3 → US4 → US5)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but independently testable
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Integrates with US3 but independently testable
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Uses data from US1/US2 but independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Components before integration
- Core implementation before UI enhancements
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for HabitCard component in tests/components/HabitCard.test.tsx"
Task: "Unit test for HabitList component in tests/components/HabitList.test.tsx"
Task: "Integration test for dashboard loading in tests/integration/dashboard.test.tsx"
Task: "E2E test for dashboard viewing in tests/e2e/dashboard.spec.ts"

# Launch all components for User Story 1 together:
Task: "Create HabitCard component in components/habits/HabitCard.tsx"
Task: "Create HabitList component in components/habits/HabitList.tsx"
Task: "Create ProgressChart component in components/charts/ProgressChart.tsx"
Task: "Create WeeklyChart component in components/charts/WeeklyChart.tsx"
Task: "Create achievement badge components in components/ui/AchievementBadge.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Dashboard View)
4. Complete Phase 4: User Story 2 (Progress Tracking)
5. **STOP and VALIDATE**: Test both user stories independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo
3. Add User Story 2 → Test independently → Deploy/Demo (MVP!)
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Stories 4 & 5 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 & 2 (P1 priority)
   - Developer B: User Story 3 (P2 priority)
   - Developer C: User Stories 4 & 5 (P3 priority)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- MVP scope includes User Stories 1 & 2 (P1 priority)
- Static export configuration ensures no server dependencies