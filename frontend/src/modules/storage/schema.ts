// Schema definitions and migrations for IndexedDB

export const DB_NAME = 'photomanager'
export const DB_VERSION = 1

export const STORES = {
  photos: 'photos',
  albums: 'albums',
  album_photos: 'album_photos',
  tags: 'tags',
  photo_tags: 'photo_tags',
  captions: 'captions',
  previews: 'previews',
  settings: 'settings',
  caches: 'caches',
} as const

export type StoreName = (typeof STORES)[keyof typeof STORES]

export async function migrate(db: IDBDatabase) {
  // v1 schema
  if (!db.objectStoreNames.contains(STORES.photos)) {
    const photos = db.createObjectStore(STORES.photos, { keyPath: 'id' })
    photos.createIndex('dateTaken', 'dateTaken', { unique: false })
    photos.createIndex('mimeType', 'mimeType', { unique: false })
  }
  if (!db.objectStoreNames.contains(STORES.albums)) {
    const albums = db.createObjectStore(STORES.albums, { keyPath: 'id' })
    albums.createIndex('type', 'type', { unique: false })
    albums.createIndex('updatedAt', 'updatedAt', { unique: false })
  }
  if (!db.objectStoreNames.contains(STORES.album_photos)) {
    const albumPhotos = db.createObjectStore(STORES.album_photos, { keyPath: ['albumId', 'photoId'] as unknown as string })
    albumPhotos.createIndex('albumId', 'albumId', { unique: false })
    albumPhotos.createIndex('index', 'index', { unique: false })
  }
  if (!db.objectStoreNames.contains(STORES.tags)) {
    db.createObjectStore(STORES.tags, { keyPath: 'id' })
  }
  if (!db.objectStoreNames.contains(STORES.photo_tags)) {
    const pt = db.createObjectStore(STORES.photo_tags, { keyPath: ['photoId', 'tagId'] as unknown as string })
    pt.createIndex('photoId', 'photoId', { unique: false })
    pt.createIndex('tagId', 'tagId', { unique: false })
  }
  if (!db.objectStoreNames.contains(STORES.captions)) {
    db.createObjectStore(STORES.captions, { keyPath: 'photoId' })
  }
  if (!db.objectStoreNames.contains(STORES.previews)) {
    db.createObjectStore(STORES.previews, { keyPath: 'albumId' })
  }
  if (!db.objectStoreNames.contains(STORES.settings)) {
    db.createObjectStore(STORES.settings, { keyPath: 'id' })
  }
  if (!db.objectStoreNames.contains(STORES.caches)) {
    db.createObjectStore(STORES.caches, { keyPath: 'cacheKey' })
  }
}
