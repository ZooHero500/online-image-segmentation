"use client"

import { useCallback, useState } from "react"
import { splitImage } from "@/lib/image-splitter"
import {
  exportAsZip,
  downloadSingle,
  getZipFileName,
  getSelectedZipFileName,
} from "@/lib/zip-exporter"
import type { SplitLine, SplitResult } from "@/types"

function getResultKey(result: SplitResult): string {
  return `${result.row}-${result.col}`
}

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
  selectedKeys: ReadonlySet<string>
  toggleSelect: (key: string) => void
  selectAll: () => void
  deselectAll: () => void
  clearSelection: () => void
  downloadSelected: (
    originalFileName: string,
    fileExtension: string
  ) => Promise<void>
}

export function useImageExport(): UseImageExportReturn {
  const [splitResults, setSplitResults] = useState<SplitResult[]>([])
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
        setSelectedKeys(new Set())
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
    setSelectedKeys(new Set(splitResults.map(getResultKey)))
  }, [splitResults])

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

  return {
    splitResults,
    isSplitting,
    generateSplit,
    downloadAll,
    downloadOne,
    clearResults,
    selectedKeys,
    toggleSelect,
    selectAll,
    deselectAll,
    clearSelection,
    downloadSelected,
  }
}
