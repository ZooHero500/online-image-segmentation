// src/components/compress/CompressEditor.tsx
"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { UploadZone } from "@/components/UploadZone"
import { CompressPreview } from "./CompressPreview"
import { CompressBatchList } from "./CompressBatchList"
import type { BatchItem } from "./CompressBatchList"
import { CompressControls } from "./CompressControls"
import {
  compressImage,
  formatToExtension,
  formatFileSize,
  getBaseName,
} from "@/lib/compress"
import type { OutputFormat } from "@/lib/compress"
import type { UploadResult } from "@/types"
import { Link } from "@/i18n/navigation"
import { LogoIcon } from "@/components/LogoIcon"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"

let nextId = 0
function genId() {
  return `ci-${++nextId}`
}

export function CompressEditor() {
  const t = useTranslations("compress")
  const uploadT = useTranslations("upload")
  const searchParams = useSearchParams()

  // Read presets from URL params
  const initialFormat = ((): OutputFormat => {
    const f = searchParams.get("format")
    if (f === "png") return "image/png"
    if (f === "jpeg" || f === "jpg") return "image/jpeg"
    if (f === "webp") return "image/webp"
    return "image/webp"
  })()
  const initialQuality = (() => {
    const q = searchParams.get("quality")
    if (q) {
      const n = parseInt(q, 10)
      if (n >= 10 && n <= 100) return n
    }
    return 80
  })()

  const [format, setFormat] = useState<OutputFormat>(initialFormat)
  const [quality, setQuality] = useState(initialQuality)
  const [items, setItems] = useState<BatchItem[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const settingsRef = useRef({ format: initialFormat, quality: initialQuality })

  const isSingle = items.length === 1
  const isBatch = items.length > 1
  const allReady = items.length > 0 && items.every((item) => item.result !== null)
  const canDownload = isSingle ? Boolean(items[0]?.result) : isBatch && allReady

  const handleFormatChange = useCallback((nextFormat: OutputFormat) => {
    settingsRef.current = { ...settingsRef.current, format: nextFormat }
    setFormat(nextFormat)
    setItems((prev) => prev.map((item) => ({ ...item, result: null })))
  }, [])

  const handleQualityChange = useCallback((nextQuality: number) => {
    settingsRef.current = { ...settingsRef.current, quality: nextQuality }
    setQuality(nextQuality)
    setItems((prev) => prev.map((item) => ({ ...item, result: null })))
  }, [])

  // --- Compress all items when format/quality changes ---
  const compressAll = useCallback(
    async (targetItems: BatchItem[], fmt: OutputFormat, q: number) => {
      const settled = await Promise.allSettled(
        targetItems.map(async (item) => {
          const result = await compressImage(item.image, item.file, fmt, q / 100)
          return { id: item.id, result }
        })
      )

      const currentSettings = settingsRef.current
      if (currentSettings.format !== fmt || currentSettings.quality !== q) return

      const results = settled
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value)

      if (results.length !== settled.length) {
        toast.error(t("compressFailed"))
      }

      setItems((prev) =>
        prev.map((item) => {
          const found = results.find((r) => r.id === item.id)
          return found ? { ...item, result: found.result } : item
        })
      )
    },
    [t]
  )

  // Re-compress when format or quality changes
  useEffect(() => {
    if (items.length > 0) {
      compressAll(items, format, quality)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, quality])

  // --- Upload handlers ---
  const handleImagesLoaded = useCallback(
    (results: UploadResult[]) => {
      const newItems: BatchItem[] = results.map((r) => ({
        id: genId(),
        file: r.file,
        image: r.image,
        result: null,
      }))

      setItems((prev) => [...prev, ...newItems])
      const currentSettings = settingsRef.current
      void compressAll(newItems, currentSettings.format, currentSettings.quality)
    },
    [compressAll]
  )

  const handleRemove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const handleAddMore = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleAddMoreFiles = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return
      const files = Array.from(e.target.files)

      void import("@/lib/upload-utils").then(async ({ validateFiles, loadImage }) => {
        const validation = validateFiles(
          files,
          items.reduce((s, i) => s + i.file.size, 0)
        )
        if (!validation.valid) {
          toast.error(uploadT(validation.error!.key, validation.error!.params))
          return
        }

        if (validation.totalSizeWarning) {
          const totalSize = validation.files.reduce((sum, f) => sum + f.size, 0)
          toast.warning(
            uploadT("totalSizeWarning", {
              size: (totalSize / 1024 / 1024).toFixed(1),
            })
          )
        }

        const loaded = await Promise.all(
          validation.files.map(async (f) => {
            const img = await loadImage(f)
            return { file: f, image: img, mimeType: f.type } as UploadResult
          })
        )
        handleImagesLoaded(loaded)
      }).catch(() => {
        toast.error(uploadT("loadFailed"))
      })

      e.target.value = ""
    },
    [items, handleImagesLoaded, uploadT]
  )

  // --- Download ---
  const handleDownload = useCallback(async () => {
    if (isSingle && items[0]?.result) {
      const { result, file } = items[0]
      const ext = formatToExtension(result.format)
      const url = URL.createObjectURL(result.blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${getBaseName(file.name)}.${ext}`
      a.click()
      URL.revokeObjectURL(url)
    } else if (isBatch) {
      if (!allReady) return
      const readyItems = items.filter((i) => i.result)
      if (readyItems.length === 0) return

      const { default: JSZip } = await import("jszip")
      const zip = new JSZip()
      for (const item of readyItems) {
        const ext = formatToExtension(item.result!.format)
        zip.file(`${getBaseName(item.file.name)}.${ext}`, item.result!.blob)
      }
      const blob = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "compressed_images.zip"
      a.click()
      URL.revokeObjectURL(url)
    }
  }, [items, isSingle, isBatch, allReady])

  // --- Object URLs for single preview ---
  const [originalUrl, setOriginalUrl] = useState<string>("")
  const [resultUrl, setResultUrl] = useState<string>("")

  useEffect(() => {
    if (isSingle) {
      const url = URL.createObjectURL(items[0].file)
      setOriginalUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setOriginalUrl("")
  }, [isSingle, items])

  useEffect(() => {
    if (isSingle && items[0]?.result) {
      const url = URL.createObjectURL(items[0].result.blob)
      setResultUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setResultUrl("")
  }, [isSingle, items])

  // --- Download label ---
  const downloadLabel = (() => {
    if (isSingle && items[0]?.result) {
      const ext = formatToExtension(items[0].result.format).toUpperCase()
      return `${t("download")} ${ext} (${formatFileSize(items[0].result.compressedSize)})`
    }
    if (isBatch) return t("downloadZip")
    return t("download")
  })()

  // --- Change image (single mode) ---
  const handleChangeImage = useCallback(() => {
    setItems([])
  }, [])

  // --- Render ---
  const hasImages = items.length > 0

  return (
    <>
      {/* Hidden file input for add-more */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onChange={handleAddMoreFiles}
      />

      {/* Nav */}
      <nav className="shrink-0 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <LogoIcon className="h-3.5 w-3.5 text-foreground" />
              <span className="text-[11px] uppercase tracking-[0.25em] font-medium">
                ImgSplit
              </span>
            </Link>
            <div className="hidden sm:flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Split</Link>
              <Link href="/grid" className="hover:text-foreground transition-colors">Grid</Link>
              <Link href="/resize" className="hover:text-foreground transition-colors">Resize</Link>
              <span className="text-foreground font-medium">Compress</span>
              <Link href="/watermark" className="hover:text-foreground transition-colors">Watermark</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasImages && (
              <button
                onClick={handleChangeImage}
                className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors cursor-pointer"
              >
                {t("changeImage")}
              </button>
            )}
            <LocaleSwitcher variant="compact" />
          </div>
        </div>
      </nav>

      {/* Content */}
      {!hasImages ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <UploadZone onImagesLoaded={handleImagesLoaded} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          {/* Main area — preview or batch list */}
          <div className="flex-1 min-h-0 min-w-0">
            {isSingle ? (
              <CompressPreview
                originalFile={items[0].file}
                originalUrl={originalUrl}
                result={items[0].result}
                resultUrl={resultUrl}
              />
            ) : (
              <CompressBatchList
                items={items}
                onRemove={handleRemove}
                onAddMore={handleAddMore}
              />
            )}
          </div>

          {/* Controls — bottom on mobile, right sidebar on desktop */}
          <div className="shrink-0 md:w-56 lg:w-64 md:border-l border-t md:border-t-0 border-border">
            <CompressControls
              format={format}
              quality={quality}
              onFormatChange={handleFormatChange}
              onQualityChange={handleQualityChange}
              downloadLabel={downloadLabel}
              onDownload={handleDownload}
              canDownload={canDownload}
              isProcessing={hasImages && !allReady}
              onAddMore={handleAddMore}
              showAddMore={isSingle}
            />
          </div>
        </div>
      )}
    </>
  )
}
