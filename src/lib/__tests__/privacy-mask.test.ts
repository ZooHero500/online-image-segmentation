import { afterEach, describe, expect, it, vi } from "vitest"
import {
  createPrivacyMaskBrushStroke,
  createPrivacyMaskImageLayer,
  createPrivacyMaskRegion,
  createPrivacyMaskState,
  exportPrivacyMaskedImage,
  getEnabledPrivacyMaskBrushStrokes,
  getEnabledPrivacyMaskRegions,
  getPrivacyMaskBaseName,
  getPrivacyMaskOutputExtension,
  normalizePrivacyMaskRegion,
  updatePrivacyMaskImageLayer,
  updatePrivacyMaskRegion,
} from "../privacy-mask"

afterEach(() => {
  vi.restoreAllMocks()
})

function createMockCanvas(ctx: Record<string, unknown>, blobType = "image/png") {
  return {
    width: 0,
    height: 0,
    getContext: vi.fn(() => ctx),
    toBlob: vi.fn((cb: BlobCallback, type?: string) => {
      cb(new Blob(["masked"], { type: type ?? blobType }))
    }),
  }
}

describe("privacy mask model", () => {
  it("creates a default mosaic region", () => {
    const region = createPrivacyMaskRegion({
      x: 10,
      y: 20,
      width: 120,
      height: 80,
    })

    expect(region).toMatchObject({
      effect: "mosaic",
      strength: 18,
      color: "#111827",
      enabled: true,
      x: 10,
      y: 20,
      width: 120,
      height: 80,
    })
    expect(region.id).toMatch(/^pm-/)
  })

  it("normalizes negative drags and clamps to image bounds", () => {
    const normalized = normalizePrivacyMaskRegion(
      { x: 120, y: 90, width: -160, height: -120 },
      200,
      100
    )

    expect(normalized).toEqual({
      x: 0,
      y: 0,
      width: 120,
      height: 90,
    })
  })

  it("updates only the target region", () => {
    const first = createPrivacyMaskRegion({ x: 0, y: 0, width: 40, height: 40 })
    const second = createPrivacyMaskRegion({ x: 50, y: 0, width: 40, height: 40 })
    const state = createPrivacyMaskState([first, second])

    const next = updatePrivacyMaskRegion(state, second.id, {
      effect: "solid",
      color: "#ef4444",
    })

    expect(next.regions[0]).toEqual(first)
    expect(next.regions[1]).toMatchObject({
      id: second.id,
      effect: "solid",
      color: "#ef4444",
    })
  })

  it("returns enabled regions in draw order", () => {
    const hidden = createPrivacyMaskRegion({
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      enabled: false,
    })
    const visible = createPrivacyMaskRegion({
      x: 20,
      y: 0,
      width: 10,
      height: 10,
    })

    expect(getEnabledPrivacyMaskRegions(createPrivacyMaskState([hidden, visible]))).toEqual([
      visible,
    ])
  })

  it("creates brush and eraser strokes", () => {
    const maskStroke = createPrivacyMaskBrushStroke({
      points: [
        { x: 10, y: 12 },
        { x: 20, y: 24 },
      ],
    })
    const eraserStroke = createPrivacyMaskBrushStroke({
      mode: "erase",
      points: [{ x: 16, y: 18 }],
      size: 48,
    })

    expect(maskStroke).toMatchObject({
      mode: "mask",
      effect: "mosaic",
      strength: 18,
      size: 32,
      enabled: true,
    })
    expect(eraserStroke).toMatchObject({
      mode: "erase",
      size: 48,
    })
    expect(maskStroke.id).toMatch(/^pbs-/)
  })

  it("returns enabled brush strokes in draw order", () => {
    const hidden = createPrivacyMaskBrushStroke({
      points: [{ x: 1, y: 1 }],
      enabled: false,
    })
    const visible = createPrivacyMaskBrushStroke({
      points: [{ x: 2, y: 2 }],
    })

    expect(
      getEnabledPrivacyMaskBrushStrokes(
        createPrivacyMaskState({ strokes: [hidden, visible] })
      )
    ).toEqual([visible])
  })

  it("creates and updates image mask layers", () => {
    const layer = createPrivacyMaskImageLayer({
      imageSrc: "data:image/png;base64,mask",
      imageName: "mask.png",
      x: 12,
      y: 16,
      width: 120,
      height: 80,
    })
    const state = createPrivacyMaskState({ imageLayers: [layer] })
    const next = updatePrivacyMaskImageLayer(state, layer.id, {
      opacity: 0.5,
      rotation: 30,
    })

    expect(layer).toMatchObject({
      opacity: 1,
      rotation: 0,
      enabled: true,
    })
    expect(layer.id).toMatch(/^pmi-/)
    expect(next.imageLayers[0]).toMatchObject({
      opacity: 0.5,
      rotation: 30,
    })
  })

  it("keeps the default layer selection singular", () => {
    const region = createPrivacyMaskRegion()
    const imageLayer = createPrivacyMaskImageLayer({
      imageSrc: "data:image/png;base64,mask",
    })

    expect(
      createPrivacyMaskState({ regions: [region], imageLayers: [imageLayer] })
    ).toMatchObject({
      selectedRegionId: region.id,
      selectedImageLayerId: null,
    })
    expect(createPrivacyMaskState({ imageLayers: [imageLayer] })).toMatchObject({
      selectedRegionId: null,
      selectedImageLayerId: imageLayer.id,
    })
  })
})

