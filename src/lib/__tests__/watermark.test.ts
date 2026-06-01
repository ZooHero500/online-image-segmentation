import { describe, expect, it, vi } from "vitest"
import {
  createWatermarkLayer,
  createWatermarkState,
  exportWatermarkedImage,
  getEnabledLayers,
  updateWatermarkLayer,
} from "../watermark"
import { WATERMARK_TEMPLATES, applyWatermarkTemplate } from "../watermark-presets"

describe("watermark model", () => {
  it("creates a default text layer", () => {
    const layer = createWatermarkLayer("text", { text: "ImgSplit" })

    expect(layer).toMatchObject({
      type: "text",
      repeatMode: "single",
      text: "ImgSplit",
      opacity: 0.35,
      rotation: -24,
      enabled: true,
    })
    expect(layer.id).toMatch(/^wm-/)
  })

  it("updates only the selected layer", () => {
    const first = createWatermarkLayer("text", { text: "A" })
    const second = createWatermarkLayer("text", { text: "B" })
    const state = createWatermarkState([first, second])

    const next = updateWatermarkLayer(state, second.id, { opacity: 0.7 })

    expect(next.layers[0].opacity).toBe(first.opacity)
    expect(next.layers[1].opacity).toBe(0.7)
  })

  it("returns enabled layers in draw order", () => {
    const hidden = createWatermarkLayer("text", { enabled: false })
    const visible = createWatermarkLayer("text", { text: "Visible" })
    const state = createWatermarkState([hidden, visible])

    expect(getEnabledLayers(state)).toEqual([visible])
  })
})

describe("watermark templates", () => {
  it("provides the approved template set", () => {
    expect(WATERMARK_TEMPLATES.map((template) => template.id)).toEqual([
      "corner-copyright",
      "center-mark",
      "diagonal-repeat",
      "dense-anti-theft",
      "brand-badge",
      "subtle-protection",
    ])
  })

  it("applies a repeated diagonal template", () => {
    const state = applyWatermarkTemplate("diagonal-repeat", {
      imageWidth: 1200,
      imageHeight: 800,
      text: "Copyright",
    })

    expect(state.layers[0]).toMatchObject({
      repeatMode: "repeat",
      text: "Copyright",
      rotation: -28,
    })
  })
})

describe("exportWatermarkedImage", () => {
  it("draws the base image and enabled text layers", async () => {
    const ctx = {
      drawImage: vi.fn(),
      fillText: vi.fn(),
      fillRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      globalAlpha: 1,
      fillStyle: "",
      font: "",
      textAlign: "center",
      textBaseline: "middle",
    }
    const canvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => ctx),
      toBlob: vi.fn((cb: BlobCallback, type?: string) => {
        cb(new Blob(["ok"], { type }))
      }),
    }
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      if (tag === "canvas") {
        return canvas as unknown as HTMLCanvasElement
      }
      return originalCreateElement(tag)
    })

    const image = {
      naturalWidth: 800,
      naturalHeight: 600,
    } as HTMLImageElement
    const state = createWatermarkState([
      createWatermarkLayer("text", { text: "Owner" }),
    ])

    const blob = await exportWatermarkedImage(image, state, "image/png")

    expect(blob.type).toBe("image/png")
    expect(ctx.drawImage).toHaveBeenCalledWith(image, 0, 0, 800, 600)
    expect(ctx.fillText).toHaveBeenCalledWith("Owner", 0, 0)
  })
})
