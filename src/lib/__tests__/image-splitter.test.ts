import { describe, it, expect, vi, beforeEach } from "vitest"
import { splitImage } from "../image-splitter"
import type { SplitLine } from "@/types"

// Mock Canvas API
function createMockImage(width: number, height: number): HTMLImageElement {
  const img = {
    naturalWidth: width,
    naturalHeight: height,
    width,
    height,
    complete: true,
  } as unknown as HTMLImageElement
  return img
}

function createMockCanvas() {
  const ctx = {
    drawImage: vi.fn(),
  }
  const canvas = {
    width: 0,
    height: 0,
    getContext: vi.fn(() => ctx),
    toBlob: vi.fn((cb: BlobCallback, type?: string) => {
      cb(new Blob(["test"], { type: type || "image/png" }))
    }),
  }
  return { canvas, ctx }
}

describe("splitImage", () => {
  beforeEach(() => {
    const { canvas, ctx } = createMockCanvas()
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") return canvas as unknown as HTMLCanvasElement
      return document.createElement(tag)
    })
  })

  it("should split image with one horizontal line", async () => {
    const image = createMockImage(100, 200)
    const lines: SplitLine[] = [
      { id: "1", orientation: "horizontal", position: 100 },
    ]

    const results = await splitImage(image, lines, "image/png")

    expect(results).toHaveLength(2)
    expect(results[0]).toMatchObject({ row: 1, col: 1, width: 100, height: 100 })
    expect(results[1]).toMatchObject({ row: 2, col: 1, width: 100, height: 100 })
  })

  it("should split image with one vertical line", async () => {
    const image = createMockImage(200, 100)
    const lines: SplitLine[] = [
      { id: "1", orientation: "vertical", position: 100 },
    ]

    const results = await splitImage(image, lines, "image/png")

    expect(results).toHaveLength(2)
    expect(results[0]).toMatchObject({ row: 1, col: 1, width: 100, height: 100 })
    expect(results[1]).toMatchObject({ row: 1, col: 2, width: 100, height: 100 })
  })

  it("should split image with both horizontal and vertical lines (grid)", async () => {
    const image = createMockImage(200, 200)
    const lines: SplitLine[] = [
      { id: "1", orientation: "horizontal", position: 100 },
      { id: "2", orientation: "vertical", position: 100 },
    ]

    const results = await splitImage(image, lines, "image/png")

    expect(results).toHaveLength(4)
    expect(results[0]).toMatchObject({ row: 1, col: 1, width: 100, height: 100 })
    expect(results[1]).toMatchObject({ row: 1, col: 2, width: 100, height: 100 })
    expect(results[2]).toMatchObject({ row: 2, col: 1, width: 100, height: 100 })
    expect(results[3]).toMatchObject({ row: 2, col: 2, width: 100, height: 100 })
  })

  it("should return single result when no split lines provided", async () => {
    const image = createMockImage(100, 100)
    const results = await splitImage(image, [], "image/png")

    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({ row: 1, col: 1, width: 100, height: 100 })
  })

  it("should preserve PNG mime type", async () => {
    const image = createMockImage(100, 100)
    const results = await splitImage(image, [], "image/png")
    expect(results[0].blob.type).toBe("image/png")
  })

  it("should preserve JPEG mime type", async () => {
    const image = createMockImage(100, 100)
    const results = await splitImage(image, [], "image/jpeg")
    expect(results[0].blob.type).toBe("image/jpeg")
  })

  it("should convert WebP to PNG", async () => {
    const image = createMockImage(100, 100)
    const results = await splitImage(image, [], "image/webp")
    expect(results[0].blob.type).toBe("image/png")
  })

  it("should sort split lines by position for correct region calculation", async () => {
    const image = createMockImage(300, 100)
    const lines: SplitLine[] = [
      { id: "2", orientation: "vertical", position: 200 },
      { id: "1", orientation: "vertical", position: 100 },
    ]

    const results = await splitImage(image, lines, "image/png")

    expect(results).toHaveLength(3)
    expect(results[0]).toMatchObject({ row: 1, col: 1, width: 100 })
    expect(results[1]).toMatchObject({ row: 1, col: 2, width: 100 })
    expect(results[2]).toMatchObject({ row: 1, col: 3, width: 100 })
  })

  it("should fallback to image/png for empty mimeType", async () => {
    const image = createMockImage(100, 100)
    const results = await splitImage(image, [], "")
    expect(results[0].blob.type).toBe("image/png")
  })

  it("should fallback to image/png for unsupported mimeType", async () => {
    const image = createMockImage(100, 100)
    const results = await splitImage(image, [], "image/bmp")
    expect(results[0].blob.type).toBe("image/png")
  })

  it("should reject when toBlob returns null", async () => {
    const { ctx } = createMockCanvas()
    const nullBlobCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => ctx),
      toBlob: vi.fn((cb: BlobCallback) => {
        cb(null)
      }),
    }
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") return nullBlobCanvas as unknown as HTMLCanvasElement
      return document.createElement(tag)
    })

    const image = createMockImage(100, 100)
    await expect(splitImage(image, [], "image/png")).rejects.toThrow(
      "Failed to create blob from canvas"
    )
  })

  it("should filter out zero-height regions from duplicate horizontal lines", async () => {
    const image = createMockImage(100, 300)
    const lines: SplitLine[] = [
      { id: "1", orientation: "horizontal", position: 100 },
      { id: "2", orientation: "horizontal", position: 100 }, // duplicate
    ]

    const results = await splitImage(image, lines, "image/png")

    // Should produce 2 regions (0→100, 100→300), not 3 with a zero-height one
    expect(results).toHaveLength(2)
    expect(results[0]).toMatchObject({ row: 1, col: 1, width: 100, height: 100 })
    expect(results[1]).toMatchObject({ row: 2, col: 1, width: 100, height: 200 })
  })

  it("should filter out zero-width regions from duplicate vertical lines", async () => {
    const image = createMockImage(300, 100)
    const lines: SplitLine[] = [
      { id: "1", orientation: "vertical", position: 150 },
      { id: "2", orientation: "vertical", position: 150 }, // duplicate
    ]

    const results = await splitImage(image, lines, "image/png")

    expect(results).toHaveLength(2)
    expect(results[0]).toMatchObject({ row: 1, col: 1, width: 150 })
    expect(results[1]).toMatchObject({ row: 1, col: 2, width: 150 })
  })

  it("should filter out regions from lines at image boundary (position 0)", async () => {
    const image = createMockImage(100, 200)
    const lines: SplitLine[] = [
      { id: "1", orientation: "horizontal", position: 0 },
    ]

    const results = await splitImage(image, lines, "image/png")

    // Line at 0 produces edges [0, 0, 200] → regions h=0 and h=200
    // The zero-height region should be filtered
    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({ row: 1, col: 1, width: 100, height: 200 })
  })

  it("should filter out regions from lines at image boundary (position = imageSize)", async () => {
    const image = createMockImage(100, 200)
    const lines: SplitLine[] = [
      { id: "1", orientation: "horizontal", position: 200 },
    ]

    const results = await splitImage(image, lines, "image/png")

    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({ row: 1, col: 1, width: 100, height: 200 })
  })

  it("should reject when getContext returns null", async () => {
    const nullCtxCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => null),
      toBlob: vi.fn(),
    }
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") return nullCtxCanvas as unknown as HTMLCanvasElement
      return document.createElement(tag)
    })

    const image = createMockImage(100, 100)
    await expect(splitImage(image, [], "image/png")).rejects.toThrow(
      "Failed to get canvas 2d context"
    )
  })
})
