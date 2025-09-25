// Photos module API per specs/001-photo-manager/contracts/photos.md

export type PhotoId = string

export interface PhotoMeta {
  id: PhotoId
  path: string
  mimeType: string // image/jpeg, image/png, image/webp, image/heic, video/mp4, video/webm
  width: number
  height: number
  sizeBytes: number
  dateTaken: string // ISO 8601
  dateAdded: string // ISO 8601
  exif?: Record<string, unknown>
  caption?: string
  tags: string[]
  hash: string
}

export interface PhotosApi {
  import(files: File[]): Promise<PhotoMeta[]>
  readMetaById(id: PhotoId): Promise<PhotoMeta | null>
  updateCaption(id: PhotoId, caption: string): Promise<void>
  updateTags(id: PhotoId, tags: string[]): Promise<void>
  createThumbnail(id: PhotoId, target: { width: number; height: number; dpr: number }): Promise<string>
  getThumbnail(id: PhotoId, target: { width: number; height: number; dpr: number }): Promise<string | null>
}

// Placeholder implementation (to be replaced in T020–T022)
export const photos: Partial<PhotosApi> = {}
