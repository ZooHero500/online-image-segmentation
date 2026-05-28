export type ResizePresetSlug =
  | "instagram-square"
  | "instagram-story"
  | "youtube-thumbnail"
  | "facebook-cover"
  | "landscape"
  | "portrait"

export interface ResizePreset {
  slug: ResizePresetSlug
  labelKey: string
  width: number
  height: number
}

export const RESIZE_PRESETS: ResizePreset[] = [
  { slug: "instagram-square", labelKey: "preset_instagram_square", width: 1080, height: 1080 },
  { slug: "instagram-story", labelKey: "preset_instagram_story", width: 1080, height: 1920 },
  { slug: "youtube-thumbnail", labelKey: "preset_youtube_thumbnail", width: 1280, height: 720 },
  { slug: "facebook-cover", labelKey: "preset_facebook_cover", width: 1640, height: 924 },
  { slug: "landscape", labelKey: "preset_4_3", width: 1200, height: 900 },
  { slug: "portrait", labelKey: "preset_3_4", width: 900, height: 1200 },
]

export function getResizePreset(slug: string | null | undefined): ResizePreset | null {
  if (!slug) return null
  return RESIZE_PRESETS.find((preset) => preset.slug === slug) ?? null
}

export function getResizePresetAspectRatio(preset: Pick<ResizePreset, "width" | "height">): number {
  return preset.width / preset.height
}