describe("exportPrivacyMaskedImage", () => {
  it("draws the base image and solid cover regions", async () => {
    const ctx = {
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      fillStyle: "",
      save: vi.fn(),
      restore: vi.fn(),
    }
    const canvas = createMockCanvas(ctx)
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      if (tag === "canvas") {
        return canvas as unknown as HTMLCanvasElement
      }
      return originalCreateElement(tag)
    })

    const image = { naturalWidth: 320, naturalHeight: 180 } as HTMLImageElement
    const state = createPrivacyMaskState([
      createPrivacyMaskRegion({
        x: 12,
        y: 18,
        width: 80,
        height: 40,
        effect: "solid",
        color: "#000000",
      }),
    ])

    const blob = await exportPrivacyMaskedImage(image, state, "image/png")

    expect(blob.type).toBe("image/png")
    expect(canvas.width).toBe(320)
    expect(canvas.height).toBe(180)
    expect(ctx.drawImage).toHaveBeenCalledWith(image, 0, 0, 320, 180)
    expect(ctx.fillStyle).toBe("#000000")
    expect(ctx.fillRect).toHaveBeenCalledWith(12, 18, 80, 40)
    expect(canvas.toBlob).toHaveBeenCalledWith(expect.any(Function), "image/png", undefined)
  })

  it("flattens JPEG exports onto a white background and passes quality", async () => {
    const ctx = {
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      fillStyle: "",
      save: vi.fn(),
      restore: vi.fn(),
    }
    const canvas = createMockCanvas(ctx)
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      if (tag === "canvas") {
        return canvas as unknown as HTMLCanvasElement
      }
      return originalCreateElement(tag)
    })

    const image = { naturalWidth: 100, naturalHeight: 50 } as HTMLImageElement
    const state = createPrivacyMaskState()

    const blob = await exportPrivacyMaskedImage(image, state, "image/jpeg", 0.8)

    expect(blob.type).toBe("image/jpeg")
    expect(ctx.fillStyle).toBe("#ffffff")
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 100, 50)
    expect(canvas.toBlob).toHaveBeenCalledWith(expect.any(Function), "image/jpeg", 0.8)
  })

  it("draws image mask layers with opacity and rotation", async () => {
    const ctx = {
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      fillStyle: "",
      globalAlpha: 1,
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
    }
    const canvas = createMockCanvas(ctx)
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      if (tag === "canvas") {
        return canvas as unknown as HTMLCanvasElement
      }
      return originalCreateElement(tag)
    })

    const image = { naturalWidth: 320, naturalHeight: 180 } as HTMLImageElement
    const maskImage = { naturalWidth: 40, naturalHeight: 20 } as HTMLImageElement
    const layer = createPrivacyMaskImageLayer({
      imageSrc: "data:mask",
      imageName: "mask.png",
      x: 20,
      y: 30,
      width: 80,
      height: 40,
      opacity: 0.5,
      rotation: 90,
    })
    const state = createPrivacyMaskState({ imageLayers: [layer] })

    await exportPrivacyMaskedImage(image, state, "image/png", 0.92, {
      "data:mask": maskImage,
    })

    expect(ctx.globalAlpha).toBe(0.5)
    expect(ctx.translate).toHaveBeenCalledWith(60, 50)
    expect(ctx.rotate).toHaveBeenCalledWith(Math.PI / 2)
    expect(ctx.drawImage).toHaveBeenCalledWith(maskImage, -40, -20, 80, 40)
  })
})

describe("privacy mask helpers", () => {
  it("maps output formats to extensions", () => {
    expect(getPrivacyMaskOutputExtension("image/png")).toBe("png")
    expect(getPrivacyMaskOutputExtension("image/jpeg")).toBe("jpg")
    expect(getPrivacyMaskOutputExtension("image/webp")).toBe("webp")
  })

  it("removes only the last extension from file names", () => {
    expect(getPrivacyMaskBaseName("private.chat.final.png")).toBe("private.chat.final")
    expect(getPrivacyMaskBaseName("screenshot")).toBe("screenshot")
  })
})
