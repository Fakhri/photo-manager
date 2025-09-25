# Contract: Storage Module

Spec: d:/GitHub Spec - Experiment/photo-manager/specs/001-photo-manager/spec.md
Date: 2025-09-25

## Responsibilities
- Persist photos, albums, tags, captions, previews, settings in IndexedDB
- Provide transactions for atomic updates
- Expose migrations for schema versioning

## Interfaces (TypeScript signatures)
```ts
export interface Tx {
  done(): Promise<void>;
}

export interface StorageApi {
  withTx<T>(stores: string[], fn: (tx: Tx) => Promise<T>): Promise<T>;
  get<T>(store: string, key: IDBValidKey): Promise<T | undefined>;
  put<T>(store: string, value: T, key?: IDBValidKey): Promise<void>;
  del(store: string, key: IDBValidKey): Promise<void>;
  indexGetAll<T>(store: string, index: string, query?: IDBKeyRange | IDBValidKey): Promise<T[]>;
}
```

## Behavioral Rules
- Use composite keys for relations (e.g., `[albumId, photoId]`).
- Batch writes (100–500 records per transaction) to reduce overhead.
- Enforce cache caps and trigger LRU eviction periodically.
