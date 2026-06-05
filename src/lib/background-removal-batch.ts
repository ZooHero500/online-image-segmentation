import type { UploadResult } from "@/types"
import {
  exportBackgroundRemovalCanvas,
  getBackgroundRemovalBaseName,
  getBackgroundRemovalOutputExtension,
} from "@/lib/background-removal"
import type { BackgroundRemovalOutputFormat } from "@/lib/background-removal"

export type BatchRemovalStatus =
  | "queued"
  | "loading-model"
  | "processing"
  | "ready"
  | "error"
  | "canceled"

export type BatchRemovalItem = {
  id: string
  file: File
  image: HTMLImageElement
  mimeType: string
  baseName: string
  dimensions: { width: number; height: number }
  sourceUrl: string
  status: BatchRemovalStatus
  progress: number | null
  error: string | null
  resultCanvas: HTMLCanvasElement | null
  resultUrl: string
  device: "webgpu" | "wasm" | null
}

export type BatchRemovalSummaryItem = Pick<BatchRemovalItem, "id" | "status">

export type BackgroundRemovalBatchSummary = {
  total: number
  ready: number
  failed: number
  active: number
  queued: number
  completed: number
  percent: number
  isBusy: boolean
  canDownloadReady: boolean
  hasFailures: boolean
}

export type BatchRemovalZipItem = {
  id: string
  originalFileName: string
  outputFormat: BackgroundRemovalOutputFormat
  blob: Blob
}

// The returned items own their Object URLs. Call disposeBatchRemovalItemUrls()
// or disposeBatchRemovalItems() when items are removed, replaced, or canceled.
export function createBatchRemovalItems(
  results: UploadResult[],
  createId: () => string
): BatchRemovalItem[] {
  return results.map((result) => ({
    id: createId(),
    file: result.file,
    image: result.image,
    mimeType: result.mimeType,
    baseName: getBackgroundRemovalBaseName(result.file.name),
    dimensions: {
      width: result.image.naturalWidth || result.image.width,
      height: result.image.naturalHeight || result.image.height,
    },
    sourceUrl: URL.createObjectURL(result.file),
    status: "queued",
    progress: null,
    error: null,
    resultCanvas: null,
    resultUrl: "",
    device: null,
  }))
}

export function disposeBatchRemovalItemUrls(item: BatchRemovalItem): void {
  disposeBatchRemovalUrls([item])
}

export function disposeBatchRemovalItems(items: BatchRemovalItem[]): void {
  disposeBatchRemovalUrls(items)
}

function disposeBatchRemovalUrls(items: BatchRemovalItem[]): void {
  const urls = new Set<string>()

  for (const item of items) {
    urls.add(item.sourceUrl)
    if (item.resultUrl) {
      urls.add(item.resultUrl)
    }
  }

  for (const url of urls) {
    URL.revokeObjectURL(url)
  }
}

export function getBackgroundRemovalBatchSummary(
  items: BatchRemovalSummaryItem[]
): BackgroundRemovalBatchSummary {
  const ready = items.filter((item) => item.status === "ready").length
  const failed = items.filter((item) => item.status === "error").length
  const active = items.filter(
    (item) => item.status === "loading-model" || item.status === "processing"
  ).length
  const queued = items.filter((item) => item.status === "queued").length
  const canceled = items.filter((item) => item.status === "canceled").length
  const completed = ready + failed + canceled
  const total = items.length

  return {
    total,
    ready,
    failed,
    active,
    queued,
    completed,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    isBusy: active > 0,
    canDownloadReady: ready > 0,
    hasFailures: failed > 0,
  }
}

export function getBackgroundRemovalOutputFileName(
  originalFileName: string,
  format: BackgroundRemovalOutputFormat
): string {
  const baseName = getBackgroundRemovalBaseName(originalFileName)
  const extension = getBackgroundRemovalOutputExtension(format)
  return `${baseName}-no-bg.${extension}`
}

export function getBackgroundRemovalZipFileName(): string {
  return "background_removed_images.zip"
}

export async function exportBackgroundRemovalBatchAsZip(
  items: BatchRemovalZipItem[]
): Promise<Blob> {
  const { default: JSZip } = await import("jszip")
  const zip = new JSZip()
  const usedFileNames = new Set<string>()

  for (const item of items) {
    const outputFileName = getBackgroundRemovalOutputFileName(
      item.originalFileName,
      item.outputFormat
    )
    const lastDot = outputFileName.lastIndexOf(".")
    const baseName = outputFileName.slice(0, lastDot)
    const extension = outputFileName.slice(lastDot)
    let zipFileName = outputFileName
    let duplicateIndex = 2

    while (usedFileNames.has(zipFileName)) {
      zipFileName = `${baseName}-${duplicateIndex}${extension}`
      duplicateIndex += 1
    }

    usedFileNames.add(zipFileName)
    zip.file(zipFileName, item.blob)
  }

  return zip.generateAsync({ type: "blob", mimeType: "application/zip" })
}

export async function canvasToBatchZipItem(
  item: BatchRemovalItem,
  outputFormat: BackgroundRemovalOutputFormat,
  quality?: number
): Promise<BatchRemovalZipItem | null> {
  if (!item.resultCanvas) return null

  return {
    id: item.id,
    originalFileName: item.file.name,
    outputFormat,
    blob: await exportBackgroundRemovalCanvas(item.resultCanvas, outputFormat, quality),
  }
}
