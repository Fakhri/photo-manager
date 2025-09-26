# Implementation Plan: PhotoManager

**Branch**: `[001-photo-manager-webapp]` | **Date**: 2025-09-25 | **Spec**: d:/GitHub Spec - Experiment/photo-manager/specs/001-photo-manager/spec.md
**Input**: Feature specification from `/specs/001-photo-manager/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
From the feature spec: A local-only web photo manager that organizes photos into auto date-based and custom albums, supports DnD reordering, multi-select, tagging/captions, fast navigation across thousands of photos, and responsive UI for desktop and mobile.

## Technical Context
**Language/Version**: TypeScript (Vite) for frontend; vanilla JS modules permitted.  
**Primary Dependencies**: Minimal: file handling and EXIF parsing library only (exact choice TBD in research).  
**Storage**: IndexedDB for on-device metadata (photos, albums, tags, captions), persistent caches for thumbnails.  
**Testing**: To be defined (e.g., Vitest/Playwright); follow Constitution’s 80%+ coverage on core modules.  
**Target Platform**: Modern desktop and mobile browsers supporting IndexedDB, File System Access, and HEIC/WEBP decoding as available.  
**Project Type**: web (frontend-only, local data).  
**Performance Goals**: Grid scroll ≤16ms frame budget; p95 input latency ≤50ms; warm start first grid ≤1.0s; cold start ≤2.5s with progress.  
**Constraints**: No network egress of photo bytes/derived metadata; offline-capable.  
**Scale/Scope**: Thousands to 100k photos per library; date-based albums (YYYY/MM) + custom albums; videos supported.

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Privacy (Local-Only)
  - No photo bytes/derived metadata leave device. Telemetry opt-in only and excludes content/identifiers.
  - Secrets stored via OS/browser secure storage. No plaintext secrets.
- Performance at Scale
  - Virtualized grids; thumbnail pipeline with LRU disk cache; bounded concurrency for indexing; downsampling per DPR.
  - Targets: 60fps; p95 scroll ≤50ms; warm ≤1.0s; cold ≤2.5s.
- Accessibility
  - Full keyboard navigation; accessible names/roles/states; focus management; WCAG 2.2 AA contrast; reduced motion honored.
- Code Quality
  - Clean architecture modules (UI, services, data). Unit/integration/E2E tests. ≥80% core coverage. Linters/formatters in CI.

Status: Initial Constitution Check → PASS

## Project Structure
### Documentation (this feature)
```
specs/001-photo-manager/
├── plan.md              # This file (/plan output)
├── research.md          # Phase 0 output (/plan)
├── data-model.md        # Phase 1 output (/plan)
├── quickstart.md        # Phase 1 output (/plan)
├── contracts/           # Phase 1 output (/plan)
└── tasks.md             # Phase 2 output (/tasks - NOT created by /plan)
```
### Source Code (repository root)
```
frontend/
├── src/
│   ├── modules/
│   │   ├── photos/           # import, EXIF, thumbnails, previews
│   │   ├── albums/           # auto-date + custom album mgmt
│   │   ├── search/           # tags/captions/date range
│   │   ├── storage/          # IndexedDB adapters
│   │   └── ui/               # components, keyboard nav, a11y
│   ├── pages/
│   └── services/
└── tests/

**Structure Decision**: DEFAULT to web app structure above; refine during Phase 1.

## Design Principles, Patterns, and Algorithms

### SOLID Principles
- Single-responsibility principle: A class should have only one reason to change, meaning it should have only one job or responsibility.
- Open–closed principle: Software entities should be open for extension but closed for modification.
- Liskov substitution principle: Objects of a superclass should be replaceable with objects of a subclass without affecting the functionality.
- Interface segregation principle: Clients should not be forced to depend on interfaces they do not use.
- Dependency inversion principle: Depend on abstractions, not concretions.

