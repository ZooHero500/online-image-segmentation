import { describe, it, expect, vi, beforeEach } from "vitest"
import { exportArtboard } from "../resize-export"
import type { ResizeImageTransform } from "@/types"

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
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    drawImage: vi.fn(),
    fillStyle: "",
    fillRect: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
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

describe("exportArtboard", () => {
  let mockCanvas: ReturnType<typeof createMockCanvas>

  beforeEach(() => {
    mockCanvas = createMockCanvas()
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") return mockCanvas.canvas as unknown as HTMLCanvasElement
      return document.createElement(tag)
    })
  })

  it("should create canvas at artboard dimensions", async () => {
    const image = createMockImage(800, 600)
    const transform: ResizeImageTransform = { x: 0, y: 0, scale: 1, crop: null, rotation: 0, flipX: false, flipY: false }
    await exportArtboard(image, transform, 500, 500, "image/png")
    expect(mockCanvas.canvas.width).toBe(500)
    expect(mockCanvas.canvas.height).toBe(500)
  })

  it("should draw image with correct transform", async () => {
    const image = createMockImage(800, 600)
    const transform: ResizeImageTransform = { x: -150, y: -50, scale: 1.25, crop: null, rotation: 0, flipX: false, flipY: false }
    await exportArtboard(image, transform, 500, 500, "image/png")
    expect(mockCanvas.ctx.drawImage).toHaveBeenCalledWith(
      image, -150, -50, 800 * 1.25, 600 * 1.25
    )
  })

  it("should draw cropped image when crop is set", async () => {
    const image = createMockImage(800, 600)
    const transform: ResizeImageTransform = {
      x: 0, y: 0, scale: 1,
      crop: { x: 100, y: 50, width: 400, height: 300 },
      rotation: 0, flipX: false, flipY: false,
    }
    await exportArtboard(image, transform, 500, 500, "image/png")
    expect(mockCanvas.ctx.drawImage).toHaveBeenCalledWith(
      image, 100, 50, 400, 300, 0, 0, 400 * 1, 300 * 1
    )
  })

  it("should return blob with correct mime type", async () => {
    const image = createMockImage(800, 600)
    const transform: ResizeImageTransform = { x: 0, y: 0, scale: 1, crop: null, rotation: 0, flipX: false, flipY: false }
    const blob = await exportArtboard(image, transform, 500, 500, "image/jpeg", 0.92)
    expect(blob).toBeInstanceOf(Blob)
    expect(mockCanvas.canvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function), "image/jpeg", 0.92
    )
  })
})
