import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useImageExport } from "../use-image-export"
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

const mockResults: SplitResult[] = [
  createMockResult(1, 1),
  createMockResult(1, 2),
  createMockResult(2, 1),
  createMockResult(2, 2),
]

vi.mock("@/lib/image-splitter", () => ({
  splitImage: vi.fn(() => Promise.resolve(mockResults)),
}))

const mockExportAsZip = vi.fn(() =>
  Promise.resolve(new Blob(["zip"], { type: "application/zip" }))
)

vi.mock("@/lib/zip-exporter", () => ({
  exportAsZip: (...args: unknown[]) => mockExportAsZip(...args),
  downloadSingle: vi.fn(),
  getZipFileName: (name: string) => `${name}_split.zip`,
  getSelectedZipFileName: (name: string) => `${name}_selected.zip`,
}))

// Track anchor element downloads without overriding createElement
let lastAnchorDownload = ""
const mockClick = vi.fn()
const originalCreateElement = document.createElement.bind(document)

beforeEach(() => {
  vi.clearAllMocks()
  lastAnchorDownload = ""

  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})

  vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
    if (tagName === "a") {
      const anchor = originalCreateElement("a")
      Object.defineProperty(anchor, "click", { value: mockClick })
      Object.defineProperty(anchor, "download", {
        get() { return lastAnchorDownload },
        set(v: string) { lastAnchorDownload = v },
      })
      return anchor
    }
    return originalCreateElement(tagName)
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

async function setupHookWithResults() {
  const { result } = renderHook(() => useImageExport())
  const mockImage = {} as HTMLImageElement
  await act(async () => {
    await result.current.generateSplit(mockImage, [], "image/png")
  })
  return result
}

describe("useImageExport - core", () => {
  it("should initialize with empty state", () => {
    const { result } = renderHook(() => useImageExport())
    expect(result.current.splitResults).toHaveLength(0)
    expect(result.current.batchResults).toHaveLength(0)
    expect(result.current.isSplitting).toBe(false)
    expect(result.current.selectedKeys.size).toBe(0)
  })

  it("should set isSplitting to true during generation", async () => {
    const { result } = renderHook(() => useImageExport())
    const mockImage = {} as HTMLImageElement

    let splittingDuringCall = false
    const promise = act(async () => {
      const genPromise = result.current.generateSplit(mockImage, [], "image/png")
      // isSplitting is set synchronously before the async work
      splittingDuringCall = result.current.isSplitting
      await genPromise
    })

    await promise
    expect(result.current.isSplitting).toBe(false)
  })

  it("should store results after generateSplit", async () => {
    const result = await setupHookWithResults()
    expect(result.current.splitResults).toHaveLength(4)
  })

  it("should clear results", async () => {
    const result = await setupHookWithResults()
    expect(result.current.splitResults).toHaveLength(4)

    act(() => result.current.clearResults())

    expect(result.current.splitResults).toHaveLength(0)
    expect(result.current.batchResults).toHaveLength(0)
    expect(result.current.selectedKeys.size).toBe(0)
  })

  it("should call downloadAll and trigger browser download", async () => {
    const result = await setupHookWithResults()

    await act(async () => {
      await result.current.downloadAll("photo", "png")
    })

    expect(mockExportAsZip).toHaveBeenCalledTimes(1)
    expect(mockClick).toHaveBeenCalled()
    expect(lastAnchorDownload).toBe("photo_split.zip")
  })

  it("should not download when no results", async () => {
    const { result } = renderHook(() => useImageExport())

    await act(async () => {
      await result.current.downloadAll("photo", "png")
    })

    expect(mockExportAsZip).not.toHaveBeenCalled()
  })

  it("should call downloadOne via downloadSingle", async () => {
    const { downloadSingle: mockDownloadSingle } = await import("@/lib/zip-exporter")
    const result = await setupHookWithResults()

    act(() => {
      result.current.downloadOne(result.current.splitResults[0], "photo_r1_c1.png")
    })

    expect(mockDownloadSingle).toHaveBeenCalledWith(
      result.current.splitResults[0],
      "photo_r1_c1.png"
    )
  })
})

