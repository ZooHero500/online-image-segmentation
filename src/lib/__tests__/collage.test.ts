import { afterEach, describe, expect, it, vi } from "vitest"
import {
  assignImagesToFrames,
  calculateFrameRects,
  calculateImageTransform,
  createCollageState,
  exportCollageImage,
  getCollageBaseName,
  getCollageOutputExtension,
  getFramePathData,
  getFramePathPoints,
  reframeCollageState,
  switchCollageTemplate,
  updateFrameImage,
} from "../collage"
import { COLLAGE_TEMPLATES, getDefaultArtboardForTemplate } from "../collage-presets"

afterEach(() => {
  vi.restoreAllMocks()
})

function createMockImage(width: number, height: number): HTMLImageElement {
  return {
    naturalWidth: width,
    naturalHeight: height,
    width,
    height,
  } as unknown as HTMLImageElement
}

function createMockCanvas(ctx: Record<string, unknown>) {
  return {
    width: 0,
    height: 0,
    getContext: vi.fn(() => ctx),
    toBlob: vi.fn((cb: BlobCallback, type?: string) => {
      cb(new Blob(["collage"], { type: type ?? "image/png" }))
    }),
  }
}

describe("collage presets", () => {
  it("provides the approved MVP template set", () => {
    expect(COLLAGE_TEMPLATES.map((template) => template.id)).toEqual([
      "two-vertical",
      "two-horizontal",
      "diagonal-duo",
      "three-hero",
      "three-columns",
      "four-grid",
      "five-mosaic",
      "six-grid",
      "story-stack",
      "story-diagonal",
    ])
  })

  it("uses the story artboard for story templates", () => {
    expect(getDefaultArtboardForTemplate("story-stack")).toMatchObject({
      width: 1080,
      height: 1920,
    })
    expect(getDefaultArtboardForTemplate("story-diagonal")).toMatchObject({
      width: 1080,
      height: 1920,
    })
  })
})

