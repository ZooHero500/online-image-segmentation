import { describe, it, expect } from "vitest"
import { computeScale, resolveOutputMimeType, MAX_CANVAS_AREA } from "../image-canvas"

describe("computeScale", () => {
  it("returns 1 when image is within limits", () => {
    expect(computeScale(1000, 1000)).toBe(1)
  })
  it("downscales when area exceeds MAX_CANVAS_AREA", () => {
    const big = Math.ceil(Math.sqrt(MAX_CANVAS_AREA)) + 2000
    const scale = computeScale(big, big)
    expect(scale).toBeLessThan(1)
    expect(big * scale * big * scale).toBeLessThanOrEqual(MAX_CANVAS_AREA + 1)
  })
  it("clamps a very wide image by max dimension", () => {
    const scale = computeScale(40000, 100)
    expect(40000 * scale).toBeLessThanOrEqual(16384 + 0.5)
  })
})

describe("resolveOutputMimeType", () => {
  it("keeps jpeg and png", () => {
    expect(resolveOutputMimeType("image/jpeg")).toBe("image/jpeg")
    expect(resolveOutputMimeType("image/png")).toBe("image/png")
  })
  it("converts webp and unknown to png", () => {
    expect(resolveOutputMimeType("image/webp")).toBe("image/png")
    expect(resolveOutputMimeType("image/gif")).toBe("image/png")
  })
})
