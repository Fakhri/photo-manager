// Thumbnail pipeline skeleton per plan/research

export interface ThumbnailTarget {
  width: number
  height: number
  dpr: number
}

export async function createThumbnail(_photoId: string, _target: ThumbnailTarget): Promise<string> {
  // TODO: implement worker-based resize and cache
  return ''
}

export async function getThumbnail(_photoId: string, _target: ThumbnailTarget): Promise<string | null> {
  // TODO: fetch from cache if available
  return null
}