describe("collage model", () => {
  it("creates one frame per template slot", () => {
    const state = createCollageState("four-grid")

    expect(state.templateId).toBe("four-grid")
    expect(state.frames).toHaveLength(4)
    expect(state.frames.map((frame) => frame.slotId)).toEqual([
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ])
    expect(state.selectedFrameId).toBe(state.frames[0].id)
  })

  it("assigns uploaded images to empty frames in order", () => {
    const state = createCollageState("four-grid")
    const images = [
      { id: "img-a", fileName: "a.jpg", image: createMockImage(800, 600) },
      { id: "img-b", fileName: "b.jpg", image: createMockImage(600, 800) },
    ]

    const next = assignImagesToFrames(state, images)

    expect(next.frames[0].image?.imageId).toBe("img-a")
    expect(next.frames[1].image?.imageId).toBe("img-b")
    expect(next.frames[2].image).toBeNull()
  })

  it("resets image transforms when switching templates", () => {
    const state = assignImagesToFrames(createCollageState("story-diagonal"), [
      { id: "img-a", fileName: "a.jpg", image: createMockImage(800, 600) },
    ])
    const adjusted = updateFrameImage(state, state.frames[0].id, {
      offsetX: 180,
      offsetY: -120,
      scale: 2,
      rotation: 90,
    })

    const next = reframeCollageState(adjusted, "six-grid")

    expect(next.frames[0].image).toMatchObject({
      imageId: "img-a",
      fitMode: "fill",
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
    })
  })

  it("rebuilds switched templates from the full image list", () => {
    const images = [
      { id: "img-a", fileName: "a.jpg", image: createMockImage(800, 600) },
      { id: "img-b", fileName: "b.jpg", image: createMockImage(800, 600) },
      { id: "img-c", fileName: "c.jpg", image: createMockImage(800, 600) },
    ]
    const sixGrid = assignImagesToFrames(createCollageState("six-grid"), images)
    const adjusted = updateFrameImage(sixGrid, sixGrid.frames[0].id, {
      offsetY: 180,
      scale: 1.7,
    })
    const twoUp = switchCollageTemplate(adjusted, "two-vertical", images)

    const backToSixGrid = switchCollageTemplate(twoUp, "six-grid", images)

    expect(backToSixGrid.frames.slice(0, 3).map((frame) => frame.image?.imageId)).toEqual([
      "img-a",
      "img-b",
      "img-c",
    ])
    expect(backToSixGrid.frames[0].image).toMatchObject({
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
    })
  })

  it("calculates frame rectangles from artboard, margin, spacing, and slots", () => {
    const state = {
      ...createCollageState("four-grid"),
      artboard: { id: "test", labelKey: "test", width: 1000, height: 1000 },
      margin: 40,
      spacing: 20,
    }

    const rects = calculateFrameRects(state)

    expect(rects[0]).toMatchObject({
      frameId: state.frames[0].id,
      x: 40,
      y: 40,
      width: 450,
      height: 450,
    })
    expect(rects[1]).toMatchObject({
      x: 510,
      y: 40,
      width: 450,
      height: 450,
    })
  })

  it("calculates a fill transform that covers the frame", () => {
    const image = createMockImage(800, 600)
    const transform = calculateImageTransform(
      image,
      { x: 0, y: 0, width: 300, height: 300 },
      { fitMode: "fill", scale: 1.1, offsetX: 12, offsetY: -8, rotation: 0 }
    )

    expect(transform.width).toBeCloseTo(440)
    expect(transform.height).toBeCloseTo(330)
    expect(transform.x).toBeCloseTo(-58)
    expect(transform.y).toBeCloseTo(-23)
  })

  it("returns polygon path data for angled frames", () => {
    const state = {
      ...createCollageState("diagonal-duo"),
      artboard: { id: "test", labelKey: "test", width: 1000, height: 1000 },
      margin: 0,
      spacing: 0,
    }

    const [rect] = calculateFrameRects(state)

    expect(getFramePathData(rect)).toBe(
      "M 0 0 L 560 0 L 440 1000 L 0 1000 Z"
    )
  })

  it("returns rounded polygon path data for angled frames", () => {
    const state = {
      ...createCollageState("diagonal-duo"),
      artboard: { id: "test", labelKey: "test", width: 1000, height: 1000 },
      margin: 0,
      spacing: 0,
    }

    const [rect] = calculateFrameRects(state)

    expect(getFramePathData(rect, 24)).toContain("Q")
  })

  it("keeps story diagonal template edges aligned", () => {
    const state = {
      ...createCollageState("story-diagonal"),
      artboard: { id: "test", labelKey: "test", width: 1000, height: 2000 },
      margin: 0,
      spacing: 0,
    }

    const rects = calculateFrameRects(state)
    const pointsBySlot = Object.fromEntries(
      rects.map((rect) => [rect.slotId, getFramePathPoints(rect)])
    )

    expect(pointsBySlot["story-diagonal-hero"][2]).toEqual({ x: 1000, y: 860 })
    expect(pointsBySlot["story-diagonal-hero"][3]).toEqual({ x: 0, y: 1000 })
    expect(pointsBySlot["story-diagonal-left"][0]).toEqual({ x: 0, y: 1000 })
    expect(pointsBySlot["story-diagonal-left"][1]).toEqual({ x: 500, y: 930 })
    expect(pointsBySlot["story-diagonal-right"][0]).toEqual({ x: 500, y: 930 })
    expect(pointsBySlot["story-diagonal-right"][1]).toEqual({ x: 1000, y: 860 })
    expect(pointsBySlot["story-diagonal-left"][2]).toEqual({ x: 500, y: 1410 })
    expect(pointsBySlot["story-diagonal-right"][3]).toEqual({ x: 500, y: 1410 })
    expect(pointsBySlot["story-diagonal-bottom"][1]).toEqual({ x: 500, y: 1410 })
  })

  it("applies spacing to angled story frames", () => {
    const state = {
      ...createCollageState("story-diagonal"),
      artboard: { id: "test", labelKey: "test", width: 1000, height: 2000 },
      margin: 0,
      spacing: 40,
    }

    const rects = calculateFrameRects(state)
    const pointsBySlot = Object.fromEntries(
      rects.map((rect) => [rect.slotId, getFramePathPoints(rect)])
    )

    expect(pointsBySlot["story-diagonal-hero"][3].y).toBeLessThan(
      pointsBySlot["story-diagonal-left"][0].y
    )
    expect(pointsBySlot["story-diagonal-left"][1].x).toBeLessThan(
      pointsBySlot["story-diagonal-right"][0].x
    )
    expect(pointsBySlot["story-diagonal-left"][2].y).toBeLessThan(
      pointsBySlot["story-diagonal-bottom"][1].y
    )
  })

  it("rounds only outer corners for the six-grid template", () => {
    const state = {
      ...createCollageState("six-grid"),
      artboard: { id: "test", labelKey: "test", width: 900, height: 600 },
      margin: 0,
      spacing: 0,
    }

    const rects = calculateFrameRects(state)
    const pathBySlot = Object.fromEntries(
      rects.map((rect) => [rect.slotId, getFramePathData(rect, 32)])
    )

    expect(pathBySlot["r1-c1"]).toContain("Q 0 0")
    expect(pathBySlot["r1-c2"]).not.toContain("Q")
    expect(pathBySlot["r2-c3"]).toContain("Q 900 600")
  })
})

