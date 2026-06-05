import JSZip from "jszip"
import { afterEach, describe, expect, it, vi } from "vitest"
import {
  canvasToBatchZipItem,
  createBatchRemovalItems,
  disposeBatchRemovalItemUrls,
  disposeBatchRemovalItems,
  exportBackgroundRemovalBatchAsZip,
  getBackgroundRemovalBatchSummary,
  getBackgroundRemovalOutputFileName,
  getBackgroundRemovalZipFileName,
} from "../background-removal-batch"
import type { BatchRemovalItem } from "../background-removal-batch"

function file(name: string, type = "image/png") {
  return new File(["image"], name, { type })
}

function image(width = 100, height = 80) {
  return { naturalWidth: width, naturalHeight: height, width, height } as HTMLImageElement
}

function batchItem(overrides: Partial<BatchRemovalItem> = {}): BatchRemovalItem {
  return {
    id: "1",
    file: file("sample.png"),
    image: image(),
    mimeType: "image/png",
    baseName: "sample",
    dimensions: { width: 100, height: 80 },
    sourceUrl: "blob:source",
    status: "queued",
    progress: null,
    error: null,
    resultCanvas: null,
    resultUrl: "",
    device: null,
    ...overrides,
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("background removal batch helpers", () => {
  it("creates queued batch items with stable ids", () => {
    const createObjectURL = vi.fn((blob: Blob) => `blob:${(blob as File).name}`)
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL,
    })

    const items = createBatchRemovalItems(
      [
        { file: file("first.photo.png"), image: image(), mimeType: "image/png" },
        { file: file("second.jpg", "image/jpeg"), image: image(200, 160), mimeType: "image/jpeg" },
        {
          file: file("fallback.webp", "image/webp"),
          image: {
            naturalWidth: 0,
            naturalHeight: 0,
            width: 320,
            height: 240,
          } as HTMLImageElement,
          mimeType: "image/webp",
        },
      ],
      (() => {
        let index = 0
        return () => `batch-${++index}`
      })()
    )

    expect(items.map((item) => item.id)).toEqual(["batch-1", "batch-2", "batch-3"])
    expect(items.map((item) => item.status)).toEqual(["queued", "queued", "queued"])
    expect(items[0].baseName).toBe("first.photo")
    expect(items[0].dimensions).toEqual({ width: 100, height: 80 })
    expect(items[1].dimensions).toEqual({ width: 200, height: 160 })
    expect(items[2].dimensions).toEqual({ width: 320, height: 240 })
    expect(items.map((item) => item.sourceUrl)).toEqual([
      "blob:first.photo.png",
      "blob:second.jpg",
      "blob:fallback.webp",
    ])
    expect(items[0]).toMatchObject({
      progress: null,
      error: null,
      resultCanvas: null,
      resultUrl: "",
      device: null,
    })
  })

  it("disposes a batch item source and result object urls", () => {
    const revokeObjectURL = vi.fn()
    vi.stubGlobal("URL", {
      ...URL,
      revokeObjectURL,
    })

    disposeBatchRemovalItemUrls(
      batchItem({
        sourceUrl: "blob:source",
        resultUrl: "blob:result",
      })
    )

    expect(revokeObjectURL).toHaveBeenCalledTimes(2)
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:source")
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:result")
  })

  it("dedupes object urls when disposing batch items", () => {
    const revokeObjectURL = vi.fn()
    vi.stubGlobal("URL", {
      ...URL,
      revokeObjectURL,
    })

    disposeBatchRemovalItems([
      batchItem({ id: "1", sourceUrl: "blob:shared", resultUrl: "blob:result" }),
      batchItem({ id: "2", sourceUrl: "blob:source-2", resultUrl: "blob:shared" }),
      batchItem({ id: "3", sourceUrl: "blob:result", resultUrl: "" }),
    ])

    expect(revokeObjectURL).toHaveBeenCalledTimes(3)
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:shared")
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:result")
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:source-2")
  })

  it("summarizes queue progress", () => {
    const summary = getBackgroundRemovalBatchSummary([
      { id: "1", status: "ready" },
      { id: "2", status: "error" },
      { id: "3", status: "processing" },
      { id: "4", status: "loading-model" },
      { id: "5", status: "queued" },
      { id: "6", status: "canceled" },
    ])

    expect(summary).toEqual({
      total: 6,
      ready: 1,
      failed: 1,
      active: 2,
      queued: 1,
      completed: 3,
      percent: 50,
      isBusy: true,
      canDownloadReady: true,
      hasFailures: true,
    })
  })

  it("summarizes an empty queue", () => {
    expect(getBackgroundRemovalBatchSummary([])).toEqual({
      total: 0,
      ready: 0,
      failed: 0,
      active: 0,
      queued: 0,
      completed: 0,
      percent: 0,
      isBusy: false,
      canDownloadReady: false,
      hasFailures: false,
    })
  })

  it("builds clear output filenames", () => {
    expect(getBackgroundRemovalOutputFileName("product.photo.png", "image/png")).toBe(
      "product.photo-no-bg.png"
    )
    expect(getBackgroundRemovalOutputFileName("portrait.jpg", "image/webp")).toBe(
      "portrait-no-bg.webp"
    )
    expect(getBackgroundRemovalZipFileName()).toBe("background_removed_images.zip")
  })

  it("exports ready items as a zip", async () => {
    const zipBlob = await exportBackgroundRemovalBatchAsZip([
      {
        id: "1",
        originalFileName: "a.png",
        outputFormat: "image/png",
        blob: new Blob(["a"], { type: "image/png" }),
      },
      {
        id: "2",
        originalFileName: "b.jpg",
        outputFormat: "image/webp",
        blob: new Blob(["b"], { type: "image/webp" }),
      },
    ])

    expect(zipBlob.type).toBe("application/zip")
    const zip = await JSZip.loadAsync(zipBlob)
    expect(Object.keys(zip.files).sort()).toEqual(["a-no-bg.png", "b-no-bg.webp"])
  })

  it("dedupes zip filenames when source names differ only by extension", async () => {
    const zipBlob = await exportBackgroundRemovalBatchAsZip([
      {
        id: "1",
        originalFileName: "photo.png",
        outputFormat: "image/png",
        blob: new Blob(["first photo"], { type: "image/png" }),
      },
      {
        id: "2",
        originalFileName: "photo.jpg",
        outputFormat: "image/png",
        blob: new Blob(["second photo"], { type: "image/png" }),
      },
      {
        id: "3",
        originalFileName: "photo.webp",
        outputFormat: "image/png",
        blob: new Blob(["third photo"], { type: "image/png" }),
      },
    ])

    const zip = await JSZip.loadAsync(zipBlob)

    expect(Object.keys(zip.files).sort()).toEqual([
      "photo-no-bg-2.png",
      "photo-no-bg-3.png",
      "photo-no-bg.png",
    ])
    await expect(zip.file("photo-no-bg.png")?.async("string")).resolves.toBe("first photo")
    await expect(zip.file("photo-no-bg-2.png")?.async("string")).resolves.toBe("second photo")
    await expect(zip.file("photo-no-bg-3.png")?.async("string")).resolves.toBe("third photo")
  })

  it("converts a completed item canvas into a zip item", async () => {
    const canvas = {
      toBlob: vi.fn((callback: BlobCallback, type?: string, quality?: number) => {
        expect(type).toBe("image/webp")
        expect(quality).toBe(0.86)
        callback(new Blob(["canvas"], { type: "image/webp" }))
      }),
    } as unknown as HTMLCanvasElement

    const zipItem = await canvasToBatchZipItem(
      {
        id: "1",
        file: file("sample.png"),
        image: image(),
        mimeType: "image/png",
        baseName: "sample",
        dimensions: { width: 100, height: 80 },
        sourceUrl: "blob:sample",
        status: "ready",
        progress: null,
        error: null,
        resultCanvas: canvas,
        resultUrl: "blob:result",
        device: "wasm",
      },
      "image/webp",
      0.86
    )

    expect(zipItem).toMatchObject({
      id: "1",
      originalFileName: "sample.png",
      outputFormat: "image/webp",
    })
    expect(zipItem?.blob.type).toBe("image/webp")
  })

  it("returns null when a batch item has no result canvas", async () => {
    const zipItem = await canvasToBatchZipItem(
      {
        id: "1",
        file: file("sample.png"),
        image: image(),
        mimeType: "image/png",
        baseName: "sample",
        dimensions: { width: 100, height: 80 },
        sourceUrl: "blob:sample",
        status: "queued",
        progress: null,
        error: null,
        resultCanvas: null,
        resultUrl: "",
        device: null,
      },
      "image/png"
    )

    expect(zipItem).toBeNull()
  })
})
