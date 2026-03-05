import { describe, it, expect, beforeEach } from "vitest"
import { storageService, db } from "../storage-service"
import type { HistoryRecord } from "@/types"

function createMockRecord(): Omit<HistoryRecord, "id" | "createdAt"> {
  return {
    originalFileName: "test-image",
    originalMimeType: "image/png",
    lines: [{ id: "1", orientation: "horizontal" as const, position: 100 }],
    thumbnailDataUrl: "data:image/png;base64,test",
    imageBlob: new Blob(["test"], { type: "image/png" }),
  }
}

// Simple in-memory localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
    get length() { return Object.keys(store).length },
    key: (index: number) => Object.keys(store)[index] ?? null,
  }
})()

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock, writable: true })

describe("StorageService", () => {
  beforeEach(async () => {
    await db.history.clear()
    localStorageMock.clear()
  })

  it("should save a record and return it with id and createdAt", async () => {
    const data = createMockRecord()
    const record = await storageService.saveRecord(data)

    expect(record.id).toBeDefined()
    expect(record.createdAt).toBeDefined()
    expect(record.originalFileName).toBe("test-image")
    expect(record.lines).toHaveLength(1)
  })

  it("should get all records", async () => {
    await storageService.saveRecord(createMockRecord())
    await storageService.saveRecord(createMockRecord())

    const records = await storageService.getRecords()
    expect(records).toHaveLength(2)
  })

  it("should get a single record by id", async () => {
    const saved = await storageService.saveRecord(createMockRecord())
    const record = await storageService.getRecord(saved.id)

    expect(record).toBeDefined()
    expect(record!.id).toBe(saved.id)
  })

  it("should return undefined for non-existent record", async () => {
    const record = await storageService.getRecord("non-existent")
    expect(record).toBeUndefined()
  })

  it("should delete a record", async () => {
    const saved = await storageService.saveRecord(createMockRecord())
    await storageService.deleteRecord(saved.id)

    const record = await storageService.getRecord(saved.id)
    expect(record).toBeUndefined()
  })

  it("should clear localStorage data with record prefix on delete", async () => {
    const saved = await storageService.saveRecord(createMockRecord())
    localStorage.setItem(`img-split:record:${saved.id}:some-key`, "value")
    localStorage.setItem(`img-split:record:${saved.id}:other`, "value2")
    localStorage.setItem("img-split:unrelated", "keep")

    await storageService.deleteRecord(saved.id)

    expect(
      localStorage.getItem(`img-split:record:${saved.id}:some-key`)
    ).toBeNull()
    expect(
      localStorage.getItem(`img-split:record:${saved.id}:other`)
    ).toBeNull()
    expect(localStorage.getItem("img-split:unrelated")).toBe("keep")
  })

  it("should enforce 50 record limit by deleting oldest", async () => {
    // Insert 50 records
    for (let i = 0; i < 50; i++) {
      await storageService.saveRecord(createMockRecord())
    }

    const before = await storageService.getRecords()
    expect(before).toHaveLength(50)

    // Insert one more
    await storageService.saveRecord(createMockRecord())

    const after = await storageService.getRecords()
    expect(after).toHaveLength(50)
  })

  it("should return records ordered by createdAt descending", async () => {
    const r1 = await storageService.saveRecord(createMockRecord())
    const r2 = await storageService.saveRecord(createMockRecord())

    const records = await storageService.getRecords()
    expect(records[0].createdAt).toBeGreaterThanOrEqual(records[1].createdAt)
  })

  it("should provide storage usage info", async () => {
    const usage = await storageService.getStorageUsage()
    expect(usage).toHaveProperty("used")
    expect(usage).toHaveProperty("quota")
    expect(typeof usage.used).toBe("number")
    expect(typeof usage.quota).toBe("number")
  })
})
