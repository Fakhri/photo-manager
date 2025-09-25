// EXIF utilities (skeleton) per FR-014: prefer EXIF capture date with fallback

export interface ExtractedDates {
  dateTaken: string // ISO 8601
  dateAdded: string // ISO 8601
}

export async function extractDates(_file: File): Promise<ExtractedDates> {
  // TODO: implement with exifr; fallback to file lastModified
  const nowIso = new Date().toISOString()
  return { dateTaken: nowIso, dateAdded: nowIso }
}
