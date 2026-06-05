"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  BACKGROUND_REMOVAL_MODEL_ID,
  loadImageFromBlob,
  refineBackgroundRemovalCanvas,
} from "@/lib/background-removal"
import type { BackgroundRemovalRefineOptions } from "@/lib/background-removal"
import {
  createBatchRemovalItems,
  disposeBatchRemovalItemUrls,
  disposeBatchRemovalItems,
  getBackgroundRemovalBatchSummary,
} from "@/lib/background-removal-batch"
import type { BatchRemovalItem } from "@/lib/background-removal-batch"
import {
  BackgroundRemovalWorkerClient,
  type BackgroundRemovalWorkerDevice,
} from "@/lib/background-removal-worker-client"
import type { UploadResult } from "@/types"

type BatchAction =
  | { type: "add"; items: BatchRemovalItem[] }
  | { type: "remove"; id: string }
  | { type: "clear" }
  | { type: "start"; id: string }
  | {
      type: "status"
      id: string
      status: "loading-model" | "processing"
      device: BackgroundRemovalWorkerDevice | null
    }
  | { type: "progress"; id: string; progress: number | null }
  | {
      type: "ready"
      id: string
      resultCanvas: HTMLCanvasElement
      resultUrl: string
      appliedRefineOptions: BackgroundRemovalRefineOptions
      device: BackgroundRemovalWorkerDevice
    }
  | { type: "error"; id: string; error: string }
  | { type: "cancel-pending" }
  | { type: "retry-failed" }
  | { type: "retry-item"; id: string }

export type UseBackgroundRemovalBatchOptions = {
  refineOptions: BackgroundRemovalRefineOptions
  onCacheRefresh?: () => Promise<void> | void
  createWorker?: () => Worker
}

let nextBatchId = 0

function createBatchId() {
  nextBatchId += 1
  return `bg-${nextBatchId}`
}

function createBackgroundRemovalWorker() {
  return new Worker(
    new URL("../../workers/background-removal.worker.ts", import.meta.url),
    { type: "module" }
  )
}

function createCanvasFromImage(image: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = image.naturalWidth || image.width
  canvas.height = image.naturalHeight || image.height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas is not available")
  ctx.drawImage(image, 0, 0)
  return canvas
}

function createCanvasObjectUrl(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not create preview"))
        return
      }

      resolve(URL.createObjectURL(blob))
    }, "image/png")
  })
}

function isActiveStatus(item: BatchRemovalItem) {
  return item.status === "loading-model" || item.status === "processing"
}

function canRetryItem(item: BatchRemovalItem) {
  return !isActiveStatus(item) && item.status !== "queued"
}

function resetItemForRetry(item: BatchRemovalItem): BatchRemovalItem {
  return {
    ...item,
    status: "queued",
    progress: null,
    error: null,
    resultCanvas: null,
    resultUrl: "",
    appliedRefineOptions: null,
    device: null,
  }
}

