import { describe, it, expect, vi } from "vitest"
import { exportAsZip, downloadSingle, getSelectedZipFileName, getZipFileName, exportGridAsZip, getGridZipFileName } from "../zip-exporter"
import type { SplitResult } from "@/types"

function createMockResult(row: number, col: number): SplitResult {
  return {
    row,
    col,
    blob: new Blob(["test"], { type: "image/png" }),
    width: 100,
    height: 100,
  }
}

describe("exportAsZip", () => {
  it("should create a valid ZIP blob", async () => {
    const results = [createMockResult(1, 1), createMockResult(1, 2)]

    const zipBlob = await exportAsZip({
      originalFileName: "photo",
      results,
      fileExtension: "png",
    })

    expect(zipBlob).toBeInstanceOf(Blob)
    expect(zipBlob.type).toBe("application/zip")
  })

  it("should include all results in the ZIP", async () => {
    const results = [
      createMockResult(1, 1),
      createMockResult(1, 2),
      createMockResult(2, 1),
      createMockResult(2, 2),
    ]

    const zipBlob = await exportAsZip({
      originalFileName: "photo",
      results,
      fileExtension: "png",
    })

    // Verify ZIP is not empty
    expect(zipBlob.size).toBeGreaterThan(0)

    // Verify file names by loading the ZIP
    const JSZip = (await import("jszip")).default
    const zip = await JSZip.loadAsync(zipBlob)
    const fileNames = Object.keys(zip.files)

    expect(fileNames).toContain("photo_r1_c1.png")
    expect(fileNames).toContain("photo_r1_c2.png")
    expect(fileNames).toContain("photo_r2_c1.png")
    expect(fileNames).toContain("photo_r2_c2.png")
    expect(fileNames).toHaveLength(4)
  })

  it("should use correct naming convention", async () => {
    const results = [createMockResult(3, 2)]

    const zipBlob = await exportAsZip({
      originalFileName: "my-image",
      results,
      fileExtension: "jpg",
    })

    const JSZip = (await import("jszip")).default
    const zip = await JSZip.loadAsync(zipBlob)
    const fileNames = Object.keys(zip.files)

    expect(fileNames).toContain("my-image_r3_c2.jpg")
  })
})

describe("getSelectedZipFileName", () => {
  it("should return filename with _selected.zip suffix", () => {
    expect(getSelectedZipFileName("photo")).toBe("photo_selected.zip")
  })

  it("should handle filenames with special characters", () => {
    expect(getSelectedZipFileName("my-image")).toBe("my-image_selected.zip")
  })

  it("should differ from getZipFileName", () => {
    const name = "photo"
    expect(getSelectedZipFileName(name)).not.toBe(getZipFileName(name))
  })
})

describe("exportGridAsZip", () => {
  it("should create ZIP with sequential naming", async () => {
    const blobs = [
      new Blob(["1"], { type: "image/png" }),
      new Blob(["2"], { type: "image/png" }),
      new Blob(["3"], { type: "image/png" }),
    ]
    const zipBlob = await exportGridAsZip(blobs, "jpg")
    expect(zipBlob).toBeInstanceOf(Blob)
    expect(zipBlob.type).toBe("application/zip")
    const JSZip = (await import("jszip")).default
    const zip = await JSZip.loadAsync(zipBlob)
    const fileNames = Object.keys(zip.files)
    expect(fileNames).toEqual(["grid-1.jpg", "grid-2.jpg", "grid-3.jpg"])
  })

  it("should handle 9 files for 3x3 grid", async () => {
    const blobs = Array.from({ length: 9 }, (_, i) =>
      new Blob([String(i)], { type: "image/jpeg" })
    )
    const zipBlob = await exportGridAsZip(blobs, "jpg")
    const JSZip = (await import("jszip")).default
    const zip = await JSZip.loadAsync(zipBlob)
    const fileNames = Object.keys(zip.files)
    expect(fileNames).toHaveLength(9)
    expect(fileNames[0]).toBe("grid-1.jpg")
    expect(fileNames[8]).toBe("grid-9.jpg")
  })
})

describe("getGridZipFileName", () => {
  it("should return grid_split.zip", () => {
    expect(getGridZipFileName()).toBe("grid_split.zip")
  })
})

describe("downloadSingle", () => {
  it("should trigger download with correct filename", () => {
    const createObjectURL = vi.fn(() => "blob:test-url")
    const revokeObjectURL = vi.fn()
    const clickMock = vi.fn()

    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL })

    const mockAnchor = {
      href: "",
      download: "",
      click: clickMock,
    }
    vi.spyOn(document, "createElement").mockReturnValue(
      mockAnchor as unknown as HTMLAnchorElement
    )

    const result = createMockResult(1, 1)
    downloadSingle(result, "photo_r1_c1.png")

    expect(mockAnchor.download).toBe("photo_r1_c1.png")
    expect(clickMock).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test-url")
  })
})
