import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  splitCarousel, getSlideSize, clampSlideCount, getCompositeAspect,
  MIN_SLIDES, MAX_SLIDES,
} from "../carousel-splitter"

function createMockImage(width: number, height: number): HTMLImageElement {
  return { naturalWidth: width, naturalHeight: height, width, height, complete: true } as unknown as HTMLImageElement
}
function mockCanvas() {
  const ctx = { drawImage: vi.fn(), fillRect: vi.fn(), fillStyle: "" }
  const canvas = {
    width: 0, height: 0,
    getContext: vi.fn(() => ctx),
    toBlob: vi.fn((cb: BlobCallback, type?: string) => cb(new Blob(["x"], { type: type || "image/png" }))),
  }
  return { canvas, ctx }
}

describe("clampSlideCount", () => {
  it("clamps below min and above max", () => {
    expect(clampSlideCount(1)).toBe(MIN_SLIDES)
    expect(clampSlideCount(99)).toBe(MAX_SLIDES)
    expect(clampSlideCount(5)).toBe(5)
  })
  it("rounds non-integers", () => {
    expect(clampSlideCount(3.7)).toBe(4)
  })
})

describe("getSlideSize", () => {
  const img = createMockImage(3000, 2000)
  it("returns 1080x1350 for 4:5", () => {
    expect(getSlideSize("4:5", img, 3)).toEqual({ w: 1080, h: 1350 })
  })
  it("returns 1080x1080 for 1:1", () => {
    expect(getSlideSize("1:1", img, 3)).toEqual({ w: 1080, h: 1080 })
  })
  it("derives native column size for original", () => {
    expect(getSlideSize("original", img, 3)).toEqual({ w: 1000, h: 2000 })
  })
})

describe("getCompositeAspect", () => {
  it("4:5 with 3 slides => 3 * (1080/1350)", () => {
    expect(getCompositeAspect("4:5", createMockImage(100, 100), 3)).toBeCloseTo(3 * (1080 / 1350))
  })
})

describe("splitCarousel", () => {
  beforeEach(() => {
    const { canvas } = mockCanvas()
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") return canvas as unknown as HTMLCanvasElement
      return document.createElement(tag)
    })
  })

  it("produces N slides", async () => {
    const image = createMockImage(3240, 1350)
    const slides = await splitCarousel(
      image,
      { slideCount: 3, aspect: "4:5", offsetX: 0, offsetY: 0, scale: 1 },
      { displayWidth: 3240, displayHeight: 1350 },
      "image/png",
    )
    expect(slides).toHaveLength(3)
    expect(slides.map((s) => s.index)).toEqual([1, 2, 3])
  })

  it("each 4:5 slide reports 1080x1350", async () => {
    const image = createMockImage(3240, 1350)
    const slides = await splitCarousel(
      image,
      { slideCount: 3, aspect: "4:5", offsetX: 0, offsetY: 0, scale: 1 },
      { displayWidth: 3240, displayHeight: 1350 },
      "image/png",
    )
    for (const s of slides) { expect(s.width).toBe(1080); expect(s.height).toBe(1350) }
  })

  it("clamps an out-of-range slideCount", async () => {
    const image = createMockImage(2000, 1000)
    const slides = await splitCarousel(
      image,
      { slideCount: 50, aspect: "1:1", offsetX: 0, offsetY: 0, scale: 1 },
      { displayWidth: 2000, displayHeight: 1000 },
      "image/png",
    )
    expect(slides).toHaveLength(MAX_SLIDES)
  })
})
