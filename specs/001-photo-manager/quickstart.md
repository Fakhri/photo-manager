# Quickstart: PhotoManager

This guide validates primary user journeys end-to-end.

## Prerequisites
- Modern browser with IndexedDB and File System Access support

## Steps
1. Open the app and import a folder with thousands of photos.
   - Expect: Albums grid shows auto date-based albums (YYYY/MM).
2. Create a custom album and add selected photos via multi-select.
   - Expect: Album appears in grid; album order can be changed via drag-and-drop with visual feedback.
3. Open a date-based album, rearrange photos, and add captions/tags.
   - Expect: Changes persist across reload; tags/captions searchable.
4. Use search to filter by a date range and a tag.
   - Expect: Results update quickly and only show matches.
5. Resize window or rotate device.
   - Expect: Grid and tiles remain responsive with no layout breakage.
6. Verify privacy: Disable network and confirm no attempts to upload content.
   - Expect: App functions locally without network access.
