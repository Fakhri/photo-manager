// UI module API per specs/001-photo-manager/contracts/ui.md

export interface UiApi {
  showAlbumsGrid(albumIds: string[]): void
  showAlbum(albumId: string, photoIds: string[]): void
  setDragVisuals(enabled: boolean): void
  setSelection(ids: string[]): void
}

export const ui: Partial<UiApi> = {}