function batchReducer(
  items: BatchRemovalItem[],
  action: BatchAction
): BatchRemovalItem[] {
  switch (action.type) {
    case "add":
      return [...items, ...action.items]
    case "remove":
      return items.filter((item) => item.id !== action.id)
    case "clear":
      return []
    case "start":
      return items.map((item) =>
        item.id === action.id
          ? {
              ...item,
              status: "loading-model",
              progress: null,
              error: null,
              device: null,
            }
          : item
      )
    case "status":
      return items.map((item) =>
        item.id === action.id
          ? {
              ...item,
              status: action.status,
              device: action.device ?? item.device,
            }
          : item
      )
    case "progress":
      return items.map((item) =>
        item.id === action.id ? { ...item, progress: action.progress } : item
      )
    case "ready":
      return items.map((item) =>
        item.id === action.id
          ? {
              ...item,
              status: "ready",
              progress: 1,
              error: null,
              resultCanvas: action.resultCanvas,
              resultUrl: action.resultUrl,
              appliedRefineOptions: action.appliedRefineOptions,
              device: action.device,
            }
          : item
      )
    case "error":
      return items.map((item) =>
        item.id === action.id
          ? {
              ...item,
              status: "error",
              progress: null,
              error: action.error,
            }
          : item
      )
    case "cancel-pending":
      return items.map((item) =>
        item.status === "queued" || isActiveStatus(item)
          ? {
              ...item,
              status: "canceled",
              progress: null,
              error: null,
            }
          : item
      )
    case "retry-failed":
      return items.map((item) =>
        item.status === "error" ? resetItemForRetry(item) : item
      )
    case "retry-item":
      return items.map((item) =>
        item.id === action.id && canRetryItem(item) ? resetItemForRetry(item) : item
      )
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error && error.message
    ? error.message
    : "Background removal failed"
}

export function useBackgroundRemovalBatch(options: UseBackgroundRemovalBatchOptions) {
  const [items, setItems] = useState<BatchRemovalItem[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const itemsRef = useRef<BatchRemovalItem[]>([])
  const optionsRef = useRef(options)
  const clientRef = useRef<BackgroundRemovalWorkerClient | null>(null)
  const isRunningRef = useRef(false)
  const isCancelRequestedRef = useRef(false)
  const runIdRef = useRef(0)
  const activeRequestRef = useRef<{
    runId: number
    requestId: string
    itemId: string
  } | null>(null)

  optionsRef.current = options

  const dispatch = useCallback((action: BatchAction) => {
    const nextItems = batchReducer(itemsRef.current, action)
    itemsRef.current = nextItems
    setItems(nextItems)
  }, [])

  const summary = useMemo(() => getBackgroundRemovalBatchSummary(items), [items])
  const activeItem = useMemo(
    () => items.find((item) => isActiveStatus(item)) ?? null,
    [items]
  )

  const getClient = useCallback(() => {
    if (!clientRef.current) {
      clientRef.current = new BackgroundRemovalWorkerClient(
        optionsRef.current.createWorker ?? createBackgroundRemovalWorker
      )
    }

    return clientRef.current
  }, [])

  const isCurrentRun = useCallback((runId: number) => {
    return runIdRef.current === runId && !isCancelRequestedRef.current
  }, [])

  const isCurrentRequest = useCallback(
    (runId: number, requestId: string, itemId: string) => {
      const activeRequest = activeRequestRef.current
      return (
        isCurrentRun(runId) &&
        activeRequest?.runId === runId &&
        activeRequest.requestId === requestId &&
        activeRequest.itemId === itemId &&
        itemsRef.current.some((item) => item.id === itemId)
      )
    },
    [isCurrentRun]
  )

  const revokeResultUrl = useCallback((id: string) => {
    const item = itemsRef.current.find((candidate) => candidate.id === id)
    if (item?.resultUrl) URL.revokeObjectURL(item.resultUrl)
  }, [])

  const addItems = useCallback(
    (results: UploadResult[]) => {
      const newItems = createBatchRemovalItems(results, createBatchId)
      dispatch({ type: "add", items: newItems })
      return newItems
    },
    [dispatch]
  )

  const removeItem = useCallback(
    (id: string) => {
      const item = itemsRef.current.find((candidate) => candidate.id === id)
      if (!item) return

      if (isActiveStatus(item)) {
        clientRef.current?.terminate()
        clientRef.current = null
        activeRequestRef.current = null
      }

      disposeBatchRemovalItemUrls(item)
      dispatch({ type: "remove", id })
    },
    [dispatch]
  )

  const clearAll = useCallback(() => {
    runIdRef.current += 1
    isCancelRequestedRef.current = true
    isRunningRef.current = false
    activeRequestRef.current = null
    clientRef.current?.terminate()
    clientRef.current = null
    disposeBatchRemovalItems(itemsRef.current)
    dispatch({ type: "clear" })
    setIsRunning(false)
  }, [dispatch])

  const retryFailed = useCallback(() => {
    for (const item of itemsRef.current) {
      if (item.status === "error" && item.resultUrl) {
        URL.revokeObjectURL(item.resultUrl)
      }
    }

    dispatch({ type: "retry-failed" })
  }, [dispatch])

  const retryItem = useCallback(
    (id: string) => {
      const item = itemsRef.current.find((candidate) => candidate.id === id)
      if (!item || !canRetryItem(item)) return

      revokeResultUrl(id)
      dispatch({ type: "retry-item", id })
    },
    [dispatch, revokeResultUrl]
  )

  const cancelQueue = useCallback(() => {
    runIdRef.current += 1
    isCancelRequestedRef.current = true
    isRunningRef.current = false
    activeRequestRef.current = null
    clientRef.current?.terminate()
    clientRef.current = null
    dispatch({ type: "cancel-pending" })
    setIsRunning(false)
  }, [dispatch])

  const runQueue = useCallback(async () => {
    if (isRunningRef.current) return

    const runId = runIdRef.current + 1
    runIdRef.current = runId
    isCancelRequestedRef.current = false
    isRunningRef.current = true
    setIsRunning(true)

    const refineOptionsForRun = optionsRef.current.refineOptions

    try {
      while (isCurrentRun(runId)) {
        const nextItem = itemsRef.current.find((item) => item.status === "queued")
        if (!nextItem) break

        const requestId = `${nextItem.id}-${runId}-${Date.now()}`
        activeRequestRef.current = { runId, requestId, itemId: nextItem.id }
        dispatch({ type: "start", id: nextItem.id })

        try {
          const result = await getClient().remove({
            requestId,
            file: nextItem.file,
            modelId: BACKGROUND_REMOVAL_MODEL_ID,
            onStatus: (message) => {
              if (!isCurrentRequest(runId, requestId, nextItem.id)) return

              dispatch({
                type: "status",
                id: nextItem.id,
                status:
                  message.status === "processing" ? "processing" : "loading-model",
                device: message.device ?? null,
              })
            },
            onProgress: (message) => {
              if (!isCurrentRequest(runId, requestId, nextItem.id)) return
              dispatch({
                type: "progress",
                id: nextItem.id,
                progress: message.progress,
              })
            },
          })

          if (!isCurrentRequest(runId, requestId, nextItem.id)) continue

          const outputImage = await loadImageFromBlob(result.image)
          if (!isCurrentRequest(runId, requestId, nextItem.id)) continue

          const resultCanvas = refineBackgroundRemovalCanvas(
            createCanvasFromImage(outputImage),
            refineOptionsForRun
          )
          const resultUrl = await createCanvasObjectUrl(resultCanvas)

          if (!isCurrentRequest(runId, requestId, nextItem.id)) {
            URL.revokeObjectURL(resultUrl)
            continue
          }

          revokeResultUrl(nextItem.id)
          dispatch({
            type: "ready",
            id: nextItem.id,
            resultCanvas,
            resultUrl,
            appliedRefineOptions: refineOptionsForRun,
            device: result.device,
          })

          try {
            await optionsRef.current.onCacheRefresh?.()
          } catch {
            // Cache status is informational; a refresh failure should not fail the item.
          }
        } catch (error) {
          if (!isCurrentRun(runId)) break

          const stillExists = itemsRef.current.some((item) => item.id === nextItem.id)
          if (!stillExists) continue

          dispatch({
            type: "error",
            id: nextItem.id,
            error: getErrorMessage(error),
          })
        } finally {
          if (activeRequestRef.current?.requestId === requestId) {
            activeRequestRef.current = null
          }
        }
      }
    } finally {
      if (runIdRef.current === runId) {
        isRunningRef.current = false
        isCancelRequestedRef.current = false
        activeRequestRef.current = null
        setIsRunning(false)
      }
    }
  }, [dispatch, getClient, isCurrentRequest, isCurrentRun, revokeResultUrl])

  useEffect(() => {
    return () => {
      runIdRef.current += 1
      isCancelRequestedRef.current = true
      isRunningRef.current = false
      activeRequestRef.current = null
      clientRef.current?.terminate()
      clientRef.current = null
      disposeBatchRemovalItems(itemsRef.current)
      itemsRef.current = []
    }
  }, [])

  return {
    items,
    summary,
    activeItem,
    isRunning,
    addItems,
    removeItem,
    clearAll,
    retryFailed,
    retryItem,
    cancelQueue,
    runQueue,
  }
}
