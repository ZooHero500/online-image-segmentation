import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  compressImage,
  formatFileSize,
  formatToExtension,
  getBaseName,
} from "../compress"

function createMockImage(width: number, height: number): HTMLImageElement {
  return {
    naturalWidth: width,
    naturalHeight: height,
    width,
    height,
    complete: true,
  } as unknown as HTMLImageElement
}

function createMockCanvas(blob: Blob) {
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
      cb(new Blob([blob], { type: type || blob.type }))
    }),
  }
  return { canvas, ctx }
}

describe("compressImage", () => {
  let mockCanvas: ReturnType<typeof createMockCanvas>

  beforeEach(() => {
    mockCanvas = createMockCanvas(new Blob(["encoded"], { type: "image/webp" }))
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") return mockCanvas.canvas as unknown as HTMLCanvasElement
      return document.createElement(tag)
    })
  })

  it("encodes JPEG with a white background and quality", async () => {
    const image = createMockImage(640, 480)
    const file = new File(["original-image-data"], "photo.png", {
      type: "image/png",
    })

    const result = await compressImage(image, file, "image/jpeg", 0.8)

    expect(result).toMatchObject({
      originalSize: file.size,
      format: "image/jpeg",
      width: 640,
      height: 480,
    })
    expect(mockCanvas.canvas.width).toBe(640)
    expect(mockCanvas.canvas.height).toBe(480)
    expect(mockCanvas.ctx.fillStyle).toBe("#ffffff")
    expect(mockCanvas.ctx.fillRect).toHaveBeenCalledWith(0, 0, 640, 480)
    expect(mockCanvas.ctx.drawImage).toHaveBeenCalledWith(image, 0, 0)
    expect(mockCanvas.canvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      "image/jpeg",
      0.8
    )
  })

  it("returns the original PNG when canvas re-encoding would increase size", async () => {
    mockCanvas = createMockCanvas(new Blob(["larger-encoded-png"], { type: "image/png" }))
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") return mockCanvas.canvas as unknown as HTMLCanvasElement
      return document.createElement(tag)
    })

    const image = createMockImage(100, 100)
    const file = new File(["tiny"], "icon.png", { type: "image/png" })

    const result = await compressImage(image, file, "image/png", 1)

    expect(result.blob).toBe(file)
    expect(result.compressedSize).toBe(file.size)
    expect(result.savedPercent).toBe(0)
  })

  it("keeps an encoded PNG when converting from another format", async () => {
    mockCanvas = createMockCanvas(new Blob(["encoded-png"], { type: "image/png" }))
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") return mockCanvas.canvas as unknown as HTMLCanvasElement
      return document.createElement(tag)
    })

    const image = createMockImage(100, 100)
    const file = new File(["jpg"], "photo.jpg", { type: "image/jpeg" })

    const result = await compressImage(image, file, "image/png", 1)

    expect(result.blob).not.toBe(file)
    expect(result.format).toBe("image/png")
    expect(mockCanvas.canvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      "image/png",
      undefined
    )
  })
})

describe("compress helpers", () => {
  it("maps output formats to download extensions", () => {
    expect(formatToExtension("image/png")).toBe("png")
    expect(formatToExtension("image/jpeg")).toBe("jpg")
    expect(formatToExtension("image/webp")).toBe("webp")
  })

  it("formats file sizes", () => {
    expect(formatFileSize(512)).toBe("512 B")
    expect(formatFileSize(1536)).toBe("1.5 KB")
    expect(formatFileSize(2 * 1024 * 1024)).toBe("2.0 MB")
  })

  it("removes only the last file extension", () => {
    expect(getBaseName("photo.final.webp")).toBe("photo.final")
    expect(getBaseName("README")).toBe("README")
  })
})
