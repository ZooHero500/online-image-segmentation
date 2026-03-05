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

  const records: HistoryRecord[] = (rawRecords ?? []).map((r) => ({
    id: r.externalId,
    originalFileName: r.originalFileName,
    originalMimeType: r.originalMimeType,
    lines: JSON.parse(r.lines),
    createdAt: r.createdAt,
    thumbnailDataUrl: r.thumbnailDataUrl,
    imageBlob: r.imageBlob,
  }))

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
