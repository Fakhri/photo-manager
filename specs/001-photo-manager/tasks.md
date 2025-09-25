# Tasks: PhotoManager

**Input**: Design documents from `/specs/001-photo-manager/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, modules
   → Integration: storage, logging, error boundaries
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness
```

## Path Conventions
- Feature dir: `d:/GitHub Spec - Experiment/photo-manager/specs/001-photo-manager/`
- Source (planned): `d:/GitHub Spec - Experiment/photo-manager/frontend/`

## Phase 3.1: Setup
- [ ] T001 Initialize Vite + TypeScript project in `frontend/` with minimal template
- [ ] T002 Add dependencies in `frontend/` (exact minimal set): exifr (EXIF parsing); ESLint; Prettier; TypeScript strict
- [ ] T003 [P] Configure ESLint + Prettier with scripts in `frontend/package.json`
- [ ] T004 [P] Setup Vitest + Playwright config files for unit/integration/E2E under `frontend/`
- [ ] T005 Create base folder structure under `frontend/src/` (`modules/photos`, `modules/albums`, `modules/search`, `modules/storage`, `modules/ui`, `pages`)
- [ ] T006 Add TypeScript tsconfig with strict true and path aliases for `modules/*`

## Phase 3.2: Tests First (TDD)
- [ ] T007 [P] Contract tests for Photos API in `frontend/tests/contract/photos.spec.ts` based on `contracts/photos.md`
- [ ] T008 [P] Contract tests for Albums API in `frontend/tests/contract/albums.spec.ts` based on `contracts/albums.md`
- [ ] T009 [P] Contract tests for Search API in `frontend/tests/contract/search.spec.ts` based on `contracts/search.md`
- [ ] T010 [P] Contract tests for Storage API in `frontend/tests/contract/storage.spec.ts` based on `contracts/storage.md`
- [ ] T011 [P] Contract tests for UI API in `frontend/tests/contract/ui.spec.ts` based on `contracts/ui.md`
- [ ] T012 Integration test: import thousands of photos and validate auto date albums (YYYY/MM) in `frontend/tests/integration/import_and_auto_albums.spec.ts` (from quickstart step 1)
- [ ] T013 Integration test: create custom album, multi-select add, DnD reorder with visual feedback in `frontend/tests/integration/albums_reorder_multiselect.spec.ts` (quickstart step 2)
- [ ] T014 Integration test: rearrange photos, add captions/tags, persistence across reload in `frontend/tests/integration/album_edit_persist.spec.ts` (quickstart step 3)
- [ ] T015 Integration test: search by date range + tag responsiveness in `frontend/tests/integration/search_filters.spec.ts` (quickstart step 4)
- [ ] T016 Integration test: responsive layout desktop/mobile in `frontend/tests/integration/responsive_layout.spec.ts` (quickstart step 5)
- [ ] T017 Integration test: offline privacy (no network requests) in `frontend/tests/integration/offline_privacy.spec.ts` (quickstart step 6)

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T018 [P] Implement IndexedDB storage wrapper (`frontend/src/modules/storage/indexeddb.ts`) with stores/indexes from `data-model.md`
- [ ] T019 Implement migrations and schema init (`frontend/src/modules/storage/schema.ts`) and wire to wrapper
- [ ] T020 [P] Implement Photos module skeleton (`frontend/src/modules/photos/api.ts`) with interfaces from `contracts/photos.md`
- [ ] T021 Implement EXIF parsing and date fallback logic (`frontend/src/modules/photos/exif.ts`) using exifr; unit-cover date fallback
- [ ] T022 Implement thumbnail pipeline with content-addressing and LRU metadata (`frontend/src/modules/photos/thumbnails.ts`) with worker-based resize
- [ ] T023 [P] Implement Albums module (`frontend/src/modules/albums/api.ts`) including auto-date builder and conflict prefix "(date conflict) "
- [ ] T024 Implement album grid order persistence (`frontend/src/modules/albums/order.ts`) and intra-album order updates
- [ ] T025 [P] Implement Search module (`frontend/src/modules/search/api.ts`) supporting date range/tags/captions filters, pagination
- [ ] T026 Implement UI module (`frontend/src/modules/ui/api.ts`) with keyboard map, drag-and-drop visuals, multi-select handling
- [ ] T027 Create responsive pages: albums grid and album view (`frontend/src/pages/AlbumsPage.tsx`, `frontend/src/pages/AlbumPage.tsx`) using CSS Grid/Flexbox

## Phase 3.4: Integration
- [ ] T028 Wire Photos ↔ Storage (import, read/write meta, thumbnails cache) (`frontend/src/modules/photos/index.ts`)
- [ ] T029 Wire Albums ↔ Storage (auto-date membership, custom albums, orders) (`frontend/src/modules/albums/index.ts`)
- [ ] T030 Wire Search ↔ Storage (indexes for dateTaken, tags, captions) (`frontend/src/modules/search/index.ts`)
- [ ] T031 Wire UI ↔ modules with state management and error boundary (`frontend/src/modules/ui/index.ts`)
- [ ] T032 Add compatibility checks and fallbacks (File System Access, HEIC decode) and user-facing messages (`frontend/src/modules/ui/compat.ts`)

## Phase 3.5: Polish
- [ ] T033 [P] Unit tests for EXIF fallback and hashing (`frontend/tests/unit/exif_hash.spec.ts`)
- [ ] T034 [P] Unit tests for LRU eviction policy (`frontend/tests/unit/lru_cache.spec.ts`)
- [ ] T035 [P] Unit tests for keyboard navigation and focus management (`frontend/tests/unit/a11y_keyboard.spec.ts`)
- [ ] T036 Add docs: `docs/performance.md` with measurement steps; update `quickstart.md` keyboard steps
- [ ] T037 Add CI config for lint/format/test and coverage ≥80% core modules (`.github/workflows/ci.yml`)
- [ ] T038 Performance tests: measure warm/cold start and p95 input latency (`frontend/tests/perf/perf.spec.ts`)

## Dependencies
- Setup (T001–T006) before Tests (T007–T017)
- Storage (T018–T019) before Photos/Albums/Search wiring (T028–T030)
- Albums (T023–T024) before UI integration (T031)
- Tests must fail before Core Implementation begins

## Parallel Example
```
# Launch contract tests together:
Task: "Contract tests Photos" (T007)
Task: "Contract tests Albums" (T008)
Task: "Contract tests Search" (T009)
Task: "Contract tests Storage" (T010)
Task: "Contract tests UI" (T011)
```

## Validation Checklist
- [ ] All contracts have corresponding tests (T007–T011)
- [ ] All entities have model tasks (covered via storage/schema + modules)
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
