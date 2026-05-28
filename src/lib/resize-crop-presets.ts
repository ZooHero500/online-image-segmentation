export type CropPresetSlug =
  | "instagram-post"
  | "instagram-story"
  | "youtube-thumbnail"
  | "facebook-cover"
  | "x-post"
  | "linkedin-post"

export interface CropPreset {
  slug: CropPresetSlug
  labelKey: string
  width: number
  height: number
}

export const SOCIAL_CROP_PRESETS: CropPreset[] = [
  { slug: "instagram-post", labelKey: "cropPresetInstagramPost", width: 1080, height: 1080 },
  { slug: "instagram-story", labelKey: "cropPresetInstagramStory", width: 1080, height: 1920 },
  { slug: "youtube-thumbnail", labelKey: "cropPresetYoutubeThumbnail", width: 1280, height: 720 },
  { slug: "facebook-cover", labelKey: "cropPresetFacebookCover", width: 1640, height: 924 },
  { slug: "x-post", labelKey: "cropPresetXPost", width: 1600, height: 900 },
  { slug: "linkedin-post", labelKey: "cropPresetLinkedInPost", width: 1200, height: 627 },
]

export function getCropPreset(slug: string | null | undefined): CropPreset | null {
  if (!slug) return null
  return SOCIAL_CROP_PRESETS.find((preset) => preset.slug === slug) ?? null
}

export function getCropPresetAspectRatio(preset: Pick<CropPreset, "width" | "height">): number {
  return preset.width / preset.height
}

export function getCropPresetFromToolSlug(toolSlug: string): CropPreset | null {
  const map: Record<string, CropPresetSlug> = {
    "crop-image": "instagram-post",
    "crop-for-instagram": "instagram-post",
    "instagram-story-crop": "instagram-story",
    "youtube-thumbnail-crop": "youtube-thumbnail",
  }

  return getCropPreset(map[toolSlug])
}
