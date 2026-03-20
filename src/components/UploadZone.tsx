"use client"

import { useCallback, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import type { UploadResult } from "@/types"
import { validateFiles, loadImage, ACCEPTED_TYPES } from "@/lib/upload-utils"

interface UploadZoneProps {
  onImageLoaded?: (result: UploadResult) => void
  onImagesLoaded?: (results: UploadResult[]) => void
}

export function UploadZone({ onImageLoaded, onImagesLoaded }: UploadZoneProps) {
  const t = useTranslations("upload")
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFiles = useCallback(
    async (files: FileList) => {
      setError(null)

      const result = validateFiles(Array.from(files))
      if (!result.valid) {
        setError(t(result.error!.key, result.error!.params))
        return
      }

      if (result.totalSizeWarning) {
        const totalSize = result.files.reduce((sum, f) => sum + f.size, 0)
        toast.warning(
          t("totalSizeWarning", { size: (totalSize / 1024 / 1024).toFixed(1) })
        )
      }

      try {
        const results: UploadResult[] = []
        for (const file of result.files) {
          const image = await loadImage(file)
          results.push({ file, image, mimeType: file.type })
        }

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
      className={`group flex flex-col items-center justify-center border-t border-b p-8 sm:p-16 md:p-24 transition-all duration-700 ease-luxury cursor-pointer ${
        isDragOver
          ? "border-accent bg-accent/5"
          : "border-primary/20 hover:border-primary/40"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
          {t("title")}
        </p>
        <p className="font-serif text-2xl md:text-3xl text-foreground mb-4">
          {t("dragHint")}
        </p>
        <div className="flex items-center gap-4 justify-center mb-6">
          <span className="h-px w-8 bg-primary/20" />
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{t("or")}</span>
          <span className="h-px w-8 bg-primary/20" />
        </div>
        <p className="text-sm text-foreground group-hover:text-accent transition-colors duration-500">
          {t("clickHint")}
        </p>
        <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
          {t("formatHint")}
        </p>
      </div>

      {error && (
        <p className="mt-6 text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
