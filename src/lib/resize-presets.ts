export type ResizePresetSlug =
  | "square"
  | "landscape-4-3"
  | "portrait-3-4"
  | "widescreen-16-9"
  | "vertical-9-16"
  | "instagram-square"
  | "instagram-story"
  | "youtube-thumbnail"
  | "facebook-cover"

export type ResizePresetGroup = "ratio" | "social"

export interface ResizePreset {
  slug: ResizePresetSlug
  labelKey: string
  width: number
  height: number
  group: ResizePresetGroup
}

export const RESIZE_PRESETS: ResizePreset[] = [
  { slug: "square", labelKey: "preset_1_1", width: 1080, height: 1080, group: "ratio" },
  { slug: "landscape-4-3", labelKey: "preset_4_3", width: 1200, height: 900, group: "ratio" },
  { slug: "portrait-3-4", labelKey: "preset_3_4", width: 900, height: 1200, group: "ratio" },
  { slug: "widescreen-16-9", labelKey: "preset_16_9", width: 1920, height: 1080, group: "ratio" },
  { slug: "vertical-9-16", labelKey: "preset_9_16", width: 1080, height: 1920, group: "ratio" },
  { slug: "instagram-square", labelKey: "preset_instagram_square", width: 1080, height: 1080, group: "social" },
  { slug: "instagram-story", labelKey: "preset_instagram_story", width: 1080, height: 1920, group: "social" },
  { slug: "youtube-thumbnail", labelKey: "preset_youtube_thumbnail", width: 1280, height: 720, group: "social" },
  { slug: "facebook-cover", labelKey: "preset_facebook_cover", width: 1640, height: 924, group: "social" },
]

export const RATIO_RESIZE_PRESETS = RESIZE_PRESETS.filter((preset) => preset.group === "ratio")
export const SOCIAL_RESIZE_PRESETS = RESIZE_PRESETS.filter((preset) => preset.group === "social")

export function getResizePreset(slug: string | null | undefined): ResizePreset | null {
  if (!slug) return null
  return RESIZE_PRESETS.find((preset) => preset.slug === slug) ?? null
}

export function getResizePresetAspectRatio(preset: Pick<ResizePreset, "width" | "height">): number {
  return preset.width / preset.height
}
