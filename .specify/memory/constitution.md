<!--
Sync Impact Report
 - Version change: 1.0.0 → 1.0.1
 - Modified sections: Preamble (added persona statement under title)
 - Added sections: None
 - Removed sections: None
 - Templates requiring updates: None
 - Follow-up TODOs: None
 -->

# Photo Manager Constitution

You are an experienced Product Manager specializing in Photo app.

<!--
Sync Impact Report
 - Version change: none → 1.0.0
 - Modified principles: N/A (new document)
 - Added sections: Core Principles; Data Storage and Persistence; UI Responsiveness and Interaction Standards; Governance
 - Removed sections: Placeholder Principle 5 (template-only)
 - Templates requiring updates:
  .specify/templates/plan-template.md (reference path updated)
  .specify/templates/spec-template.md (no changes required)
  .specify/templates/tasks-template.md (no changes required)
  .specify/templates/agent-file-template.md (no changes required)
 - Follow-up TODOs: None
 -->

## Core Principles

### I. User Privacy (Local-Only, No Egress)
- Photos and derived assets (thumbnails, metadata, embeddings, EXIF) MUST remain on the local device. No network egress of photo bytes or photo-derived metadata is permitted.
- All external network requests MUST be disabled by default. Any optional feature that requires network access MUST obtain explicit, informed user consent and MUST not transmit photo content or identifying metadata.
- Telemetry and analytics are OPT-IN only. When enabled, they MUST exclude photo content and identifiable metadata. All telemetry payload schemas MUST be documented and visible to users.
- Deletion MUST be real: permanent removal of files, caches, indexes, and thumbnails on user request. Provide a verifiable "Secure Delete" flow when supported by the OS.
- Secrets (e.g., license keys) MUST be stored in the OS keychain/credential vault. No secrets in plain text files.
Rationale: Users trust the app with their personal media. A strict local-first privacy posture is non-negotiable.

### II. Performance at Scale (Large Collections, Low Latency)
- Target capacities: 100k photos per library without degradation; initial library scan MUST be incremental and cancellable.
- Startup: show first interactive grid within 1.0s on a warm start for libraries up to 100k items; cold start within 2.5s with progress feedback.
- Scrolling: maintain ≤16ms frame budget (60fps) for grid/list views with virtualization; p95 scroll input-to-paint latency ≤50ms.
- Thumbnail pipeline: background generation with backpressure; prefetch next viewport rows; LRU cache with size cap; disk cache persisted between runs.
- Indexing: parallelizable I/O with bounded concurrency; batch commits with WAL-enabled embedded DB to avoid fs sync stalls.
- Memory: enforce bounded caches; prevent unbounded image loads; use downsampling appropriate to viewport and DPR.
Rationale: Photo libraries grow large; performance keeps the app usable and delightful.

### III. Accessibility (WCAG 2.2 AA + Keyboard First)
- Keyboard navigation MUST cover all interactive elements; provide discoverable shortcuts for core actions (open, select range, zoom, delete, tag, search).
- Focus management: visible focus indicators; logical tab order; focus trapping only in modals; restore focus after dialogs.
- Contrast and text: meet WCAG 2.2 AA contrast; support system font scaling; minimum target size 44x44 CSS px or native equivalent.
- Animations: reduce motion preference respected; avoid parallax/heavy transforms when reduced motion is enabled.
Rationale: An accessible app broadens reach and improves overall UX quality.

### IV. Code Quality (Clean Architecture, Comprehensive Tests)
- Architecture: separate domains (UI, application/services, data) with dependency inversion; no cyclic dependencies; pure core where feasible.
- Testing: follow a test pyramid—unit tests for pure logic, integration tests for indexing/rendering paths, and end-to-end smoke tests for key flows.
- Coverage: minimum 80% line coverage on core modules; critical paths (import, index, search, grid render) require explicit integration tests.
- TDD preferred: write failing tests for new features/bugs before implementation; PRs MUST include tests or rationale for exceptions.
- Static analysis and formatting: enable linters and formatters in CI; zero warnings policy for new code.
- Version control: Conventional Commits; small, reviewable PRs; changelog maintained.
Rationale: Sustained velocity requires disciplined design and verification.

#### Design Principles (SOLID)
- Single-responsibility principle: A module/class should have one reason to change—one focused responsibility.
- Open–closed principle: Modules are open for extension via composition/strategies but closed for modification of stable contracts.
- Liskov substitution principle: Subtypes must be substitutable for their base types without breaking expectations.
- Interface segregation principle: Prefer small, role-specific interfaces; clients should not depend on methods they don't use.
- Dependency inversion principle: High-level policies depend on abstractions; inject dependencies via constructors/factories.

## Data Storage and Persistence
- Storage model: local-only. Use an embedded database (e.g., SQLite with WAL) for metadata index (paths, EXIF/IPTC, tags, faces) and a content-addressable cache for thumbnails and previews.
- Directory layout:
  - Library root contains user photos (unmodified unless user opts into managed imports).
- Import/indexing:
  - Non-destructive: do not move/rename originals by default.
  - Incremental scan with mtime/hash change detection; store content hash to avoid duplicate work.
  - EXIF parsing on-device; failures logged with file path and reason.
- Caching:
  - Thumbnails generated on-demand; persist to disk; enforce max size; background eviction based on LRU and age.
  - Prefetch adjacent items for smooth scrolling within cache budget.
- Backups/exports:
  - Provide export of library database and settings as a single archive; never include originals unless explicitly selected by the user.
- Security:
  - Encrypt sensitive settings at rest via OS facilities; never store raw secrets in config files.

## UI Responsiveness and Interaction Standards
- Frame budget: keep main-thread work under 8ms where possible; offload image decode/resize to worker threads/background queues.
- Virtualization: required for grids/lists; render only visible + small overscan; avoid layout thrash by using fixed row/column strategies where possible.
- Feedback: all long operations (>100ms) show progress; cancellable operations where safe (scans, thumbnailing, bulk tags).
- Input responsiveness: p95 click-to-action ≤100ms; p95 keystroke-to-feedback ≤50ms.
- Error handling: non-blocking toasts for recoverable issues; accessible alerts for critical failures; logs written with file context.
- Internationalization: UI text externalized; bidi support; date/number formatting via locale APIs.

## Governance
- Supremacy: This Constitution supersedes conflicting guidance. Exceptions require explicit, documented justification in the repo (e.g., in plan.md "Complexity Tracking").
- Amendment procedure: Propose a change via PR that updates this file with a prepended Sync Impact Report. Require approval from at least one maintainer and one QA reviewer.
- Versioning policy: Semantic versioning.
  - MAJOR: backward-incompatible governance or removal/redefinition of principles.
  - MINOR: new principles/sections or materially expanded guidance.
  - PATCH: clarifications and non-semantic edits.
- Compliance reviews: All PRs MUST include a "Constitution Check" confirming privacy, performance, accessibility, and testing impacts. CI blocks merges on check failure.

**Version**: 1.0.1 | **Ratified**: 2025-09-25 | **Last Amended**: 2025-09-26
