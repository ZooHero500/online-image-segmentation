"use client"

import { useCallback, useState } from "react"
import { splitImage } from "@/lib/image-splitter"
import {
  exportAsZip,
  exportBatchAsZip,
  downloadSingle,
  getZipFileName,
  getSelectedZipFileName,
  getBatchZipFileName,
} from "@/lib/zip-exporter"
import type { SplitLine, SplitResult, BatchSplitResult } from "@/types"

function getResultKey(result: SplitResult, imageIndex?: number): string {
  if (imageIndex !== undefined) {
    return `${imageIndex}-${result.row}-${result.col}`
  }
  return `${result.row}-${result.col}`
}

function getFileExtension(mimeType: string): string {
  if (mimeType === "image/webp") return "png"
  if (mimeType === "image/jpeg") return "jpg"
  if (mimeType === "image/png") return "png"
  return "png"
}

function getFileNameWithoutExtension(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "")
}

interface ImageItem {
  image: HTMLImageElement
  fileName: string
  mimeType: string
}

interface UseImageExportReturn {
  splitResults: SplitResult[]
  batchResults: BatchSplitResult[]
  isSplitting: boolean
  generateSplit: (
    image: HTMLImageElement,
    lines: SplitLine[],
    mimeType: string
  ) => Promise<SplitResult[]>
  generateBatchSplit: (
    images: ImageItem[],
    linesPerImage: SplitLine[][]
  ) => Promise<BatchSplitResult[]>
  downloadAll: (
    originalFileName: string,
    fileExtension: string
  ) => Promise<void>
  downloadBatchAll: () => Promise<void>
  downloadOne: (result: SplitResult, fileName: string) => void
  clearResults: () => void
  selectedKeys: ReadonlySet<string>
  toggleSelect: (key: string) => void
  selectAll: () => void
  deselectAll: () => void
  clearSelection: () => void
  downloadSelected: (
    originalFileName: string,
    fileExtension: string
  ) => Promise<void>
  downloadBatchSelected: () => Promise<void>
}

export function useImageExport(): UseImageExportReturn {
  const [splitResults, setSplitResults] = useState<SplitResult[]>([])
  const [batchResults, setBatchResults] = useState<BatchSplitResult[]>([])
  const [isSplitting, setIsSplitting] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())

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
        setBatchResults([])
        setSelectedKeys(new Set())
        return results
      } finally {
        setIsSplitting(false)
      }
    },
    []
  )

  const generateBatchSplit = useCallback(
    async (
      images: ImageItem[],
      linesPerImage: SplitLine[][]
    ): Promise<BatchSplitResult[]> => {
      setIsSplitting(true)
      try {
        const batch: BatchSplitResult[] = []
        for (let i = 0; i < images.length; i++) {
          const item = images[i]
          const lines = linesPerImage[i] ?? []
          const results = await splitImage(item.image, lines, item.mimeType)
          batch.push({
            fileName: item.fileName,
            mimeType: item.mimeType,
            results,
          })
        }
        setBatchResults(batch)
        // Flatten for backward compatible display
        const allResults = batch.flatMap((b, i) =>
          b.results.map((r) => ({ ...r, _imageIndex: i }))
        )
        setSplitResults(allResults)
        setSelectedKeys(new Set())
        return batch
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

  const downloadBatchAll = useCallback(async () => {
    if (batchResults.length === 0) return
    const zipBlob = await exportBatchAsZip({
      items: batchResults.map((b) => ({
        originalFileName: getFileNameWithoutExtension(b.fileName),
        results: b.results,
        fileExtension: getFileExtension(b.mimeType),
      })),
    })
    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = getBatchZipFileName()
    a.click()
    URL.revokeObjectURL(url)
  }, [batchResults])

  const downloadOne = useCallback(
    (result: SplitResult, fileName: string) => {
      downloadSingle(result, fileName)
    },
    []
  )

  const clearResults = useCallback(() => {
    setSplitResults([])
    setBatchResults([])
    setSelectedKeys(new Set())
  }, [])

  const toggleSelect = useCallback((key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    if (batchResults.length > 0) {
      const keys: string[] = []
      batchResults.forEach((b, i) => {
        b.results.forEach((r) => keys.push(getResultKey(r, i)))
      })
      setSelectedKeys(new Set(keys))
    } else {
      setSelectedKeys(new Set(splitResults.map((r) => getResultKey(r))))
    }
  }, [splitResults, batchResults])

  const deselectAll = useCallback(() => {
    setSelectedKeys(new Set())
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedKeys(new Set())
  }, [])

  const downloadSelected = useCallback(
    async (originalFileName: string, fileExtension: string) => {
      if (selectedKeys.size === 0) return
      const selected = splitResults.filter((r) =>
        selectedKeys.has(getResultKey(r))
      )
      if (selected.length === 0) return
      const zipBlob = await exportAsZip({
        originalFileName,
        results: selected,
        fileExtension,
      })
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = getSelectedZipFileName(originalFileName)
      a.click()
      URL.revokeObjectURL(url)
    },
    [splitResults, selectedKeys]
  )

  const downloadBatchSelected = useCallback(async () => {
    if (selectedKeys.size === 0 || batchResults.length === 0) return

    const items = batchResults.map((b, i) => ({
      originalFileName: getFileNameWithoutExtension(b.fileName),
      results: b.results.filter((r) => selectedKeys.has(getResultKey(r, i))),
      fileExtension: getFileExtension(b.mimeType),
    })).filter((item) => item.results.length > 0)

    if (items.length === 0) return

    const zipBlob = await exportBatchAsZip({ items })
    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = "selected_split.zip"
    a.click()
    URL.revokeObjectURL(url)
  }, [batchResults, selectedKeys])

  return {
    splitResults,
    batchResults,
    isSplitting,
    generateSplit,
    generateBatchSplit,
    downloadAll,
    downloadBatchAll,
    downloadOne,
    clearResults,
    selectedKeys,
    toggleSelect,
    selectAll,
    deselectAll,
    clearSelection,
    downloadSelected,
    downloadBatchSelected,
  }
}
