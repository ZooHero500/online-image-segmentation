"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { X, Download, ZoomIn, Check } from "lucide-react"
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
function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string
  alt: string
  onClose: () => void
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1A1A]/90 backdrop-blur-sm cursor-pointer"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-[#F9F8F6]/60 hover:text-[#F9F8F6] transition-colors duration-500 z-10"
      >
        <X className="h-5 w-5" strokeWidth={1.5} />
      </button>

      {/* Image */}
      <img
        src={src}
        alt={alt}
        className="max-w-[90vw] max-h-[90vh] object-contain shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        onClick={(e) => e.stopPropagation()}
      />

      {/* File name label */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#F9F8F6]/50">
          {alt}
        </span>
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
  selected,
  onToggleSelect,
}: {
  result: SplitResult
  originalFileName: string
  fileExtension: string
  onDownload: (result: SplitResult, fileName: string) => void
  onPreview: (src: string, alt: string) => void
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
          ? "border-[#D4AF37] ring-1 ring-[#D4AF37]/40"
          : "border-[#1A1A1A]/10 dark:border-[#F9F8F6]/10"
      }`}
    >
      {/* Image preview */}
      {previewUrl && (
        <div
          className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-[#EBE5DE]/30"
          onClick={() => onPreview(previewUrl, fileName)}
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
                ? "bg-[#D4AF37] border-[#D4AF37] text-white"
                : "bg-white/80 border-[#1A1A1A]/25 text-transparent hover:border-[#D4AF37]/60"
            }`}
          >
            <Check className="h-3 w-3" strokeWidth={2} />
          </button>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/10 transition-colors duration-700 flex items-center justify-center pointer-events-none">
            <ZoomIn
              className="h-5 w-5 text-[#F9F8F6] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              strokeWidth={1.5}
            />
          </div>
        </div>
      )}

      {/* Info + actions */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A] truncate font-medium">
            {fileName}
          </p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#6C6863] mt-1">
            {result.width} &times; {result.height}px
          </p>
        </div>
        <button
          onClick={() => onDownload(result, fileName)}
          className="shrink-0 w-8 h-8 flex items-center justify-center border border-[#1A1A1A]/15 text-[#6C6863] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors duration-500"
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
  const [lightbox, setLightbox] = useState<{
    src: string
    alt: string
  } | null>(null)

  const isMultiImage = batchResults && batchResults.length > 1

  const maxCols = useMemo(
    () => Math.max(...results.map((r) => r.col), 1),
    [results]
  )

  const totalCount = isMultiImage
    ? batchResults.reduce((sum, b) => sum + b.results.length, 0)
    : results.length

  const selectedCount = selectedKeys.size

  const handlePreview = useCallback((src: string, alt: string) => {
    setLightbox({ src, alt })
  }, [])

  const closeLightbox = useCallback(() => {
    setLightbox(null)
  }, [])

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[#1A1A1A]/20 backdrop-blur-[2px] transition-opacity duration-700"
          onClick={onClose}
        />
      )}

      {/* Sheet panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-[#F9F8F6] shadow-[-8px_0_32px_rgba(0,0,0,0.08)] transform transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1A1A1A]/10 shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863] block mb-1">
              {t("title")}
            </span>
            <span className="text-xs text-[#1A1A1A] font-medium">
              {t("imageCount", { count: totalCount })}
              {isMultiImage && (
                <span className="text-[#6C6863] ml-1">
                  {t("sourceCount", { count: batchResults.length })}
                </span>
              )}
              {selectedCount > 0 && (
                <span className="text-[#D4AF37] ml-2">
                  {t("selectedCount", { selected: selectedCount, total: totalCount })}
                </span>
              )}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-[#1A1A1A]/15 text-[#6C6863] hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors duration-500"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Download all button */}
        <div className="px-6 py-4 border-b border-[#1A1A1A]/10 shrink-0 space-y-3">
          <button
            onClick={onDownloadAll}
            className="group relative w-full inline-flex items-center justify-center gap-2 bg-[#1A1A1A] text-[#F9F8F6] px-6 py-3 text-xs uppercase tracking-[0.2em] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500"
          >
            <span className="absolute inset-0 bg-[#D4AF37] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
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
                  ? "bg-[#D4AF37] border-[#D4AF37] text-white"
                  : "bg-white border-[#1A1A1A]/25 text-transparent hover:border-[#D4AF37]/60"
              }`}
            >
              <Check className="h-3 w-3" strokeWidth={2} />
            </button>
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#6C6863]">
              {t("selectAll")}
            </span>

            <div className="flex-1" />

            {/* Download selected button */}
            <button
              onClick={onDownloadSelected}
              disabled={selectedCount === 0}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-[10px] uppercase tracking-[0.15em] border transition-all duration-500 ${
                selectedCount > 0
                  ? "border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white"
                  : "border-[#1A1A1A]/10 text-[#1A1A1A]/25 cursor-not-allowed"
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
              {batchResults.map((batch, imageIndex) => {
                const batchFileName = getFileNameWithoutExtension(batch.fileName)
                const batchExt = getFileExtension(batch.mimeType)
                const batchMaxCols = Math.max(...batch.results.map((r) => r.col), 1)
                return (
                  <div key={`batch-${imageIndex}`}>
                    <div className="mb-3 pb-2 border-b border-[#1A1A1A]/10">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#6C6863]">
                        {batch.fileName}
                      </span>
                      <span className="text-[10px] text-[#6C6863]/60 ml-2">
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
                        return (
                          <ResultItem
                            key={key}
                            result={result}
                            originalFileName={batchFileName}
                            fileExtension={batchExt}
                            onDownload={onDownloadSingle}
                            onPreview={handlePreview}
                            selected={selectedKeys.has(key)}
                            onToggleSelect={() => onToggleSelect(key)}
                          />
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            // Single image: flat grid (backward compatible)
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${Math.min(maxCols, 2)}, minmax(0, 1fr))`,
              }}
            >
              {results.map((result) => {
                const key = getResultKey(result)
                return (
                  <ResultItem
                    key={key}
                    result={result}
                    originalFileName={originalFileName}
                    fileExtension={fileExtension}
                    onDownload={onDownloadSingle}
                    onPreview={handlePreview}
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
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={closeLightbox}
        />
      )}
    </>
  )
}
