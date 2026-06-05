import { afterEach, describe, expect, it, vi } from "vitest"
import {
  assertBackgroundRemovalModelAvailable,
  composeBackgroundRemovalResult,
  exportBackgroundRemovalCanvas,
  formatModelBytes,
  getBackgroundRemovalModelFilePath,
  getBackgroundRemovalBaseName,
  getBackgroundRemovalOutputExtension,
  refineBackgroundRemovalCanvas,
} from "../background-removal"

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

function createMockCanvas(ctx: Record<string, unknown>, blobType = "image/png") {
  return {
    width: 0,
    height: 0,
    getContext: vi.fn(() => ctx),
    toBlob: vi.fn((cb: BlobCallback, type?: string, quality?: number) => {
      void quality
      cb(new Blob(["encoded"], { type: type ?? blobType }))
    }),
  }
}

describe("background removal helpers", () => {
  it("formats model download sizes", () => {
    expect(formatModelBytes(512)).toBe("512 B")
    expect(formatModelBytes(1536)).toBe("1.5 KB")
    expect(formatModelBytes(45 * 1024 * 1024)).toBe("45 MB")
  })

  it("removes only the last file extension", () => {
    expect(getBackgroundRemovalBaseName("product.photo.jpg")).toBe("product.photo")
    expect(getBackgroundRemovalBaseName("image")).toBe("image")
  })

  it("maps output formats to download extensions", () => {
    expect(getBackgroundRemovalOutputExtension("image/png")).toBe("png")
    expect(getBackgroundRemovalOutputExtension("image/jpeg")).toBe("jpg")
    expect(getBackgroundRemovalOutputExtension("image/webp")).toBe("webp")
  })

  it("checks required local model files before starting the worker", async () => {
    const fetcher = vi.fn(async () => ({ ok: true }) as Response)

    await expect(assertBackgroundRemovalModelAvailable(fetcher)).resolves.toBeUndefined()

    expect(fetcher).toHaveBeenCalledWith(
      getBackgroundRemovalModelFilePath("config.json"),
      expect.objectContaining({ method: "HEAD" })
    )
  })

  it("reports missing local model files", async () => {
    const fetcher = vi.fn(async (path: string) => {
      return { ok: !path.endsWith("config.json") } as Response
    })

    await expect(assertBackgroundRemovalModelAvailable(fetcher)).rejects.toThrow(
      getBackgroundRemovalModelFilePath("config.json")
    )
  })
})

describe("composeBackgroundRemovalResult", () => {
  it("draws the original image and applies the alpha mask", async () => {
    const resultCtx = {
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray([10, 20, 30, 255, 40, 50, 60, 255]),
      })),
      putImageData: vi.fn(),
    }
    const maskCtx = {
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray([255, 255, 255, 128, 0, 0, 0, 64]),
      })),
    }
    const resultCanvas = createMockCanvas(resultCtx)
    const maskCanvas = createMockCanvas(maskCtx)
    const originalCreateElement = document.createElement.bind(document)
    let canvasCalls = 0
    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      if (tag === "canvas") {
        canvasCalls += 1
        return (canvasCalls === 1 ? resultCanvas : maskCanvas) as unknown as HTMLCanvasElement
      }
      return originalCreateElement(tag)
    })

    const image = createMockImage(2, 1)
    const mask = new Blob(["mask"], { type: "image/png" })
    const loadMask = vi.fn(async () => createMockImage(2, 1))

    const canvas = await composeBackgroundRemovalResult(image, mask, loadMask)

    expect(canvas.width).toBe(2)
    expect(canvas.height).toBe(1)
    expect(resultCtx.drawImage).toHaveBeenCalledWith(image, 0, 0)
    expect(maskCtx.drawImage).toHaveBeenCalledWith(expect.any(Object), 0, 0, 2, 1)
    const imageData = (resultCtx.putImageData as ReturnType<typeof vi.fn>).mock.calls[0][0] as ImageData
    expect(Array.from(imageData.data)).toEqual([10, 20, 30, 128, 40, 50, 60, 64])
  })
})

