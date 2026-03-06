"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Download, ZoomIn } from "lucide-react"
import type { SplitResult } from "@/types"

interface ResultSheetProps {
  open: boolean
  onClose: () => void
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
}: {
  result: SplitResult
  originalFileName: string
  fileExtension: string
  onDownload: (result: SplitResult, fileName: string) => void
  onPreview: (src: string, alt: string) => void
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(result.blob)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [result.blob])

  const fileName = getFileName(originalFileName, result, fileExtension)

  return (
    <div className="group border-t border-[#1A1A1A]/10 dark:border-[#F9F8F6]/10">
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
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/10 transition-colors duration-700 flex items-center justify-center">
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
  originalFileName,
  fileExtension,
  onDownloadSingle,
  onDownloadAll,
}: ResultSheetProps) {
  const [lightbox, setLightbox] = useState<{
    src: string
    alt: string
  } | null>(null)

  const maxCols = useMemo(
    () => Math.max(...results.map((r) => r.col)),
    [results]
  )

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
              分割结果
            </span>
            <span className="text-xs text-[#1A1A1A] font-medium">
              {results.length} 张图片
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
        <div className="px-6 py-4 border-b border-[#1A1A1A]/10 shrink-0">
          <button
            onClick={onDownloadAll}
            className="group relative w-full inline-flex items-center justify-center gap-2 bg-[#1A1A1A] text-[#F9F8F6] px-6 py-3 text-xs uppercase tracking-[0.2em] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500"
          >
            <span className="absolute inset-0 bg-[#D4AF37] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
            <Download className="relative z-10 h-3.5 w-3.5" strokeWidth={1.5} />
            <span className="relative z-10">下载全部 (ZIP)</span>
          </button>
        </div>

        {/* Results grid */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${Math.min(maxCols, 2)}, minmax(0, 1fr))`,
            }}
          >
            {results.map((result) => (
              <ResultItem
                key={`${result.row}-${result.col}`}
                result={result}
                originalFileName={originalFileName}
                fileExtension={fileExtension}
                onDownload={onDownloadSingle}
                onPreview={handlePreview}
              />
            ))}
          </div>
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
