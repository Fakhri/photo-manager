// Albums module API per specs/001-photo-manager/contracts/albums.md

export type AlbumId = string
export type PhotoId = string

export type AlbumType = 'auto-date' | 'custom'

export interface Album {
  id: AlbumId
  type: AlbumType
  label: string
  description?: string
  coverPhotoId?: PhotoId | null
  order: PhotoId[]
  createdAt: string
  updatedAt: string
}

export interface AlbumsApi {
  listAll(): Promise<Album[]>
  getById(id: AlbumId): Promise<Album | null>
  createCustom(label: string, description?: string): Promise<AlbumId>
  rename(id: AlbumId, label: string): Promise<void>
  remove(id: AlbumId): Promise<void>
  setAlbumOrder(albumIds: AlbumId[]): Promise<void>
  setIntraAlbumOrder(albumId: AlbumId, photoIds: PhotoId[]): Promise<void>
  addPhotos(albumId: AlbumId, photoIds: PhotoId[]): Promise<void>
  removePhotos(albumId: AlbumId, photoIds: PhotoId[]): Promise<void>
  preview(albumId: AlbumId, limit?: number): Promise<PhotoId[]>
}

// Placeholder implementation
export const albums: Partial<AlbumsApi> = {}
