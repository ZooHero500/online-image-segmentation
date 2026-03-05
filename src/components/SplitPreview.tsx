"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import type { SplitResult } from "@/types"

interface SplitPreviewProps {
  results: SplitResult[]
  originalFileName: string
  fileExtension: string
  onDownloadSingle: (result: SplitResult, fileName: string) => void
  onDownloadAll: () => void
}

function getFileName(
  originalFileName: string,
  result: SplitResult,
  ext: string
): string {
  return `${originalFileName}_r${result.row}_c${result.col}.${ext}`
}

function ResultItem({
  result,
  originalFileName,
  fileExtension,
  onDownload,
}: {
  result: SplitResult
  originalFileName: string
  fileExtension: string
  onDownload: (result: SplitResult, fileName: string) => void
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(result.blob)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [result.blob])

  const fileName = getFileName(originalFileName, result, fileExtension)

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-card p-3">
      {previewUrl && (
        <img
          src={previewUrl}
          alt={fileName}
          className="w-full h-32 object-contain bg-muted/50 rounded"
        />
      )}
      <div className="text-xs text-muted-foreground">
        <p className="truncate font-medium">{fileName}</p>
        <p>
          {result.width} x {result.height}px
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() => onDownload(result, fileName)}
      >
        下载
      </Button>
    </div>
  )
}

export function SplitPreview({
  results,
  originalFileName,
  fileExtension,
  onDownloadSingle,
  onDownloadAll,
}: SplitPreviewProps) {
  const maxCols = useMemo(
    () => Math.max(...results.map((r) => r.col)),
    [results]
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          分割结果（{results.length} 张）
        </h3>
        <Button size="sm" onClick={onDownloadAll}>
          下载全部 (ZIP)
        </Button>
      </div>
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${Math.min(maxCols, 4)}, minmax(0, 1fr))`,
        }}
      >
        {results.map((result) => (
          <ResultItem
            key={`${result.row}-${result.col}`}
            result={result}
            originalFileName={originalFileName}
            fileExtension={fileExtension}
            onDownload={onDownloadSingle}
          />
        ))}
      </div>
    </div>
  )
}
