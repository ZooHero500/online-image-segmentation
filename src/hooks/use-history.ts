"use client"

import { useCallback, useState, useEffect } from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { storageService, db } from "@/lib/storage-service"
import type { HistoryRecord } from "@/types"

interface UseHistoryReturn {
  records: HistoryRecord[]
  isLoading: boolean
  saveCurrentWork: (
    record: Omit<HistoryRecord, "id" | "createdAt">
  ) => Promise<void>
  loadRecord: (id: string) => Promise<HistoryRecord | undefined>
  deleteRecord: (id: string) => Promise<void>
  storageInfo: { used: number; quota: number }
}

export function useHistory(): UseHistoryReturn {
  const [storageInfo, setStorageInfo] = useState({ used: 0, quota: 0 })

  const rawRecords = useLiveQuery(
    () => db.history.orderBy("createdAt").reverse().toArray(),
    []
  )

  const records: HistoryRecord[] = (rawRecords ?? []).map((r) => {
    const record: HistoryRecord = {
      id: r.externalId,
      originalFileName: r.originalFileName,
      originalMimeType: r.originalMimeType,
      lines: JSON.parse(r.lines),
      createdAt: r.createdAt,
      thumbnailDataUrl: r.thumbnailDataUrl,
      imageBlob: r.imageBlob,
    }

    if (r.imageBlobs && r.imageBlobs.length > 0) {
      const fileNames: string[] = r.imageFileNames
        ? JSON.parse(r.imageFileNames as string)
        : []
      const mimeTypes: string[] = r.imageMimeTypes
        ? JSON.parse(r.imageMimeTypes as string)
        : []
      record.images = r.imageBlobs.map((blob: Blob, i: number) => ({
        blob,
        fileName: fileNames[i] || r.originalFileName,
        mimeType: mimeTypes[i] || r.originalMimeType,
      }))
    }

    return record
  })

  const isLoading = rawRecords === undefined

  useEffect(() => {
    storageService.getStorageUsage().then(setStorageInfo)
  }, [rawRecords?.length])

  const saveCurrentWork = useCallback(
    async (data: Omit<HistoryRecord, "id" | "createdAt">) => {
      await storageService.saveRecord(data)
    },
    []
  )

  const loadRecord = useCallback(async (id: string) => {
    return storageService.getRecord(id)
  }, [])

  const deleteRecord = useCallback(async (id: string) => {
    await storageService.deleteRecord(id)
  }, [])

  return {
    records,
    isLoading,
    saveCurrentWork,
    loadRecord,
    deleteRecord,
    storageInfo,
  }
}
