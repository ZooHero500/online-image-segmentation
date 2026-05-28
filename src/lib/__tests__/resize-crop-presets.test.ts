import { describe, expect, it } from "vitest"
import {
  getCropPreset,
  getCropPresetAspectRatio,
  getCropPresetFromToolSlug,
  SOCIAL_CROP_PRESETS,
} from "../resize-crop-presets"

describe("resize crop presets", () => {
  it("exposes named social crop sizes", () => {
    expect(SOCIAL_CROP_PRESETS).toContainEqual({
      slug: "instagram-post",
      labelKey: "cropPresetInstagramPost",
      width: 1080,
      height: 1080,
    })
    expect(SOCIAL_CROP_PRESETS).toContainEqual({
      slug: "youtube-thumbnail",
      labelKey: "cropPresetYoutubeThumbnail",
      width: 1280,
      height: 720,
    })
  })

  it("looks up presets by slug", () => {
    expect(getCropPreset("instagram-story")).toMatchObject({
      slug: "instagram-story",
      width: 1080,
      height: 1920,
    })
    expect(getCropPreset("missing")).toBeNull()
    expect(getCropPreset(null)).toBeNull()
  })

  it("calculates aspect ratio from output dimensions", () => {
    expect(getCropPresetAspectRatio({ width: 1280, height: 720 })).toBeCloseTo(16 / 9)
    expect(getCropPresetAspectRatio({ width: 1080, height: 1920 })).toBeCloseTo(9 / 16)
  })

  it("maps pSEO crop slugs to resize presets", () => {
    expect(getCropPresetFromToolSlug("crop-for-instagram")).toMatchObject({
      slug: "instagram-post",
    })
    expect(getCropPresetFromToolSlug("youtube-thumbnail-crop")).toMatchObject({
      slug: "youtube-thumbnail",
    })
    expect(getCropPresetFromToolSlug("compress-image")).toBeNull()
  })
})
