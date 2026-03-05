"use client"

import { useCallback, useState } from "react"
import { splitImage } from "@/lib/image-splitter"
import {
  exportAsZip,
  downloadSingle,
  getZipFileName,
} from "@/lib/zip-exporter"
import type { SplitLine, SplitResult } from "@/types"

interface UseImageExportReturn {
  splitResults: SplitResult[]
  isSplitting: boolean
  generateSplit: (
    image: HTMLImageElement,
    lines: SplitLine[],
    mimeType: string
  ) => Promise<SplitResult[]>
  downloadAll: (
    originalFileName: string,
    fileExtension: string
  ) => Promise<void>
  downloadOne: (result: SplitResult, fileName: string) => void
  clearResults: () => void
}

export function useImageExport(): UseImageExportReturn {
  const [splitResults, setSplitResults] = useState<SplitResult[]>([])
  const [isSplitting, setIsSplitting] = useState(false)

  const generateSplit = useCallback(
    async (
      image: HTMLImageElement,
      lines: SplitLine[],
      mimeType: string
    ): Promise<SplitResult[]> => {
      setIsSplitting(true)
      try {
        const results = await splitImage(image, lines, mimeType)
        setSplitResults(results)
        return results
      } finally {
        setIsSplitting(false)
      }
    },
    []
  )

  const downloadAll = useCallback(
    async (originalFileName: string, fileExtension: string) => {
      if (splitResults.length === 0) return
      const zipBlob = await exportAsZip({
        originalFileName,
        results: splitResults,
        fileExtension,
      })
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = getZipFileName(originalFileName)
      a.click()
      URL.revokeObjectURL(url)
    },
    [splitResults]
  )

  const downloadOne = useCallback(
    (result: SplitResult, fileName: string) => {
      downloadSingle(result, fileName)
    },
    []
  )

  const clearResults = useCallback(() => {
    setSplitResults([])
  }, [])

  return {
    splitResults,
    isSplitting,
    generateSplit,
    downloadAll,
    downloadOne,
    clearResults,
  }
}
