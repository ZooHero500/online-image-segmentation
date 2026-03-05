import Dexie, { type EntityTable } from "dexie"
import type { HistoryRecord } from "@/types"

const MAX_RECORDS = 50
const LS_RECORD_PREFIX = "img-split:record:"

interface DBHistoryRecord {
  id?: number
  externalId: string
  originalFileName: string
  originalMimeType: string
  lines: string // JSON serialized SplitLine[]
  createdAt: number
  thumbnailDataUrl: string
  imageBlob: Blob
}

class ImageSplitDB extends Dexie {
  history!: EntityTable<DBHistoryRecord, "id">

  constructor() {
    super("ImageSplitDB")
    this.version(1).stores({
      history: "++id, createdAt, externalId",
    })
  }
}

export const db = new ImageSplitDB()

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function toHistoryRecord(dbRecord: DBHistoryRecord): HistoryRecord {
  return {
    id: dbRecord.externalId,
    originalFileName: dbRecord.originalFileName,
    originalMimeType: dbRecord.originalMimeType,
    lines: JSON.parse(dbRecord.lines),
    createdAt: dbRecord.createdAt,
    thumbnailDataUrl: dbRecord.thumbnailDataUrl,
    imageBlob: dbRecord.imageBlob,
  }
}

function clearRecordLocalData(id: string): void {
  const prefix = `${LS_RECORD_PREFIX}${id}:`
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(prefix)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key))
}

async function enforceLimit(): Promise<void> {
  const count = await db.history.count()
  if (count > MAX_RECORDS) {
    const excess = count - MAX_RECORDS
    const oldest = await db.history
      .orderBy("createdAt")
      .limit(excess)
      .toArray()
    for (const record of oldest) {
      clearRecordLocalData(record.externalId)
      await db.history.delete(record.id!)
    }
  }
}

export const storageService = {
  async saveRecord(
    data: Omit<HistoryRecord, "id" | "createdAt">
  ): Promise<HistoryRecord> {
    const externalId = generateId()
    const createdAt = Date.now()

    const dbRecord: DBHistoryRecord = {
      externalId,
      originalFileName: data.originalFileName,
      originalMimeType: data.originalMimeType,
      lines: JSON.stringify(data.lines),
      createdAt,
      thumbnailDataUrl: data.thumbnailDataUrl,
      imageBlob: data.imageBlob,
    }

    await db.history.add(dbRecord)
    await enforceLimit()

    return {
      id: externalId,
      originalFileName: data.originalFileName,
      originalMimeType: data.originalMimeType,
      lines: data.lines,
      createdAt,
      thumbnailDataUrl: data.thumbnailDataUrl,
      imageBlob: data.imageBlob,
    }
  },

  async getRecords(): Promise<HistoryRecord[]> {
    const records = await db.history.orderBy("createdAt").reverse().toArray()
    return records.map(toHistoryRecord)
  },

  async getRecord(id: string): Promise<HistoryRecord | undefined> {
    const record = await db.history
      .where("externalId")
      .equals(id)
      .first()
    return record ? toHistoryRecord(record) : undefined
  },

  async deleteRecord(id: string): Promise<void> {
    clearRecordLocalData(id)
    const record = await db.history
      .where("externalId")
      .equals(id)
      .first()
    if (record?.id) {
      await db.history.delete(record.id)
    }
  },

  async getStorageUsage(): Promise<{ used: number; quota: number }> {
    if (typeof navigator !== "undefined" && navigator.storage?.estimate) {
      const estimate = await navigator.storage.estimate()
      return {
        used: estimate.usage ?? 0,
        quota: estimate.quota ?? 0,
      }
    }
    return { used: 0, quota: 0 }
  },
}
