import { describe, it, expect, vi, beforeEach } from "vitest"
import { splitGrid, getGridConfig } from "../grid-splitter"
import type { GridType } from "../grid-splitter"

function createMockImage(width: number, height: number): HTMLImageElement {
  return {
    naturalWidth: width,
    naturalHeight: height,
    width,
    height,
    complete: true,
  } as unknown as HTMLImageElement
}

function createMockCanvas() {
  const ctx = {
    drawImage: vi.fn(),
    fillRect: vi.fn(),
    fillStyle: "",
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

describe("getGridConfig", () => {
  it("should return 3 rows, 3 cols for 3x3", () => {
    expect(getGridConfig("3x3")).toEqual({ rows: 3, cols: 3, aspectRatio: 1 })
  })

  it("should return 1 row, 3 cols for 1x3", () => {
    expect(getGridConfig("1x3")).toEqual({ rows: 1, cols: 3, aspectRatio: 3 })
  })

  it("should return 2 rows, 2 cols for 2x2", () => {
    expect(getGridConfig("2x2")).toEqual({ rows: 2, cols: 2, aspectRatio: 1 })
  })
})

describe("splitGrid", () => {
  beforeEach(() => {
    const { canvas } = createMockCanvas()
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") return canvas as unknown as HTMLCanvasElement
      return document.createElement(tag)
    })
  })

  it("should produce 9 blobs for 3x3 grid", async () => {
    const image = createMockImage(900, 900)
    const results = await splitGrid(image, {
      gridType: "3x3", offsetX: 0, offsetY: 0, scale: 1, withGap: false,
    }, { displayWidth: 300, displayHeight: 300 }, "image/png")
    expect(results).toHaveLength(9)
  })

  it("should produce 3 blobs for 1x3 grid", async () => {
    const image = createMockImage(900, 300)
    const results = await splitGrid(image, {
      gridType: "1x3", offsetX: 0, offsetY: 0, scale: 1, withGap: false,
    }, { displayWidth: 300, displayHeight: 100 }, "image/png")
    expect(results).toHaveLength(3)
  })

  it("should produce 4 blobs for 2x2 grid", async () => {
    const image = createMockImage(600, 600)
    const results = await splitGrid(image, {
      gridType: "2x2", offsetX: 0, offsetY: 0, scale: 1, withGap: false,
    }, { displayWidth: 300, displayHeight: 300 }, "image/png")
    expect(results).toHaveLength(4)
  })

  it("should preserve JPEG mime type", async () => {
    const image = createMockImage(900, 900)
    const results = await splitGrid(image, {
      gridType: "3x3", offsetX: 0, offsetY: 0, scale: 1, withGap: false,
    }, { displayWidth: 300, displayHeight: 300 }, "image/jpeg")
    expect(results[0].blob.type).toBe("image/jpeg")
  })

  it("should convert WebP to PNG", async () => {
    const image = createMockImage(900, 900)
    const results = await splitGrid(image, {
      gridType: "3x3", offsetX: 0, offsetY: 0, scale: 1, withGap: false,
    }, { displayWidth: 300, displayHeight: 300 }, "image/webp")
    expect(results[0].blob.type).toBe("image/png")
  })

  it("should number blobs sequentially (left-to-right, top-to-bottom)", async () => {
    const image = createMockImage(600, 600)
    const results = await splitGrid(image, {
      gridType: "2x2", offsetX: 0, offsetY: 0, scale: 1, withGap: false,
    }, { displayWidth: 300, displayHeight: 300 }, "image/png")
    expect(results[0].index).toBe(1)
    expect(results[1].index).toBe(2)
    expect(results[2].index).toBe(3)
    expect(results[3].index).toBe(4)
  })
})
