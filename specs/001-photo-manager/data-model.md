# Data Model: PhotoManager

Spec: d:/GitHub Spec - Experiment/photo-manager/specs/001-photo-manager/spec.md
Date: 2025-09-25

## Entities

### Photo
- id: string (content-address or generated UUID)
- path: string
- mimeType: string (e.g., image/jpeg, image/png, image/webp, image/heic, video/mp4, video/webm)
- width: number
- height: number
- sizeBytes: number
- dateTaken: string (ISO 8601) — from EXIF when present, else file creation time
- dateAdded: string (ISO 8601)
- exif: object (selected EXIF/IPTC fields)
- captions: string
- tags: string[]
- hash: string (content hash for cache addressing)

### Album
- id: string (UUID)
- type: 'auto-date' | 'custom'
- label: string (for auto-date: "YYYY/MM"; conflict resolution may prefix "(date conflict) ")
- description: string
- coverPhotoId: string | null
- order: string[] (ordered list of photo ids)
- createdAt: string (ISO 8601)
- updatedAt: string (ISO 8601)

### AlbumPreview
- albumId: string
- photoIds: string[] (representative photos)
- generatedAt: string (ISO 8601)

### Tag
- id: string (slug)
- label: string
- createdAt: string (ISO 8601)

### Caption
- photoId: string
- text: string
- updatedAt: string (ISO 8601)

### Library
- id: string (singleton id)
- albumOrder: string[] (ordered list of album ids for grid)
- settings:
  - gridSize: 'small' | 'medium' | 'large'
  - locale: string
  - theme: 'system' | 'light' | 'dark'
  - accessibility: { reduceMotion: boolean }

## Relationships
- Album 1..* —contains→ Photo (ordered)
- Photo *..* —tagged with→ Tag
- Photo 1..1 —has→ Caption (optional)
- Album 1..1 —has→ AlbumPreview

## IndexedDB Schema (proposed)
- DB: photomanager (versioned)
- Stores:
  - photos (key: id)
  - albums (key: id)
  - album_photos (key: [albumId, photoId], value: { index: number })
  - tags (key: id)
  - photo_tags (key: [photoId, tagId])
  - captions (key: photoId)
  - previews (key: albumId)
  - settings (key: id)
  - caches (key: cacheKey)
- Indexes:
  - photos.dateTaken, photos.mimeType
  - albums.type, albums.updatedAt
  - album_photos.albumId, album_photos.index

## Constraints & Invariants
- Auto-date album membership is derived from `dateTaken` buckets (YYYY/MM) and updated on discovery; custom album membership is user-managed.
- Conflict resolution: if a custom album shares the same label as an auto-date album, the auto-date label is prefixed with "(date conflict) ".
- Supported formats: JPEG, PNG, WEBP, HEIC for images; MP4/WebM for videos (previews may use poster frame).

## Non-Functional Notes
- Performance: avoid full scans for queries; use indexes and pagination/virtualization.
- Privacy: no network egress of photo bytes or derived metadata.
- Accessibility: ensure entities support a11y metadata (alt text via captions).
