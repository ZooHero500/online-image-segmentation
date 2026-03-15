import type { SplitResult, ZipExportOptions, BatchZipExportOptions } from "@/types"

function getFileName(
  originalFileName: string,
  result: SplitResult,
  fileExtension: string
): string {
  return `${originalFileName}_r${result.row}_c${result.col}.${fileExtension}`
}

export async function exportAsZip(options: ZipExportOptions): Promise<Blob> {
  const { default: JSZip } = await import("jszip")
  const zip = new JSZip()

  for (const result of options.results) {
    const fileName = getFileName(
      options.originalFileName,
      result,
      options.fileExtension
    )
    zip.file(fileName, result.blob)
  }

  return zip.generateAsync({ type: "blob", mimeType: "application/zip" })
}

export async function exportBatchAsZip(options: BatchZipExportOptions): Promise<Blob> {
  const { default: JSZip } = await import("jszip")
  const zip = new JSZip()

  const isSingle = options.items.length === 1

  for (const item of options.items) {
    for (const result of item.results) {
      const fileName = getFileName(
        item.originalFileName,
        result,
        item.fileExtension
      )
      if (isSingle) {
        // Single image: flat structure (backward compatible)
        zip.file(fileName, result.blob)
      } else {
        // Multiple images: subfolder per image
        zip.file(`${item.originalFileName}/${fileName}`, result.blob)
      }
    }
  }

  return zip.generateAsync({ type: "blob", mimeType: "application/zip" })
}

export function downloadSingle(result: SplitResult, fileName: string): void {
  const url = URL.createObjectURL(result.blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

export function getZipFileName(originalFileName: string): string {
  return `${originalFileName}_split.zip`
}

export function getSelectedZipFileName(originalFileName: string): string {
  return `${originalFileName}_selected.zip`
}

export function getBatchZipFileName(): string {
  return `batch_split.zip`
}

export async function exportGridAsZip(
  blobs: Blob[],
  fileExtension: string
): Promise<Blob> {
  const { default: JSZip } = await import("jszip")
  const zip = new JSZip()
  for (let i = 0; i < blobs.length; i++) {
    zip.file(`grid-${i + 1}.${fileExtension}`, blobs[i])
  }
  return zip.generateAsync({ type: "blob", mimeType: "application/zip" })
}

export function getGridZipFileName(): string {
  return "grid_split.zip"
}
