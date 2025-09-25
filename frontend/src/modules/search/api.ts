// Search module API per specs/001-photo-manager/contracts/search.md

export interface DateRange { from?: string; to?: string }

export interface SearchQuery {
  text?: string
  tags?: string[]
  dateRange?: DateRange
  albumId?: string
}

export interface SearchResult {
  photoIds: string[]
  total: number
}

export interface SearchApi {
  search(q: SearchQuery): Promise<SearchResult>
  suggestTags(prefix: string): Promise<string[]>
}

// Placeholder implementation
export const search: Partial<SearchApi> = {}
