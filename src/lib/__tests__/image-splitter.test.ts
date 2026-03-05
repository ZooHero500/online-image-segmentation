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
})
