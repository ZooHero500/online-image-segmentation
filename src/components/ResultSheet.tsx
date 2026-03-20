"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { X, Download, ZoomIn, Check, ChevronLeft, ChevronRight } from "lucide-react"
import type { SplitResult, BatchSplitResult } from "@/types"

interface ResultSheetProps {
  open: boolean
  onClose: () => void
  results: SplitResult[]
  batchResults?: BatchSplitResult[]
  originalFileName: string
  fileExtension: string
  onDownloadSingle: (result: SplitResult, fileName: string) => void
  onDownloadAll: () => void
  selectedKeys: ReadonlySet<string>
  onToggleSelect: (key: string) => void
  onSelectAll: () => void
  isAllSelected: boolean
  onDownloadSelected: () => void
}

function getResultKey(result: SplitResult, imageIndex?: number): string {
  if (imageIndex !== undefined) {
    return `${imageIndex}-${result.row}-${result.col}`
  }
  return `${result.row}-${result.col}`
}

function getFileName(
  originalFileName: string,
  result: SplitResult,
  ext: string
): string {
  return `${originalFileName}_r${result.row}_c${result.col}.${ext}`
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

/* ─── Lightbox ─── */
interface LightboxItem {
  src: string
  alt: string
}

function Lightbox({
  items,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  items: LightboxItem[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < items.length - 1
  const current = items[currentIndex]

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft" && hasPrev) onPrev()
      if (e.key === "ArrowRight" && hasNext) onNext()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose, onPrev, onNext, hasPrev, hasNext])

  if (!current) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/90 backdrop-blur-sm cursor-pointer"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-500 z-10"
      >
        <X className="h-5 w-5" strokeWidth={1.5} />
      </button>

      {/* Prev button */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-primary-foreground/50 hover:text-primary-foreground border border-primary-foreground/20 hover:border-primary-foreground/50 transition-all duration-500 z-10"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-primary-foreground/50 hover:text-primary-foreground border border-primary-foreground/20 hover:border-primary-foreground/50 transition-all duration-500 z-10"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
        </button>
      )}

      {/* Image */}
      <img
        src={current.src}
        alt={current.alt}
        className="max-w-[90vw] max-h-[90vh] object-contain shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        onClick={(e) => e.stopPropagation()}
      />

      {/* File name + counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <span className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/50">
          {current.alt}
        </span>
        {items.length > 1 && (
          <span className="text-[10px] tracking-[0.2em] text-primary-foreground/35">
            {currentIndex + 1} / {items.length}
          </span>
        )}
      </div>
    </div>
  )
}

/* ─── Result Item ─── */
function ResultItem({
  result,
  originalFileName,
  fileExtension,
  onDownload,
  onPreview,
  index,
  selected,
  onToggleSelect,
}: {
  result: SplitResult
  originalFileName: string
  fileExtension: string
  onDownload: (result: SplitResult, fileName: string) => void
  onPreview: (index: number) => void
  index: number
  selected: boolean
  onToggleSelect: () => void
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(result.blob)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [result.blob])

  const fileName = getFileName(originalFileName, result, fileExtension)

  return (
    <div
      className={`group border-t transition-colors duration-300 ${
        selected
          ? "border-accent ring-1 ring-accent/40"
          : "border-border dark:border-primary-foreground/10"
      }`}
    >
      {/* Image preview */}
      {previewUrl && (
        <div
          className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-secondary/30"
          onClick={() => onPreview(index)}
        >
          <img
            src={previewUrl}
            alt={fileName}
            className="w-full h-full object-contain transition-transform duration-[1500ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
          />
          {/* Checkbox overlay */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleSelect()
            }}
            className={`absolute top-2 left-2 w-5 h-5 flex items-center justify-center border transition-all duration-300 ${
              selected
                ? "bg-accent border-accent text-accent-foreground"
                : "bg-background/80 border-primary/25 text-transparent hover:border-accent/60"
            }`}
          >
            <Check className="h-3 w-3" strokeWidth={2} />
          </button>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-700 flex items-center justify-center pointer-events-none">
            <ZoomIn
              className="h-5 w-5 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              strokeWidth={1.5}
            />
          </div>
        </div>
      )}

      {/* Info + actions */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-foreground truncate font-medium">
            {fileName}
          </p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
            {result.width} &times; {result.height}px
          </p>
        </div>
        <button
          onClick={() => onDownload(result, fileName)}
          className="shrink-0 w-8 h-8 flex items-center justify-center border border-primary/15 text-muted-foreground hover:text-accent hover:border-accent transition-colors duration-500"
        >
          <Download className="h-3 w-3" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

/* ─── Main Sheet ─── */
export function ResultSheet({
  open,
  onClose,
  results,
  batchResults,
  originalFileName,
  fileExtension,
  onDownloadSingle,
  onDownloadAll,
  selectedKeys,
  onToggleSelect,
  onSelectAll,
  isAllSelected,
  onDownloadSelected,
}: ResultSheetProps) {
  const t = useTranslations("results")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const isMultiImage = batchResults && batchResults.length > 1

  const maxCols = useMemo(
    () => Math.max(...results.map((r) => r.col), 1),
    [results]
  )

  const totalCount = isMultiImage
    ? batchResults.reduce((sum, b) => sum + b.results.length, 0)
    : results.length

  const selectedCount = selectedKeys.size

  // Build flat list of lightbox items with blob URLs
  const lightboxItems = useMemo(() => {
    const items: { blob: Blob; alt: string }[] = []
    if (isMultiImage) {
      for (const batch of batchResults) {
        const name = getFileNameWithoutExtension(batch.fileName)
        const ext = getFileExtension(batch.mimeType)
        for (const r of batch.results) {
          items.push({ blob: r.blob, alt: getFileName(name, r, ext) })
        }
      }
    } else {
      for (const r of results) {
        items.push({ blob: r.blob, alt: getFileName(originalFileName, r, fileExtension) })
      }
    }
    return items
  }, [results, batchResults, isMultiImage, originalFileName, fileExtension])

  // Manage blob URLs for the active lightbox image (and preload neighbors)
  const [lightboxUrls, setLightboxUrls] = useState<Map<number, string>>(new Map())

  useEffect(() => {
    if (lightboxIndex === null) {
      // Revoke all URLs when lightbox closes
      lightboxUrls.forEach((url) => URL.revokeObjectURL(url))
      setLightboxUrls(new Map())
      return
    }
    const indices = [lightboxIndex - 1, lightboxIndex, lightboxIndex + 1].filter(
      (i) => i >= 0 && i < lightboxItems.length
    )
    setLightboxUrls((prev) => {
      const next = new Map(prev)
      for (const i of indices) {
        if (!next.has(i)) {
          next.set(i, URL.createObjectURL(lightboxItems[i].blob))
        }
      }
      return next
    })
  }, [lightboxIndex, lightboxItems])

  // Clean up all URLs on unmount
  useEffect(() => {
    return () => {
      lightboxUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const activeLightboxItems: LightboxItem[] = useMemo(() => {
    return lightboxItems.map((item, i) => ({
      src: lightboxUrls.get(i) ?? "",
      alt: item.alt,
    }))
  }, [lightboxItems, lightboxUrls])

  const handlePreview = useCallback((index: number) => {
    setLightboxIndex(index)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-primary/20 backdrop-blur-[2px] transition-opacity duration-700"
          onClick={onClose}
        />
      )}

      {/* Sheet panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-background shadow-[-8px_0_32px_rgba(0,0,0,0.08)] transform transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground block mb-1">
              {t("title")}
            </span>
            <span className="text-xs text-foreground font-medium">
              {t("imageCount", { count: totalCount })}
              {isMultiImage && (
                <span className="text-muted-foreground ml-1">
                  {t("sourceCount", { count: batchResults.length })}
                </span>
              )}
              {selectedCount > 0 && (
                <span className="text-accent ml-2">
                  {t("selectedCount", { selected: selectedCount, total: totalCount })}
                </span>
              )}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-primary/15 text-muted-foreground hover:text-foreground hover:border-primary transition-colors duration-500"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Download all button */}
        <div className="px-6 py-4 border-b border-border shrink-0 space-y-3">
          <button
            onClick={onDownloadAll}
            className="group relative w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500"
          >
            <span className="absolute inset-0 bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
            <Download className="relative z-10 h-3.5 w-3.5" strokeWidth={1.5} />
            <span className="relative z-10">{t("downloadAll")}</span>
          </button>

          {/* Selection action bar */}
          <div className="flex items-center gap-3">
            {/* Select all checkbox */}
            <button
              onClick={onSelectAll}
              className={`shrink-0 w-5 h-5 flex items-center justify-center border transition-all duration-300 ${
                isAllSelected
                  ? "bg-accent border-accent text-accent-foreground"
                  : "bg-background border-primary/25 text-transparent hover:border-accent/60"
              }`}
            >
              <Check className="h-3 w-3" strokeWidth={2} />
            </button>
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              {t("selectAll")}
            </span>

            <div className="flex-1" />

            {/* Download selected button */}
            <button
              onClick={onDownloadSelected}
              disabled={selectedCount === 0}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-[10px] uppercase tracking-[0.15em] border transition-all duration-500 ${
                selectedCount > 0
                  ? "border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  : "border-border text-foreground/25 cursor-not-allowed"
              }`}
            >
              <Download className="h-3 w-3" strokeWidth={1.5} />
              {selectedCount > 0 ? t("downloadSelectedCount", { count: selectedCount }) : t("downloadSelected")}
            </button>
          </div>
        </div>

        {/* Results grid */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isMultiImage ? (
            // Multi-image: group by source image
            <div className="space-y-6">
              {(() => {
                let flatIndex = 0
                return batchResults.map((batch, imageIndex) => {
                  const batchFileName = getFileNameWithoutExtension(batch.fileName)
                  const batchExt = getFileExtension(batch.mimeType)
                  const batchMaxCols = Math.max(...batch.results.map((r) => r.col), 1)
                  return (
                    <div key={`batch-${imageIndex}`}>
                      <div className="mb-3 pb-2 border-b border-border">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {batch.fileName}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60 ml-2">
                          {t("imageCount", { count: batch.results.length })}
                        </span>
                      </div>
                      <div
                        className="grid gap-4"
                        style={{
                          gridTemplateColumns: `repeat(${Math.min(batchMaxCols, 2)}, minmax(0, 1fr))`,
                        }}
                      >
                        {batch.results.map((result) => {
                          const key = getResultKey(result, imageIndex)
                          const idx = flatIndex++
                          return (
                            <ResultItem
                              key={key}
                              result={result}
                              originalFileName={batchFileName}
                              fileExtension={batchExt}
                              onDownload={onDownloadSingle}
                              onPreview={handlePreview}
                              index={idx}
                              selected={selectedKeys.has(key)}
                              onToggleSelect={() => onToggleSelect(key)}
                            />
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          ) : (
            // Single image: flat grid (backward compatible)
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${Math.min(maxCols, 2)}, minmax(0, 1fr))`,
              }}
            >
              {results.map((result, idx) => {
                const key = getResultKey(result)
                return (
                  <ResultItem
                    key={key}
                    result={result}
                    originalFileName={originalFileName}
                    fileExtension={fileExtension}
                    onDownload={onDownloadSingle}
                    onPreview={handlePreview}
                    index={idx}
                    selected={selectedKeys.has(key)}
                    onToggleSelect={() => onToggleSelect(key)}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={activeLightboxItems}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={() => setLightboxIndex((i) => Math.max(0, (i ?? 0) - 1))}
          onNext={() => setLightboxIndex((i) => Math.min(lightboxItems.length - 1, (i ?? 0) + 1))}
        />
      )}
    </>
  )
}
