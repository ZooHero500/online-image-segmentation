"use client"

import { useCallback, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Download, RotateCcw, ImagePlus, Check, X } from "lucide-react"
import { useResizeEditor } from "@/hooks/use-resize-editor"
import { exportArtboard } from "@/lib/resize-export"
import { ACCEPTED_TYPES } from "@/lib/upload-utils"
import { CanvasSizeControl } from "./CanvasSizeControl"
import { ResizeCanvas } from "./ResizeCanvas"

export function ResizeEditor() {
  const t = useTranslations("resize")
  const replaceInputRef = useRef<HTMLInputElement>(null)
  const {
    canvasSize,
    setCanvasSize,
    image,
    transform,
    setTransform,
    mode,
    setMode,
    cropRect,
    setCropRect,
    loadImage,
    applyCrop,
    cancelCrop,
    resetImage,
    clearImage,
    fileName,
    mimeType,
  } = useResizeEditor()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === "crop") {
        if (e.key === "Enter") {
          e.preventDefault()
          applyCrop()
        } else if (e.key === "Escape") {
          e.preventDefault()
          cancelCrop()
        }
      } else if (e.key === "Escape" && mode === "selected") {
        setMode("idle")
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (mode === "selected") {
          clearImage()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [mode, applyCrop, cancelCrop, setMode, clearImage])

  const handleImageFile = useCallback(
    async (file: File) => {
      try {
        await loadImage(file)
      } catch {
        toast.error(t("uploadHint"))
      }
    },
    [loadImage, t]
  )

  const handleDownload = useCallback(
    async (format: "image/png" | "image/jpeg") => {
      if (!image) return

      try {
        const quality = format === "image/jpeg" ? 0.92 : undefined
        const blob = await exportArtboard(
          image,
          transform,
          canvasSize.width,
          canvasSize.height,
          format,
          quality
        )

        const ext = format === "image/jpeg" ? ".jpg" : ".png"
        const baseName = fileName
          ? fileName.replace(/\.[^.]+$/, "")
          : "resized"
        const downloadName = `${baseName}_${canvasSize.width}x${canvasSize.height}${ext}`

        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = downloadName
        a.click()
        URL.revokeObjectURL(url)
      } catch {
        toast.error("Export failed")
      }
    },
    [image, transform, canvasSize, fileName]
  )

  const handleReplaceFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleImageFile(file)
      if (replaceInputRef.current) replaceInputRef.current.value = ""
    },
    [handleImageFile]
  )

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-border">
        {/* Left: Canvas size */}
        <CanvasSizeControl
          width={canvasSize.width}
          height={canvasSize.height}
          onChange={setCanvasSize}
        />

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Crop mode actions */}
          {mode === "crop" && (
            <>
              <p className="text-[10px] text-muted-foreground mr-2 hidden sm:block">
                {t("cropHint")}
              </p>
              <button
                onClick={applyCrop}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider bg-accent text-accent-foreground rounded hover:bg-accent/90 transition-colors"
              >
                <Check className="h-3.5 w-3.5" />
                {t("applyCrop")}
              </button>
              <button
                onClick={cancelCrop}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider border border-border text-muted-foreground rounded hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                {t("cancelCrop")}
              </button>
            </>
          )}

          {/* Normal mode actions */}
          {mode !== "crop" && image && (
            <>
              <button
                onClick={() => replaceInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider border border-border text-muted-foreground rounded hover:text-foreground transition-colors"
                title={t("replaceImage")}
              >
                <ImagePlus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("replaceImage")}</span>
              </button>
              <button
                onClick={resetImage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider border border-border text-muted-foreground rounded hover:text-foreground transition-colors"
                title={t("reset")}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("reset")}</span>
              </button>
              <button
                onClick={() => handleDownload("image/png")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider bg-foreground text-background rounded hover:bg-foreground/90 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                PNG
              </button>
              <button
                onClick={() => handleDownload("image/jpeg")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider bg-foreground text-background rounded hover:bg-foreground/90 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                JPG
              </button>
            </>
          )}

          <input
            ref={replaceInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            onChange={handleReplaceFile}
          />
        </div>
      </div>

      {/* Canvas area */}
      <ResizeCanvas
        canvasWidth={canvasSize.width}
        canvasHeight={canvasSize.height}
        image={image}
        transform={transform}
        onTransformChange={setTransform}
        mode={mode}
        onModeChange={setMode}
        cropRect={cropRect}
        onCropRectChange={setCropRect}
        onImageFile={handleImageFile}
      />
    </div>
  )
}