describe("useImageExport - selection", () => {
  describe("toggleSelect", () => {
    it("should add a key when toggling an unselected item", async () => {
      const result = await setupHookWithResults()

      act(() => result.current.toggleSelect("1-1"))

      expect(result.current.selectedKeys.has("1-1")).toBe(true)
      expect(result.current.selectedKeys.size).toBe(1)
    })

    it("should remove a key when toggling a selected item", async () => {
      const result = await setupHookWithResults()

      act(() => result.current.toggleSelect("1-1"))
      act(() => result.current.toggleSelect("1-1"))

      expect(result.current.selectedKeys.has("1-1")).toBe(false)
      expect(result.current.selectedKeys.size).toBe(0)
    })

    it("should support selecting multiple items", async () => {
      const result = await setupHookWithResults()

      act(() => result.current.toggleSelect("1-1"))
      act(() => result.current.toggleSelect("2-1"))

      expect(result.current.selectedKeys.size).toBe(2)
      expect(result.current.selectedKeys.has("1-1")).toBe(true)
      expect(result.current.selectedKeys.has("2-1")).toBe(true)
    })
  })

  describe("selectAll", () => {
    it("should select all split results", async () => {
      const result = await setupHookWithResults()

      act(() => result.current.selectAll())

      expect(result.current.selectedKeys.size).toBe(4)
      expect(result.current.selectedKeys.has("1-1")).toBe(true)
      expect(result.current.selectedKeys.has("1-2")).toBe(true)
      expect(result.current.selectedKeys.has("2-1")).toBe(true)
      expect(result.current.selectedKeys.has("2-2")).toBe(true)
    })
  })

  describe("deselectAll", () => {
    it("should clear all selections", async () => {
      const result = await setupHookWithResults()

      act(() => result.current.selectAll())
      expect(result.current.selectedKeys.size).toBe(4)

      act(() => result.current.deselectAll())
      expect(result.current.selectedKeys.size).toBe(0)
    })
  })

  describe("clearSelection", () => {
    it("should clear all selections", async () => {
      const result = await setupHookWithResults()

      act(() => result.current.toggleSelect("1-1"))
      act(() => result.current.toggleSelect("2-2"))
      expect(result.current.selectedKeys.size).toBe(2)

      act(() => result.current.clearSelection())
      expect(result.current.selectedKeys.size).toBe(0)
    })
  })

  describe("clearResults", () => {
    it("should clear selected keys when clearing results", async () => {
      const result = await setupHookWithResults()

      act(() => result.current.toggleSelect("1-1"))
      act(() => result.current.toggleSelect("2-2"))
      expect(result.current.selectedKeys.size).toBe(2)

      act(() => result.current.clearResults())

      expect(result.current.selectedKeys.size).toBe(0)
      expect(result.current.splitResults).toHaveLength(0)
    })
  })

  describe("generateSplit", () => {
    it("should clear selected keys when generating new split", async () => {
      const result = await setupHookWithResults()

      act(() => result.current.toggleSelect("1-1"))
      expect(result.current.selectedKeys.size).toBe(1)

      const mockImage = {} as HTMLImageElement
      await act(async () => {
        await result.current.generateSplit(mockImage, [], "image/png")
      })

      expect(result.current.selectedKeys.size).toBe(0)
    })
  })
})

describe("useImageExport - downloadSelected", () => {
  it("should call exportAsZip with only selected results", async () => {
    const result = await setupHookWithResults()

    act(() => result.current.toggleSelect("1-1"))
    act(() => result.current.toggleSelect("2-2"))

    await act(async () => {
      await result.current.downloadSelected("photo", "png")
    })

    expect(mockExportAsZip).toHaveBeenCalledTimes(1)
    const callArgs = mockExportAsZip.mock.calls[0][0] as {
      originalFileName: string
      results: SplitResult[]
      fileExtension: string
    }
    expect(callArgs.originalFileName).toBe("photo")
    expect(callArgs.fileExtension).toBe("png")
    expect(callArgs.results).toHaveLength(2)
    expect(callArgs.results.some((r: SplitResult) => r.row === 1 && r.col === 1)).toBe(true)
    expect(callArgs.results.some((r: SplitResult) => r.row === 2 && r.col === 2)).toBe(true)
  })

  it("should not call exportAsZip when nothing is selected", async () => {
    const result = await setupHookWithResults()

    await act(async () => {
      await result.current.downloadSelected("photo", "png")
    })

    expect(mockExportAsZip).not.toHaveBeenCalled()
  })

  it("should preserve selected keys after download", async () => {
    const result = await setupHookWithResults()

    act(() => result.current.toggleSelect("1-1"))
    act(() => result.current.toggleSelect("1-2"))

    await act(async () => {
      await result.current.downloadSelected("photo", "png")
    })

    expect(result.current.selectedKeys.size).toBe(2)
    expect(result.current.selectedKeys.has("1-1")).toBe(true)
    expect(result.current.selectedKeys.has("1-2")).toBe(true)
  })

  it("should trigger browser download with _selected.zip filename", async () => {
    const result = await setupHookWithResults()

    act(() => result.current.toggleSelect("1-1"))

    await act(async () => {
      await result.current.downloadSelected("photo", "png")
    })

    expect(mockClick).toHaveBeenCalled()
    expect(lastAnchorDownload).toBe("photo_selected.zip")
  })
})
