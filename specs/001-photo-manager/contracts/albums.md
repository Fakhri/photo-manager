# Contract: Albums Module

Spec: d:/GitHub Spec - Experiment/photo-manager/specs/001-photo-manager/spec.md
Date: 2025-09-25

## Responsibilities
- Manage auto-date albums (YYYY/MM) and custom albums
- Maintain album ordering for the grid and intra-album photo order
- Provide album previews (representative photos)
- Support drag-and-drop with multi-select operations

## Interfaces (TypeScript signatures)
```ts
export type AlbumId = string;
export type PhotoId = string;

export type AlbumType = 'auto-date' | 'custom';

export interface Album {
  id: AlbumId;
  type: AlbumType;
  label: string; // e.g., "2025/09" for auto-date (may be prefixed with "(date conflict) ")
  description?: string;
  coverPhotoId?: PhotoId | null;
  order: PhotoId[]; // ordered photo ids for album view
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface AlbumsApi {
  listAll(): Promise<Album[]>;
  getById(id: AlbumId): Promise<Album | null>;
  createCustom(label: string, description?: string): Promise<AlbumId>;
  rename(id: AlbumId, label: string): Promise<void>;
  remove(id: AlbumId): Promise<void>;
  setAlbumOrder(albumIds: AlbumId[]): Promise<void>; // grid order
  setIntraAlbumOrder(albumId: AlbumId, photoIds: PhotoId[]): Promise<void>;
  addPhotos(albumId: AlbumId, photoIds: PhotoId[]): Promise<void>;
  removePhotos(albumId: AlbumId, photoIds: PhotoId[]): Promise<void>;
  preview(albumId: AlbumId, limit?: number): Promise<PhotoId[]>; // representative ids
}
```

## Behavioral Rules
- Auto-date albums are derived from `dateTaken` buckets; membership updates on discovery.
- If a custom album collides with an auto-date label, prefix the auto-date album label with "(date conflict) ".
- Drag-and-drop operations must produce visible feedback and persist resulting orderings.

## Errors
- Operations must be transactional per album to avoid partial order corruption.
