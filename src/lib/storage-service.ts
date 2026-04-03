import Dexie, { type EntityTable } from "dexie"
import type { HistoryRecord, ImageData } from "@/types"

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
  // 多图支持（非索引字段，无需 schema 变更）
  imageBlobs?: Blob[]
  imageFileNames?: string // JSON serialized string[]
  imageMimeTypes?: string // JSON serialized string[]
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
  const record: HistoryRecord = {
    id: dbRecord.externalId,
    originalFileName: dbRecord.originalFileName,
    originalMimeType: dbRecord.originalMimeType,
    lines: JSON.parse(dbRecord.lines),
    createdAt: dbRecord.createdAt,
    thumbnailDataUrl: dbRecord.thumbnailDataUrl,
    imageBlob: dbRecord.imageBlob,
  }

  if (dbRecord.imageBlobs && dbRecord.imageBlobs.length > 0) {
    const fileNames: string[] = dbRecord.imageFileNames
      ? JSON.parse(dbRecord.imageFileNames)
      : []
    const mimeTypes: string[] = dbRecord.imageMimeTypes
      ? JSON.parse(dbRecord.imageMimeTypes)
      : []
    record.images = dbRecord.imageBlobs.map((blob, i) => ({
      blob,
      fileName: fileNames[i] || dbRecord.originalFileName,
      mimeType: mimeTypes[i] || dbRecord.originalMimeType,
    }))
  }

  return record
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

export type SaveError = "quota_exceeded" | "blob_storage_failed" | "unknown"

interface SaveSuccess {
  success: true
  record: HistoryRecord
}

interface SaveFailure {
  success: false
  error: SaveError
}

export type SaveResult = SaveSuccess | SaveFailure

export const storageService = {
  async saveRecord(
    data: Omit<HistoryRecord, "id" | "createdAt">
  ): Promise<SaveResult> {
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

    if (data.images && data.images.length > 0) {
      dbRecord.imageBlobs = data.images.map((img) => img.blob)
      dbRecord.imageFileNames = JSON.stringify(
        data.images.map((img) => img.fileName)
      )
      dbRecord.imageMimeTypes = JSON.stringify(
        data.images.map((img) => img.mimeType)
      )
    }

    try {
      await db.history.add(dbRecord)
    } catch (err: unknown) {
      const name = err instanceof DOMException ? err.name : ""
      const msg = err instanceof Error ? err.message : String(err)

      if (name === "QuotaExceededError") {
        // Auto-cleanup oldest records and retry once
        try {
          const oldest = await db.history
            .orderBy("createdAt")
            .limit(5)
            .toArray()
          for (const record of oldest) {
            clearRecordLocalData(record.externalId)
            await db.history.delete(record.id!)
          }
          await db.history.add(dbRecord)
        } catch {
          return { success: false, error: "quota_exceeded" }
        }
      } else if (msg.toLowerCase().includes("blob") || msg.toLowerCase().includes("object store")) {
        return { success: false, error: "blob_storage_failed" }
      } else {
        return { success: false, error: "unknown" }
      }
    }

    await enforceLimit()

    return {
      success: true,
      record: {
        id: externalId,
        originalFileName: data.originalFileName,
        originalMimeType: data.originalMimeType,
        lines: data.lines,
        createdAt,
        thumbnailDataUrl: data.thumbnailDataUrl,
        imageBlob: data.imageBlob,
      },
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