describe("exportBackgroundRemovalCanvas", () => {
  it("flattens JPEG exports onto a white background and passes quality", async () => {
    const sourceCanvas = {
      width: 640,
      height: 480,
      getContext: vi.fn(),
      toBlob: vi.fn(),
    } as unknown as HTMLCanvasElement
    const exportCtx = {
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      fillStyle: "",
    }
    const exportCanvas = createMockCanvas(exportCtx, "image/jpeg")
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      if (tag === "canvas") return exportCanvas as unknown as HTMLCanvasElement
      return originalCreateElement(tag)
    })

    const blob = await exportBackgroundRemovalCanvas(sourceCanvas, "image/jpeg", 0.82)

    expect(blob.type).toBe("image/jpeg")
    expect(exportCanvas.width).toBe(640)
    expect(exportCanvas.height).toBe(480)
    expect(exportCtx.fillStyle).toBe("#ffffff")
    expect(exportCtx.fillRect).toHaveBeenCalledWith(0, 0, 640, 480)
    expect(exportCtx.drawImage).toHaveBeenCalledWith(sourceCanvas, 0, 0)
    expect(exportCanvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      "image/jpeg",
      0.82
    )
  })
})

describe("refineBackgroundRemovalCanvas", () => {
  it("applies alpha cutoff to the result matte", () => {
    const ctx = {
      drawImage: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray([
          10, 20, 30, 64,
          40, 50, 60, 255,
        ]),
      })),
      putImageData: vi.fn(),
    }
    const outputCanvas = createMockCanvas(ctx)
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      if (tag === "canvas") return outputCanvas as unknown as HTMLCanvasElement
      return originalCreateElement(tag)
    })

    const sourceCanvas = { width: 2, height: 1 } as HTMLCanvasElement
    refineBackgroundRemovalCanvas(sourceCanvas, {
      alphaCutoff: 50,
      edgeFeather: 0,
      edgeShift: 0,
    })

    const imageData = (ctx.putImageData as ReturnType<typeof vi.fn>).mock.calls[0][0] as ImageData
    expect(Array.from(imageData.data)).toEqual([
      10, 20, 30, 0,
      40, 50, 60, 255,
    ])
  })

  it("can expand or contract the alpha edge", () => {
    const makeContext = () => ({
      drawImage: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray([
          10, 20, 30, 0,
          40, 50, 60, 255,
          70, 80, 90, 0,
        ]),
      })),
      putImageData: vi.fn(),
    })
    const sourceCanvas = { width: 3, height: 1 } as HTMLCanvasElement
    const originalCreateElement = document.createElement.bind(document)
    const contexts = [makeContext(), makeContext()]
    let canvasCalls = 0

    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      if (tag === "canvas") {
        const ctx = contexts[canvasCalls]
        canvasCalls += 1
        return createMockCanvas(ctx) as unknown as HTMLCanvasElement
      }
      return originalCreateElement(tag)
    })

    refineBackgroundRemovalCanvas(sourceCanvas, {
      alphaCutoff: 0,
      edgeFeather: 0,
      edgeShift: 1,
    })
    refineBackgroundRemovalCanvas(sourceCanvas, {
      alphaCutoff: 0,
      edgeFeather: 0,
      edgeShift: -1,
    })

    const expanded = (contexts[0].putImageData as ReturnType<typeof vi.fn>).mock.calls[0][0] as ImageData
    const contracted = (contexts[1].putImageData as ReturnType<typeof vi.fn>).mock.calls[0][0] as ImageData
    expect([expanded.data[3], expanded.data[7], expanded.data[11]]).toEqual([255, 255, 255])
    expect([contracted.data[3], contracted.data[7], contracted.data[11]]).toEqual([0, 0, 0])
  })
})
