import { describe, it, expect, vi } from "vitest"
import { exportAsZip, downloadSingle } from "../zip-exporter"
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
