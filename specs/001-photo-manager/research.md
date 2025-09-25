# Research: PhotoManager

Date: 2025-09-25
Spec: d:/GitHub Spec - Experiment/photo-manager/specs/001-photo-manager/spec.md

## Decisions

- Decision: EXIF parsing library
  - Choice: exifr (MIT) for EXIF/IPTC parsing in browser
  - Rationale: Mature, tree-shakeable, supports common formats; no network egress
  - Alternatives: piexifjs (limited), custom parser (higher effort)

- Decision: HEIC/WEBP handling
  - Choice: Rely on native browser decode support where available. When unavailable for HEIC, treat file as unsupported for preview but retain metadata if parsable; show placeholder tile and allow open via system handler if possible.
  - Rationale: Maintain minimal dependencies and no network; HEIC decode polyfills often require large WASM/codec payloads
  - Alternatives: WASM-based HEIC decoders (larger bundle, perf cost)

- Decision: IndexedDB schema & access pattern
  - Choice: One DB (name: photomanager), object stores: photos, albums, album_photos, tags, photo_tags, settings, caches
  - Rationale: Clear separation, scalable for thousands of records; composite keys for relations
  - Alternatives: Single store with type prefix (simpler, less queryable)

- Decision: Thumbnail cache sizing and eviction
  - Choice: Disk-backed cache entries in IndexedDB `caches` store with LRU metadata; cap to 250MB or 10k entries, whichever first; periodic eviction
  - Rationale: Bound storage, predictable perf
  - Alternatives: In-memory only (volatile), Service Worker Cache (not ideal for blob URLs)

- Decision: Content addressing for cache
  - Choice: key = hash(filePath + mtime + size + targetDims + DPR)
  - Rationale: Avoid stale reuse when files change

- Decision: Initial library scan
  - Choice: Incremental, cancellable; yield to UI via requestIdleCallback; batch IDB writes (100-500 per txn)
  - Rationale: Keep UI responsive; reduce transaction overhead

- Decision: Keyboard shortcuts and accessibility
  - Choice: Provide shortcuts: open Enter, select Space, range Shift+Click, multi Ctrl/Cmd+Click, delete Del, search Ctrl/Cmd+F; ensure ARIA roles and visible focus
  - Rationale: Align with Constitution accessibility principle

- Decision: Error handling & compatibility
  - Choice: Central error boundary for UI; graceful fallbacks for missing APIs (File System Access, HEIC decode); show actionable messages
  - Rationale: Predictable UX across browsers

## Rationale
These choices satisfy constitutional constraints: local-only privacy, performance for large libraries (virtualization, caches, batching), accessibility (keyboard-first), and code quality (clear module boundaries, testability).

## Alternatives Considered
- HEIC decode via WASM (e.g., libheif.js): better support but increases bundle size and CPU; deferred unless user opts in.
- Multiple DBs by category: adds complexity with minimal benefit at current scale.

## Open Questions (deferred)
- Deduplication policy beyond name conflict prefix for auto-date vs custom: out of scope for MVP.
- Exact cache caps subject to UX validation based on device storage.
