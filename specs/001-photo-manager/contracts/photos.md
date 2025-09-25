# Contract: Photos Module

Spec: d:/GitHub Spec - Experiment/photo-manager/specs/001-photo-manager/spec.md
Date: 2025-09-25

## Responsibilities
- Import files selected by the user (no uploads; local only)
- Parse EXIF/IPTC metadata on-device
- Generate and cache thumbnails/previews
- Provide read APIs for photo metadata and content URLs

## Interfaces (TypeScript signatures)
```ts
export type PhotoId = string;

export interface PhotoMeta {
  id: PhotoId;
  path: string;
  mimeType: string; // image/jpeg, image/png, image/webp, image/heic, video/mp4, video/webm
  width: number;
  height: number;
  sizeBytes: number;
  dateTaken: string; // ISO 8601
  dateAdded: string; // ISO 8601
  exif?: Record<string, unknown>;
  caption?: string;
  tags: string[];
  hash: string;
}

export interface PhotosApi {
  import(files: File[]): Promise<PhotoMeta[]>; // incremental, cancellable via AbortSignal in options in impl
  readMetaById(id: PhotoId): Promise<PhotoMeta | null>;
  updateCaption(id: PhotoId, caption: string): Promise<void>;
  updateTags(id: PhotoId, tags: string[]): Promise<void>;
  createThumbnail(id: PhotoId, target: { width: number; height: number; dpr: number }): Promise<string>; // returns objectURL or data URL
  getThumbnail(id: PhotoId, target: { width: number; height: number; dpr: number }): Promise<string | null>;
}
```

## Behavioral Rules
- EXIF capture date is preferred; fallback to file creation time.
- Supported formats: JPEG, PNG, WEBP, HEIC (images); MP4/WebM (videos).
- Thumbnails are generated off the main thread when possible; cache entries are content-addressed.

## Errors
- Import failures MUST not block UI; return partial successes and error list with file path and reason.
- Missing codec/unsupported format returns a placeholder thumbnail.
