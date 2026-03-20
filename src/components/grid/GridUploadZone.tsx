"use client"

import { useCallback, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { validateFiles, loadImage, ACCEPTED_TYPES } from "@/lib/upload-utils"

interface GridUploadZoneProps {
  onImageLoaded: (image: HTMLImageElement, file: File) => void
}

export function GridUploadZone({ onImageLoaded }: GridUploadZoneProps) {
  const t = useTranslations("grid.upload")
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const tUpload = useTranslations("upload")

  const processFile = useCallback(
    async (files: FileList) => {
      setError(null)
      const file = files[0]
      if (!file) return

      const result = validateFiles([file])
      if (!result.valid) {
        setError(tUpload(result.error!.key, result.error!.params))
        return
      }

      try {
        const image = await loadImage(result.files[0])
        onImageLoaded(image, result.files[0])
      } catch {
        setError(tUpload("loadFailed"))
      }
    },
    [onImageLoaded, tUpload]
  )

  return (
    <div
      className={`flex flex-col items-center justify-center border-t border-b p-8 sm:p-16 md:p-24 transition-all duration-700 cursor-pointer ${
        isDragOver
          ? "border-accent bg-accent/5"
          : "border-primary/20 hover:border-primary/40"
      }`}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        if (e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files)
      }}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false) }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          if (e.target.files) processFile(e.target.files)
          if (inputRef.current) inputRef.current.value = ""
        }}
      />
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
          {t("title")}
        </p>
        <p className="font-serif text-2xl md:text-3xl text-foreground mb-4">
          {t("dragHint")}
        </p>
        <p className="text-sm text-foreground hover:text-accent transition-colors duration-500">
          {t("clickHint")}
        </p>
        <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
          {t("formatHint")}
        </p>
      </div>
      {error && <p className="mt-6 text-sm text-destructive">{error}</p>}
    </div>
  )
}
