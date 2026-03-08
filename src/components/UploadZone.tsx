"use client"

import { useCallback, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import type { UploadResult } from "@/types"

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"]
const MAX_SIZE = 20 * 1024 * 1024 // 20MB per file
const MAX_TOTAL_SIZE = 50 * 1024 * 1024 // 50MB total

interface UploadZoneProps {
  onImageLoaded?: (result: UploadResult) => void
  onImagesLoaded?: (results: UploadResult[]) => void
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load image"))
    }
    img.src = url
  })
}

export function UploadZone({ onImageLoaded, onImagesLoaded }: UploadZoneProps) {
  const t = useTranslations("upload")
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFiles = useCallback(
    async (files: FileList) => {
      setError(null)

      const validFiles: File[] = []
      for (const file of Array.from(files)) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          setError(t("unsupportedFormat"))
          return
        }
        if (file.size > MAX_SIZE) {
          setError(t("fileTooLarge", { name: file.name }))
          return
        }
        validFiles.push(file)
      }

      if (validFiles.length === 0) return

      // Check total size
      const totalSize = validFiles.reduce((sum, f) => sum + f.size, 0)
      if (totalSize > MAX_TOTAL_SIZE) {
        toast.warning(
          t("totalSizeWarning", { size: (totalSize / 1024 / 1024).toFixed(1) })
        )
      }

      try {
        const results: UploadResult[] = []
        for (const file of validFiles) {
          const image = await loadImage(file)
          results.push({ file, image, mimeType: file.type })
        }

        // Support both single and multi callbacks
        if (onImagesLoaded) {
          onImagesLoaded(results)
        } else if (onImageLoaded && results.length > 0) {
          onImageLoaded(results[0])
        }
      } catch {
        setError(t("loadFailed"))
      }
    },
    [onImageLoaded, onImagesLoaded, t]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files)
      }
    },
    [processFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files)
      }
      if (inputRef.current) inputRef.current.value = ""
    },
    [processFiles]
  )

  return (
    <div
      className={`group flex flex-col items-center justify-center border-t border-b p-16 md:p-24 transition-all duration-700 ease-luxury cursor-pointer ${
        isDragOver
          ? "border-[#D4AF37] bg-[#D4AF37]/5"
          : "border-[#1A1A1A]/20 hover:border-[#1A1A1A]/40"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#6C6863] mb-6">
          {t("title")}
        </p>
        <p className="font-serif text-2xl md:text-3xl text-[#1A1A1A] mb-4">
          {t("dragHint")}
        </p>
        <div className="flex items-center gap-4 justify-center mb-6">
          <span className="h-px w-8 bg-[#1A1A1A]/20" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#6C6863]">{t("or")}</span>
          <span className="h-px w-8 bg-[#1A1A1A]/20" />
        </div>
        <p className="text-sm text-[#1A1A1A] group-hover:text-[#D4AF37] transition-colors duration-500">
          {t("clickHint")}
        </p>
        <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-[#6C6863]/70">
          {t("formatHint")}
        </p>
      </div>

      {error && (
        <p className="mt-6 text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