describe("exportCollageImage", () => {
  it("renders background, clips frames, draws assigned images, and exports with quality", async () => {
    const ctx = {
      beginPath: vi.fn(),
      clearRect: vi.fn(),
      closePath: vi.fn(),
      clip: vi.fn(),
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      fillStyle: "",
      lineTo: vi.fn(),
      moveTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      rect: vi.fn(),
      resetTransform: vi.fn(),
      restore: vi.fn(),
      rotate: vi.fn(),
      save: vi.fn(),
      translate: vi.fn(),
    }
    const canvas = createMockCanvas(ctx)
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      if (tag === "canvas") return canvas as unknown as HTMLCanvasElement
      return originalCreateElement(tag)
    })

    const image = createMockImage(800, 600)
    const state = assignImagesToFrames(createCollageState("two-vertical"), [
      { id: "img-a", fileName: "a.jpg", image },
    ])

    const blob = await exportCollageImage(
      {
        ...state,
        artboard: { id: "test", labelKey: "test", width: 1000, height: 800 },
        backgroundColor: "#f8fafc",
        margin: 20,
        spacing: 10,
        cornerRadius: 12,
      },
      { "img-a": image },
      "image/jpeg",
      0.82
    )

    expect(blob.type).toBe("image/jpeg")
    expect(canvas.width).toBe(1000)
    expect(canvas.height).toBe(800)
    expect(ctx.fillStyle).toBe("#f8fafc")
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 1000, 800)
    expect(ctx.rect).toHaveBeenCalled()
    expect(ctx.clip).toHaveBeenCalled()
    expect(ctx.closePath).toHaveBeenCalled()
    expect(ctx.drawImage).toHaveBeenCalledWith(
      image,
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      expect.any(Number)
    )
    expect(canvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      "image/jpeg",
      0.82
    )
  })
})

describe("collage helpers", () => {
  it("maps output formats to extensions", () => {
    expect(getCollageOutputExtension("image/png")).toBe("png")
    expect(getCollageOutputExtension("image/jpeg")).toBe("jpg")
    expect(getCollageOutputExtension("image/webp")).toBe("webp")
  })

  it("returns a stable collage base name", () => {
    expect(getCollageBaseName([])).toBe("collage")
    expect(getCollageBaseName(["spring.trip.final.jpg"])).toBe("spring.trip.final_collage")
    expect(getCollageBaseName(["a.jpg", "b.png"])).toBe("photo-collage")
  })
})