### Data Structures – Selection Guidelines
- Collections
  - Use `Array<T>` for ordered sequences and UI lists; prefer immutable updates for state.
  - Use `Set<T>` for fast membership checks (e.g., multi-select of photo IDs).
  - Use `Map<K,V>` for O(1) lookups by ID or composite keys (e.g., photoId -> metadata, albumId -> ordered photo IDs).
  - Use `Readonly`/type-branded IDs (e.g., `PhotoId`, `AlbumId`) to avoid key mixups.
- Indexing and Persistence
  - IndexedDB object stores per entity (`photos`, `albums`, `tags`, `captions`, `thumbnails`).
  - Secondary indexes for common queries: by `dateTaken`, by `albumId+position`, by `tag`, by `caption full-text token` (if implemented locally).
  - Use content-addressable keys for thumbnails (hash of normalized image bytes + transformation parameters).
- Caching
  - LRU cache (memory) for decoded thumbnails/previews with size-bound by MB and entry count.
  - Disk cache for thumbnails with periodic sweep; store a `lastAccessedAt` to support eviction.
- Queues
  - Bounded-concurrency work queue for indexing and thumbnail generation. Prefer a `PriorityQueue` to prioritize on-screen items.
  - Use a simple deque for FIFO background tasks when priority is equal.
- Algorithms
  - Virtualized grid/windowing over arrays for UI lists to maintain ≤16ms frame budget.
  - Stable sorts for user-facing orderings; diffing-based reordering for DnD (minimize DOM mutations).
  - Binary search over date indexes for range filters; intersection of sorted lists for tag queries.
  - Debounce and throttle for input and resize events; requestIdleCallback for low-priority work.

### Design Patterns – Recommended Uses
- Layered/Clean Architecture
  - `ui/` depends on `services/` depends on `modules/*` depends on `storage/` adapters; cross-layer calls only downward.
- Repository/Adapter
  - Repositories abstract IndexedDB operations behind interfaces in `contracts/`; adapters for different storage backends if needed.
- Strategy
  - Pluggable strategies for thumbnail generation/decoding and EXIF parsing; select best available codec/library at runtime.
- Command (with Undo/Redo)
  - Model edits (add/remove from album, tag edits, caption edits) emitted as commands to enable undo/redo and history.
- Observer / Pub-Sub
  - Event bus for media indexing progress, cache updates, and selection changes; UI subscribes to render minimal diffs.
- Facade
  - Provide a thin `PhotoLibrary` API surface for UI pages/components, hiding module complexity.
- State Machine
  - Explicit UI mode handling (browsing, selecting, DnD, editing) to avoid boolean flag soup.

### Best Practices
- Apply SOLID consistently in `contracts/` and concrete implementations; DI through constructor-injected interfaces.
- Favor immutability for view models and shallow structural sharing to minimize re-renders.
- Keep pure, synchronous domain logic separate from async I/O boundaries; isolate side effects in services/adapters.
- Validate inputs at module boundaries; prefer discriminated unions for result types over `null`/`undefined`.
- Add unit tests for repositories, strategies, and command handlers; integration tests for workflows.

## Phase 0: Outline & Research
1. Unknowns and decisions to research:
   - Choose EXIF parsing library with HEIC support and no network egress.
   - IndexedDB schema patterns for large collections and WAL-like batching (IDB transactions).
   - Browser support matrix (HEIC/WEBP, File System Access API fallback strategies).
   - Keyboard shortcut map and screen reader patterns for grids.

**Output**: research.md with all critical unknowns resolved or explicitly deferred.

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. Data model design → `data-model.md` (entities Photo, Album, Tag, Caption, AlbumPreview; relations and constraints)
2. Contracts → `contracts/`:
   - Define module interfaces for photos, albums, search, storage (e.g., TypeScript interfaces and expected behaviors) as contract docs.
3. Tests scaffolding plan → quickstart.md acceptance steps mapped to E2E scenarios.

**Output**: data-model.md, /contracts/*, quickstart.md (tests plan)

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P]
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*Beyond the scope of /plan*

## Complexity Tracking
| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none) |  |  |

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [ ] Phase 0: Research complete (/plan command)
- [ ] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PASS
- [ ] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
