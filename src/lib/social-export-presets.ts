export type SocialExportPlatform =
  | "instagram"
  | "facebook"
  | "youtube"
  | "x"
  | "linkedin"
  | "tiktok"
  | "xiaohongshu"
  | "wechat"

export type SocialExportPresetPackId = "western" | "china" | "all"

export type SocialExportPresetId =
  | "instagram-feed-square"
  | "instagram-feed-portrait"
  | "instagram-story"
  | "facebook-page-cover"
  | "facebook-cover"
  | "youtube-thumbnail"
  | "x-landscape"
  | "x-header"
  | "linkedin-post"
  | "tiktok-vertical"
  | "xiaohongshu-cover"
  | "wechat-cover"

export interface SocialExportPreset {
  id: SocialExportPresetId
  platform: SocialExportPlatform
  labelKey: string
  descriptionKey: string
  width: number
  height: number
  fileNameSuffix: string
}

export const SOCIAL_EXPORT_PRESETS: SocialExportPreset[] = [
  {
    id: "instagram-feed-square",
    platform: "instagram",
    labelKey: "presetInstagramFeedSquare",
    descriptionKey: "presetInstagramFeedSquareDesc",
    width: 1080,
    height: 1080,
    fileNameSuffix: "instagram-feed-square",
  },
  {
    id: "instagram-feed-portrait",
    platform: "instagram",
    labelKey: "presetInstagramFeedPortrait",
    descriptionKey: "presetInstagramFeedPortraitDesc",
    width: 1080,
    height: 1350,
    fileNameSuffix: "instagram-feed-portrait",
  },
  {
    id: "instagram-story",
    platform: "instagram",
    labelKey: "presetInstagramStory",
    descriptionKey: "presetInstagramStoryDesc",
    width: 1080,
    height: 1920,
    fileNameSuffix: "instagram-story",
  },
  {
    id: "youtube-thumbnail",
    platform: "youtube",
    labelKey: "presetYoutubeThumbnail",
    descriptionKey: "presetYoutubeThumbnailDesc",
    width: 1280,
    height: 720,
    fileNameSuffix: "youtube-thumbnail",
  },
  {
    id: "facebook-page-cover",
    platform: "facebook",
    labelKey: "presetFacebookPageCover",
    descriptionKey: "presetFacebookPageCoverDesc",
    width: 851,
    height: 315,
    fileNameSuffix: "facebook-page-cover",
  },
  {
    id: "facebook-cover",
    platform: "facebook",
    labelKey: "presetFacebookCover",
    descriptionKey: "presetFacebookCoverDesc",
    width: 1640,
    height: 856,
    fileNameSuffix: "facebook-group-cover",
  },
  {
    id: "x-landscape",
    platform: "x",
    labelKey: "presetXLandscape",
    descriptionKey: "presetXLandscapeDesc",
    width: 1600,
    height: 900,
    fileNameSuffix: "x-landscape",
  },
  {
    id: "x-header",
    platform: "x",
    labelKey: "presetXHeader",
    descriptionKey: "presetXHeaderDesc",
    width: 1500,
    height: 500,
    fileNameSuffix: "x-header",
  },
  {
    id: "linkedin-post",
    platform: "linkedin",
    labelKey: "presetLinkedinPost",
    descriptionKey: "presetLinkedinPostDesc",
    width: 1200,
    height: 628,
    fileNameSuffix: "linkedin-post",
  },
  {
    id: "tiktok-vertical",
    platform: "tiktok",
    labelKey: "presetTiktokVertical",
    descriptionKey: "presetTiktokVerticalDesc",
    width: 1080,
    height: 1920,
    fileNameSuffix: "tiktok-vertical",
  },
  {
    id: "xiaohongshu-cover",
    platform: "xiaohongshu",
    labelKey: "presetXiaohongshuCover",
    descriptionKey: "presetXiaohongshuCoverDesc",
    width: 1080,
    height: 1440,
    fileNameSuffix: "xiaohongshu-cover",
  },
  {
    id: "wechat-cover",
    platform: "wechat",
    labelKey: "presetWechatCover",
    descriptionKey: "presetWechatCoverDesc",
    width: 900,
    height: 383,
    fileNameSuffix: "wechat-cover",
  },
]

export const SOCIAL_EXPORT_PRESET_PACKS: Record<
  SocialExportPresetPackId,
  SocialExportPresetId[]
> = {
  western: [
    "instagram-feed-square",
    "instagram-feed-portrait",
    "instagram-story",
    "youtube-thumbnail",
    "facebook-page-cover",
    "x-header",
    "linkedin-post",
  ],
  china: [
    "xiaohongshu-cover",
    "wechat-cover",
    "tiktok-vertical",
  ],
  all: SOCIAL_EXPORT_PRESETS.map((preset) => preset.id),
}

export const SOCIAL_EXPORT_DEFAULT_PRESET_IDS: SocialExportPresetId[] = [
  ...SOCIAL_EXPORT_PRESET_PACKS.western,
]

export const SOCIAL_EXPORT_PLATFORMS: SocialExportPlatform[] = [
  "instagram",
  "youtube",
  "facebook",
  "x",
  "linkedin",
  "tiktok",
  "xiaohongshu",
  "wechat",
]

export function getSocialExportDefaultPresetIds(
  locale: string | null | undefined
): SocialExportPresetId[] {
  if (locale === "zh-CN") return [...SOCIAL_EXPORT_PRESET_PACKS.china]
  return [...SOCIAL_EXPORT_PRESET_PACKS.western]
}

export function getSocialExportPreset(
  id: string | null | undefined
): SocialExportPreset | null {
  if (!id) return null
  return SOCIAL_EXPORT_PRESETS.find((preset) => preset.id === id) ?? null
}

export function getSocialExportPresetsByPlatform(
  platform: SocialExportPlatform
): SocialExportPreset[] {
  return SOCIAL_EXPORT_PRESETS.filter((preset) => preset.platform === platform)
}
