# Contract: Search Module

Spec: d:/GitHub Spec - Experiment/photo-manager/specs/001-photo-manager/spec.md
Date: 2025-09-25

## Responsibilities
- Provide filtering and search by date range, tags, and captions
- Support global search and within-album filtering
- Return results suitable for virtualized grids

## Interfaces (TypeScript signatures)
```ts
export interface DateRange { from?: string; to?: string; } // ISO dates inclusive

export interface SearchQuery {
  text?: string; // matches captions and tags
  tags?: string[];
  dateRange?: DateRange;
  albumId?: string; // optional: limit to a specific album
}

export interface SearchResult {
  photoIds: string[]; // ordered for display
  total: number;
}

export interface SearchApi {
  search(q: SearchQuery): Promise<SearchResult>;
  suggestTags(prefix: string): Promise<string[]>;
}
```

## Behavioral Rules
- Text queries match captions and exact tag labels; tag filter is AND by default.
- Date range filters by `dateTaken`.
- Results should be paginable/streamable for large sets.
