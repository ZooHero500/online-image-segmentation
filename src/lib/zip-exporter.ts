import type { SplitResult, ZipExportOptions } from "@/types"

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
