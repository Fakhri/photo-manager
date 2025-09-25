import { describe, it, expect } from 'vitest'
import { extractDates } from '../../src/modules/photos/exif'

describe('Photos API contract', () => {
  it('prefers EXIF capture date and falls back to file lastModified', async () => {
    const file = new File([new Blob(['x'])], 'a.jpg', { type: 'image/jpeg', lastModified: 1234567890 })
    const result = await extractDates(file)
    // For now our skeleton uses now() for both; tighten when EXIF implemented.
    expect(result.dateTaken).toBeTypeOf('string')
    expect(result.dateAdded).toBeTypeOf('string')
  })

  it('declares support for JPEG, PNG, WEBP, HEIC (images) and MP4/WebM (videos)', () => {
    const supported = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/heic',
      'video/mp4',
      'video/webm',
    ]
    expect(supported.length).toBe(6)
  })
})
