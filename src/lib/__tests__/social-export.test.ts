import { describe, expect, it } from "vitest"
import {
  calculateSocialExportBaseScale,
  calculateSocialExportDrawTransform,
  clampSocialExportScale,
  createSocialExportCropState,
  createSocialExportCropStateMap,
  getSocialExportBaseName,
  getSocialExportFileName,
  getSocialExportOutputExtension,
  resetSocialExportCropForFitMode,
} from "../social-export"
import {
  SOCIAL_EXPORT_DEFAULT_PRESET_IDS,
  SOCIAL_EXPORT_PRESETS,
  getSocialExportPreset,
  getSocialExportPresetsByPlatform,
} from "../social-export-presets"

function createMockImage(width: number, height: number): HTMLImageElement {
  return {
    naturalWidth: width,
    naturalHeight: height,
  } as HTMLImageElement
}

describe("social export presets", () => {
  it("keeps the MVP preset set in route order", () => {
    expect(SOCIAL_EXPORT_PRESETS.map((preset) => preset.id)).toEqual([
      "instagram-feed-square",
      "instagram-feed-portrait",
      "instagram-story",
      "youtube-thumbnail",
      "facebook-page-cover",
      "facebook-cover",
      "x-landscape",
      "x-header",
      "linkedin-post",
      "tiktok-vertical",
      "xiaohongshu-cover",
      "wechat-cover",
    ])
  })

  it("selects creator-focused defaults", () => {
    expect(SOCIAL_EXPORT_DEFAULT_PRESET_IDS).toEqual([
      "instagram-feed-square",
      "instagram-feed-portrait",
      "instagram-story",
      "youtube-thumbnail",
      "facebook-page-cover",
      "x-header",
      "linkedin-post",
    ])
  })

  it("groups presets by platform", () => {
    expect(getSocialExportPresetsByPlatform("instagram")).toHaveLength(3)
    expect(getSocialExportPresetsByPlatform("youtube").map((preset) => preset.id)).toEqual([
      "youtube-thumbnail",
    ])
    expect(getSocialExportPresetsByPlatform("linkedin").map((preset) => preset.id)).toEqual([
      "linkedin-post",
    ])
  })
})

describe("social export transforms", () => {
  it("calculates fill scale to cover the target", () => {
    const image = createMockImage(2000, 1000)
    const preset = getSocialExportPreset("instagram-feed-square")!

    expect(calculateSocialExportBaseScale(image, preset, "fill")).toBeCloseTo(1.08)
    expect(calculateSocialExportBaseScale(image, preset, "fit")).toBeCloseTo(0.54)
  })

  it("centers the image and applies offsets", () => {
    const image = createMockImage(2000, 1000)
    const preset = getSocialExportPreset("instagram-feed-square")!
    const transform = calculateSocialExportDrawTransform(
      image,
      preset,
      createSocialExportCropState({ offsetX: 20, offsetY: -10 })
    )

    expect(transform.width).toBeCloseTo(2160)
    expect(transform.height).toBeCloseTo(1080)
    expect(transform.x).toBeCloseTo(-520)
    expect(transform.y).toBeCloseTo(-10)
  })

  it("clamps scale based on fit mode", () => {
    expect(clampSocialExportScale(0.2, "fill")).toBe(1)
    expect(clampSocialExportScale(0.2, "fit")).toBe(0.5)
    expect(clampSocialExportScale(9, "fit")).toBe(3)
  })

  it("resets offsets when changing fit mode", () => {
    const crop = createSocialExportCropState({
      fitMode: "fill",
      scale: 0.25,
      offsetX: 100,
      offsetY: -100,
    })

    expect(resetSocialExportCropForFitMode(crop, "fit")).toEqual({
      fitMode: "fit",
      scale: 0.5,
      offsetX: 0,
      offsetY: 0,
    })
  })

  it("creates one crop state per preset", () => {
    const map = createSocialExportCropStateMap()

    expect(Object.keys(map)).toHaveLength(SOCIAL_EXPORT_PRESETS.length)
    expect(map["wechat-cover"]).toMatchObject({ fitMode: "fill", scale: 1 })
  })
})

describe("social export file naming", () => {
  it("maps output formats to extensions", () => {
    expect(getSocialExportOutputExtension("image/png")).toBe("png")
    expect(getSocialExportOutputExtension("image/jpeg")).toBe("jpg")
    expect(getSocialExportOutputExtension("image/webp")).toBe("webp")
  })

  it("builds readable export file names", () => {
    const preset = getSocialExportPreset("youtube-thumbnail")!

    expect(getSocialExportBaseName("launch.poster.final.png")).toBe(
      "launch.poster.final"
    )
    expect(getSocialExportFileName("launch.png", preset, "image/jpeg")).toBe(
      "launch_youtube-thumbnail_1280x720.jpg"
    )
  })
})
