// Storage module skeleton per contracts/storage.md

export interface Tx {
  done(): Promise<void>
}

export interface StorageApi {
  withTx<T>(stores: string[], fn: (tx: Tx) => Promise<T>): Promise<T>
  get<T>(store: string, key: IDBValidKey): Promise<T | undefined>
  put<T>(store: string, value: T, key?: IDBValidKey): Promise<void>
  del(store: string, key: IDBValidKey): Promise<void>
  indexGetAll<T>(store: string, index: string, query?: IDBKeyRange | IDBValidKey): Promise<T[]>
}

// Placeholder implementation to satisfy type imports in tests
export const storage: StorageApi = {
  async withTx(stores, fn) {
    const tx: Tx = { async done() {} }
    return fn(tx)
  },
  async get() {
    return undefined
  },
  async put() {},
  async del() {},
  async indexGetAll() {
    return [] as unknown as never
  },
}
