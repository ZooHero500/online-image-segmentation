import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"
import { useHistory } from "../use-history"
import { storageService, db } from "@/lib/storage-service"
import type { HistoryRecord } from "@/types"

function createMockRecordData(): Omit<HistoryRecord, "id" | "createdAt"> {
  return {
    originalFileName: "test-image",
    originalMimeType: "image/png",
    lines: [{ id: "1", orientation: "horizontal" as const, position: 100 }],
    thumbnailDataUrl: "data:image/png;base64,test",
    imageBlob: new Blob(["test"], { type: "image/png" }),
  }
}

describe("useHistory", () => {
  beforeEach(async () => {
    await db.history.clear()
  })

  it("should initialize with empty records", async () => {
    const { result } = renderHook(() => useHistory())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.records).toHaveLength(0)
  })

  it("should save and reflect a new record", async () => {
    const { result } = renderHook(() => useHistory())

    await act(async () => {
      await result.current.saveCurrentWork(createMockRecordData())
    })

    await waitFor(() => {
      expect(result.current.records).toHaveLength(1)
    })

    expect(result.current.records[0].originalFileName).toBe("test-image")
  })

  it("should load a single record by id", async () => {
    const { result } = renderHook(() => useHistory())

    let savedId = ""
    await act(async () => {
      const saved = await storageService.saveRecord(createMockRecordData())
      savedId = saved.id
    })

    const loaded = await result.current.loadRecord(savedId)
    expect(loaded).toBeDefined()
    expect(loaded!.id).toBe(savedId)
    expect(loaded!.originalFileName).toBe("test-image")
  })

  it("should return undefined when loading non-existent record", async () => {
    const { result } = renderHook(() => useHistory())

    const loaded = await result.current.loadRecord("non-existent-id")
    expect(loaded).toBeUndefined()
  })

  it("should delete a record", async () => {
    const { result } = renderHook(() => useHistory())

    let savedId = ""
    await act(async () => {
      const saved = await storageService.saveRecord(createMockRecordData())
      savedId = saved.id
    })

    await waitFor(() => {
      expect(result.current.records).toHaveLength(1)
    })

    await act(async () => {
      await result.current.deleteRecord(savedId)
    })

    await waitFor(() => {
      expect(result.current.records).toHaveLength(0)
    })
  })

  it("should return records in descending order by createdAt", async () => {
    const { result } = renderHook(() => useHistory())

    await act(async () => {
      await storageService.saveRecord({
        ...createMockRecordData(),
        originalFileName: "first",
      })
    })

    // Small delay to ensure different timestamps
    await new Promise((r) => setTimeout(r, 10))

    await act(async () => {
      await storageService.saveRecord({
        ...createMockRecordData(),
        originalFileName: "second",
      })
    })

    await waitFor(() => {
      expect(result.current.records).toHaveLength(2)
    })

    // Most recent first
    expect(result.current.records[0].originalFileName).toBe("second")
    expect(result.current.records[1].originalFileName).toBe("first")
  })

  it("should provide storage usage info", async () => {
    const { result } = renderHook(() => useHistory())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.storageInfo).toHaveProperty("used")
    expect(result.current.storageInfo).toHaveProperty("quota")
    expect(typeof result.current.storageInfo.used).toBe("number")
  })

  it("should reactively update when records are added externally", async () => {
    const { result } = renderHook(() => useHistory())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.records).toHaveLength(0)

    // Add record via storageService directly
    await act(async () => {
      await storageService.saveRecord(createMockRecordData())
    })

    await waitFor(() => {
      expect(result.current.records).toHaveLength(1)
    })
  })

  it("should deserialize lines from stored JSON", async () => {
    const { result } = renderHook(() => useHistory())

    const data = createMockRecordData()
    data.lines = [
      { id: "h1", orientation: "horizontal", position: 50 },
      { id: "v1", orientation: "vertical", position: 200 },
    ]

    await act(async () => {
      await storageService.saveRecord(data)
    })

    await waitFor(() => {
      expect(result.current.records).toHaveLength(1)
    })

    expect(result.current.records[0].lines).toHaveLength(2)
    expect(result.current.records[0].lines[0].orientation).toBe("horizontal")
    expect(result.current.records[0].lines[1].orientation).toBe("vertical")
  })
})
