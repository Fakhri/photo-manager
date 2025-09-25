# Contract: UI Module

Spec: d:/GitHub Spec - Experiment/photo-manager/specs/001-photo-manager/spec.md
Date: 2025-09-25

## Responsibilities
- Render responsive grid and album views (CSS Grid + Flexbox)
- Provide keyboard navigation, visible focus, and accessible labels
- Implement drag-and-drop with multi-select and visual feedback

## Interfaces (TypeScript signatures)
```ts
export interface UiApi {
  showAlbumsGrid(albumIds: string[]): void;
  showAlbum(albumId: string, photoIds: string[]): void;
  setDragVisuals(enabled: boolean): void;
  setSelection(ids: string[]): void;
}
```

## Behavioral Rules
- Maintain ≤16ms frame budget for scrolling grids via virtualization.
- Respect reduced motion; avoid heavy transforms when enabled.
- Provide ARIA roles and names for controls; restore focus after dialogs.
