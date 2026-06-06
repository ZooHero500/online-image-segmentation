"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type {
  ChangeEvent,
  PointerEvent as ReactPointerEvent,
  ReactElement,
  WheelEvent as ReactWheelEvent,
} from "react"
import { useTranslations } from "next-intl"
import {
  BadgeCheck,
  Download,
  HardDrive,
  Loader2,
  Plus,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { toast } from "sonner"
import { Link } from "@/i18n/navigation"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { LogoIcon } from "@/components/LogoIcon"
import { UploadZone } from "@/components/UploadZone"
import { BatchRemovalList } from "@/components/background-removal/BatchRemovalList"
import { useBackgroundRemovalBatch } from "@/components/background-removal/useBackgroundRemovalBatch"
import {
  BACKGROUND_REMOVAL_ESTIMATED_MODEL_BYTES,
  BACKGROUND_REMOVAL_CACHE_VERSION,
  BACKGROUND_REMOVAL_MODEL_LABEL,
  assertBackgroundRemovalModelAvailable,
  clearBackgroundRemovalModelCache,
  exportBackgroundRemovalCanvas,
  formatModelBytes,
  getBackgroundRemovalModelFilePath,
  isBackgroundRemovalModelLikelyCached,
} from "@/lib/background-removal"
import type {
  BackgroundRemovalOutputFormat,
  BackgroundRemovalRefineOptions,
} from "@/lib/background-removal"
import {
  canvasToBatchZipItem,
  exportBackgroundRemovalBatchAsZip,
  getBackgroundRemovalOutputFileName,
  getBackgroundRemovalZipFileName,
} from "@/lib/background-removal-batch"
import type { BatchRemovalItem, BatchRemovalZipItem } from "@/lib/background-removal-batch"
import { ACCEPTED_TYPES, loadImage, validateFiles } from "@/lib/upload-utils"
import type { UploadResult } from "@/types"

type ProcessingState =
  | "idle"
  | "selected"
  | "loading-model"
  | "processing"
  | "ready"
  | "error"

const DEFAULT_REFINE_OPTIONS: BackgroundRemovalRefineOptions = {
  alphaCutoff: 0,
  edgeShift: 0,
  edgeFeather: 0,
}

function areRefineOptionsEqual(
  a: BackgroundRemovalRefineOptions,
  b: BackgroundRemovalRefineOptions
): boolean {
  return (
    a.alphaCutoff === b.alphaCutoff &&
    a.edgeShift === b.edgeShift &&
    a.edgeFeather === b.edgeFeather
  )
}

export function BackgroundRemovalEditor() {
  const t = useTranslations("removeBackground")
  const uploadT = useTranslations("upload")
  const [isModelCached, setIsModelCached] = useState(false)
  const [refineOptions, setRefineOptions] =
    useState<BackgroundRemovalRefineOptions>(DEFAULT_REFINE_OPTIONS)
  const [format, setFormat] = useState<BackgroundRemovalOutputFormat>("image/png")
  const [quality, setQuality] = useState(92)
  const [error, setError] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<{
    label: string
    url: string
  } | null>(null)
  const addMoreInputRef = useRef<HTMLInputElement>(null)
  const uploadGenerationRef = useRef(0)

  const refreshCacheState = useCallback(async () => {
    const cached = await isBackgroundRemovalModelLikelyCached()
    setIsModelCached(cached)
  }, [])

  const batch = useBackgroundRemovalBatch({
    refineOptions,
    onCacheRefresh: refreshCacheState,
  })

  const modelSize = formatModelBytes(BACKGROUND_REMOVAL_ESTIMATED_MODEL_BYTES)
  const selectedItem = batch.items[0] ?? null
  const isBatchMode = batch.items.length > 1
  const isBusy = batch.isRunning || batch.summary.isBusy
  const state: ProcessingState = !selectedItem
    ? "idle"
    : selectedItem.status === "queued" || selectedItem.status === "canceled"
      ? "selected"
      : selectedItem.status === "loading-model"
        ? "loading-model"
        : selectedItem.status === "processing"
          ? "processing"
          : selectedItem.status === "ready"
            ? "ready"
            : "error"
  const resultCanvas = selectedItem?.status === "ready" ? selectedItem.resultCanvas : null
  const hasResult = state === "ready" && Boolean(resultCanvas)
  const originalUrl = selectedItem?.sourceUrl ?? ""
  const resultUrl = selectedItem?.status === "ready" ? selectedItem.resultUrl : ""
  const device = selectedItem?.device ?? batch.activeItem?.device ?? null
  const activeStatus = batch.activeItem?.status ?? selectedItem?.status ?? "queued"
  const activeProgress = batch.activeItem?.progress ?? selectedItem?.progress ?? null
  const showQuality = format !== "image/png"

  const progressLabel = useMemo(() => {
    if (activeProgress !== null) {
      return `${Math.round(activeProgress * 100)}%`
    }
    return t("preparing")
  }, [activeProgress, t])

  const batchStatusText = useMemo(
    () => ({
      queued: batch.isRunning ? t("batchStatusQueued") : t("batchStatusNotStarted"),
      "loading-model": t("downloadingModel"),
      processing: t("processingLocally"),
      ready: t("batchStatusReady"),
      error: t("batchStatusError"),
      canceled: t("batchStatusCanceled"),
    }),
    [batch.isRunning, t]
  )

  useEffect(() => {
    let ignore = false

    void (async () => {
      try {
        const cacheKey = "imgsplit-background-removal-cache-version"
        const currentVersion = window.localStorage.getItem(cacheKey)
        if (currentVersion !== BACKGROUND_REMOVAL_CACHE_VERSION) {
          await clearBackgroundRemovalModelCache()
          window.localStorage.setItem(cacheKey, BACKGROUND_REMOVAL_CACHE_VERSION)
        }
      } catch {
        // Cache versioning is best-effort; the editor can still run without localStorage.
      }

      const cached = await isBackgroundRemovalModelLikelyCached()
      if (!ignore) setIsModelCached(cached)
    })()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!previewImage) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewImage(null)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [previewImage])

  const handleImagesLoaded = useCallback((results: UploadResult[]) => {
    if (results.length === 0) return

    batch.addItems(results)
    setError(null)
    setPreviewImage(null)
  }, [batch])

  const handleChangeImage = useCallback(() => {
    uploadGenerationRef.current += 1
    batch.clearAll()
    setError(null)
    setRefineOptions(DEFAULT_REFINE_OPTIONS)
    setPreviewImage(null)
  }, [batch])

  const handleAddMoreFiles = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files ? Array.from(event.target.files) : []
      event.target.value = ""
      if (files.length === 0) return
      const uploadGeneration = uploadGenerationRef.current

      const result = validateFiles(files)
      if (!result.valid) {
        toast.error(uploadT(result.error!.key, result.error!.params))
        return
      }

      if (result.totalSizeWarning) {
        const totalSize = result.files.reduce((sum, file) => sum + file.size, 0)
        toast.warning(
          uploadT("totalSizeWarning", {
            size: (totalSize / 1024 / 1024).toFixed(1),
          })
        )
      }

      try {
        const results: UploadResult[] = []
        for (const file of result.files) {
          const image = await loadImage(file)
          results.push({ file, image, mimeType: file.type })
        }
        if (uploadGenerationRef.current !== uploadGeneration) return
        handleImagesLoaded(results)
      } catch {
        toast.error(uploadT("loadFailed"))
      }
    },
    [handleImagesLoaded, uploadT]
  )

  const handleClearCache = useCallback(async () => {
    const deleted = await clearBackgroundRemovalModelCache()
    await refreshCacheState()
    toast.success(deleted > 0 ? t("cacheCleared") : t("cacheAlreadyEmpty"))
  }, [refreshCacheState, t])

  const ensureModelAvailable = useCallback(async () => {
    try {
      await assertBackgroundRemovalModelAvailable()
      setError(null)
      return true
    } catch {
      const configPath = getBackgroundRemovalModelFilePath("config.json")
      setError(t("localModelMissing", { path: configPath }))
      toast.error(t("localModelMissingToast"))
      return false
    }
  }, [t])

  const runQueueWithPreflight = useCallback(async () => {
    if (isBusy) return
    if (!(await ensureModelAvailable())) return

    await batch.runQueue()
    await refreshCacheState()
  }, [batch, ensureModelAvailable, isBusy, refreshCacheState])

  const handleRemoveBackground = useCallback(async () => {
    if (!selectedItem || isBusy) return
    if (selectedItem.status !== "queued") {
      batch.retryItem(selectedItem.id)
    }
    await runQueueWithPreflight()
  }, [batch, isBusy, runQueueWithPreflight, selectedItem])

  const handleRetryFailed = useCallback(async () => {
    if (isBusy || !batch.summary.hasFailures) return
    batch.retryFailed()
    await runQueueWithPreflight()
  }, [batch, isBusy, runQueueWithPreflight])

  const handleDownload = useCallback(async () => {
    if (!selectedItem || !resultCanvas) return

    try {
      const blob = await exportBackgroundRemovalCanvas(
        resultCanvas,
        format,
        quality / 100
      )
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = getBackgroundRemovalOutputFileName(selectedItem.file.name, format)
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error(t("exportFailed"))
    }
  }, [format, quality, resultCanvas, selectedItem, t])

  const handleDownloadBatchZip = useCallback(async () => {
    const readyItems = batch.items.filter(
      (candidate) => candidate.status === "ready" && candidate.resultCanvas
    )
    if (readyItems.length === 0) return

    try {
      const zipItems = (
        await Promise.all(
          readyItems.map((readyItem) =>
            canvasToBatchZipItem(
              readyItem,
              format,
              showQuality ? quality / 100 : undefined
            )
          )
        )
      ).filter((zipItem): zipItem is BatchRemovalZipItem => zipItem !== null)

      if (zipItems.length === 0) return

      const blob = await exportBackgroundRemovalBatchAsZip(zipItems)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = getBackgroundRemovalZipFileName()
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error(t("exportFailed"))
    }
  }, [batch.items, format, quality, showQuality, t])

  const handleRemoveBatchItem = useCallback(
    (id: string) => {
      batch.removeItem(id)
      setPreviewImage(null)
    },
    [batch]
  )

  const handlePreviewBatchItem = useCallback((readyItem: BatchRemovalItem) => {
    if (readyItem.status !== "ready" || !readyItem.resultUrl) return
    setPreviewImage({ label: readyItem.file.name, url: readyItem.resultUrl })
  }, [])

  const handleRetryBatchItem = useCallback(
    async (id: string) => {
      if (isBusy) return
      batch.retryItem(id)
      await runQueueWithPreflight()
    },
    [batch, isBusy, runQueueWithPreflight]
  )

  const updateRefineOption = useCallback(
    (key: keyof BackgroundRemovalRefineOptions, value: number) => {
      setRefineOptions((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const handleResetRefine = useCallback(() => {
    setRefineOptions(DEFAULT_REFINE_OPTIONS)
  }, [])

  const hasPendingRefineChanges =
    hasResult &&
    selectedItem?.appliedRefineOptions !== null &&
    selectedItem?.appliedRefineOptions !== undefined &&
    !areRefineOptionsEqual(refineOptions, selectedItem.appliedRefineOptions)
  const removeButtonLabel = hasResult
    ? t("rerunRemoval")
    : state === "loading-model"
      ? t("downloadingModel")
      : state === "processing"
        ? t("processingLocally")
        : isModelCached
          ? t("runCached")
          : t("downloadAndRun")

  return (
    <>
      <nav className="shrink-0 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-12 max-w-[1600px] items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <LogoIcon className="h-3.5 w-3.5 text-foreground" />
              <span className="text-[11px] font-medium uppercase tracking-[0.25em]">
                ImgSplit
              </span>
            </Link>
            <div className="hidden items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:flex">
              <Link href="/" className="transition-colors hover:text-foreground">{t("navSplit")}</Link>
              <Link href="/grid" className="transition-colors hover:text-foreground">{t("navGrid")}</Link>
              <Link href="/resize" className="transition-colors hover:text-foreground">{t("navResize")}</Link>
              <Link href="/compress" className="transition-colors hover:text-foreground">{t("navCompress")}</Link>
              <Link href="/watermark" className="transition-colors hover:text-foreground">{t("navWatermark")}</Link>
              <Link href="/mosaic" className="transition-colors hover:text-foreground">{t("navMosaic")}</Link>
              <Link href="/collage" className="transition-colors hover:text-foreground">{t("navCollage")}</Link>
              <Link href="/social-export" className="transition-colors hover:text-foreground">{t("navSocialExport")}</Link>
              <span className="font-medium text-foreground">{t("shortNav")}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedItem && (
              <button
                onClick={handleChangeImage}
                className="cursor-pointer text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
              >
                {t("changeImage")}
              </button>
            )}
            <LocaleSwitcher variant="compact" />
          </div>
        </div>
      </nav>

      {!selectedItem ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl">
            <UploadZone
              multiple
              onImagesLoaded={handleImagesLoaded}
              title={t("uploadTitle")}
              dragHint={t("uploadDragHint")}
              clickHint={t("uploadClickHint")}
              formatHint={t("uploadFormatHint")}
            />
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <div className="min-h-0 min-w-0 flex-1 overflow-auto bg-secondary/30 p-3 sm:p-4 md:p-6">
            {isBatchMode ? (
              <div className="mx-auto flex h-full max-w-6xl flex-col gap-4">
                <div className="border border-border bg-background p-4 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                        {t("batchQueue")}
                      </p>
                      <h1 className="mt-2 font-serif text-2xl text-foreground">
                        {t("batchReadyCount", {
                          ready: batch.summary.ready,
                          total: batch.summary.total,
                        })}
                      </h1>
                    </div>
                    <div className="flex flex-wrap items-start justify-end gap-4">
                      <div className="grid grid-cols-4 gap-3 text-right text-xs text-muted-foreground">
                        <SummaryCount
                          label={batch.isRunning ? t("batchQueued") : t("batchStatusNotStarted")}
                          value={batch.summary.queued}
                        />
                        <SummaryCount label={t("batchActive")} value={batch.summary.active} />
                        <SummaryCount label={t("batchFailed")} value={batch.summary.failed} />
                        <SummaryCount label={t("batchDone")} value={batch.summary.completed} />
                      </div>
                      <button
                        type="button"
                        onClick={() => addMoreInputRef.current?.click()}
                        disabled={isBusy}
                        className="flex shrink-0 cursor-pointer items-center gap-1.5 border border-border px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-foreground disabled:cursor-default disabled:opacity-40"
                      >
                        <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                        {t("batchAddMore")}
                      </button>
                    </div>
                  </div>
                  <div
                    className="mt-4 h-1.5 overflow-hidden bg-secondary"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={batch.summary.percent}
                  >
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${batch.summary.percent}%` }}
                    />
                  </div>
                </div>
                <BatchRemovalList
                  items={batch.items}
                  statusText={batchStatusText}
                  retryLabel={t("batchRetryItem")}
                  removeLabel={t("batchRemoveItem")}
                  previewLabel={t("previewImage")}
                  onRetry={handleRetryBatchItem}
                  onRemove={handleRemoveBatchItem}
                  onPreview={handlePreviewBatchItem}
                />
              </div>
            ) : (
              <div className="mx-auto grid h-full max-w-6xl grid-cols-2 content-center gap-2 sm:gap-4">
                <PreviewPanel
                  label={t("original")}
                  imageUrl={originalUrl}
                  previewLabel={t("previewImage")}
                  onPreview={() => setPreviewImage({ label: t("original"), url: originalUrl })}
                />
                <PreviewPanel
                  label={hasResult ? t("result") : t("resultPending")}
                  imageUrl={resultUrl}
                  emptyText={state === "processing" ? t("processing") : t("resultEmpty")}
                  previewLabel={t("previewImage")}
                  onPreview={() => setPreviewImage({ label: t("result"), url: resultUrl })}
                />
              </div>
            )}
          </div>

          <aside className="flex max-h-[48vh] min-h-0 shrink-0 flex-col overflow-y-auto border-t border-border bg-background p-4 lg:max-h-none lg:w-96 lg:border-l lg:border-t-0">
            <input
              ref={addMoreInputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              multiple
              className="hidden"
              onChange={handleAddMoreFiles}
            />
            <section className="border-b border-border pb-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {t("modelTitle")}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl text-foreground">
                    {t("modelHeading")}
                  </h2>
                </div>
                <Sparkles className="mt-1 h-5 w-5 text-accent" strokeWidth={1.5} />
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {t("modelDescription", {
                  model: BACKGROUND_REMOVAL_MODEL_LABEL,
                  size: modelSize,
                })}
              </p>
              <div className="mt-4 space-y-2 text-xs leading-5 text-muted-foreground">
                <StatusLine icon={<BadgeCheck />} text={t("privacyPoint")} />
                <StatusLine icon={<HardDrive />} text={isModelCached ? t("cacheHit") : t("cacheMiss")} />
              </div>
              <button
                onClick={handleClearCache}
                disabled={isBusy}
                className="mt-4 flex cursor-pointer items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-default disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                {t("clearCache")}
              </button>
            </section>

            {isBusy && (
              <section className="border-b border-border py-5" aria-live="polite">
                <div className="border border-border bg-secondary/45 p-4">
                  <div className="flex items-start gap-3">
                    <Loader2
                      className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-accent"
                      strokeWidth={1.5}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        <span>{activeStatus === "loading-model" ? t("downloadingModel") : t("processingLocally")}</span>
                        <span>{activeStatus === "loading-model" ? progressLabel : device?.toUpperCase()}</span>
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden bg-background">
                        <div
                          className={`h-full bg-accent transition-all duration-300 ${activeStatus === "processing" ? "animate-pulse" : ""}`}
                          style={{
                            width:
                              activeStatus === "processing"
                                ? "100%"
                                : `${Math.max(6, Math.round((activeProgress ?? 0.06) * 100))}%`,
                          }}
                        />
                      </div>
                      <p className="mt-3 text-xs leading-5 text-muted-foreground">
                        {activeStatus === "loading-model" ? t("downloadHint") : t("processingHint")}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {(error || state === "error") && (
              <section className="border-b border-border py-5">
                <p className="text-sm text-destructive">
                  {error ?? selectedItem?.error ?? t("processFailed")}
                </p>
                <button
                  onClick={handleRemoveBackground}
                  className="mt-4 flex cursor-pointer items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent"
                >
                  <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {t("retry")}
                </button>
              </section>
            )}

            {!isBatchMode && (
              <section className="border-b border-border py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      {t("batchEntryTitle")}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {t("batchEntryHint")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addMoreInputRef.current?.click()}
                    disabled={isBusy}
                    className="flex shrink-0 cursor-pointer items-center gap-1.5 border border-border px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-foreground disabled:cursor-default disabled:opacity-40"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {t("batchAddMore")}
                  </button>
                </div>
              </section>
            )}

            <section className="border-b border-border py-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {t("refineTitle")}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {isBatchMode
                      ? t("refineBatchHint")
                      : hasResult
                        ? t("refineLiveHint")
                        : t("refineBeforeHint")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetRefine}
                  disabled={isBusy}
                  className="flex shrink-0 cursor-pointer items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-default disabled:opacity-40"
                >
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {t("resetRefine")}
                </button>
              </div>
              <div className={`space-y-4 transition-opacity ${isBusy ? "opacity-50" : ""}`}>
                <RefineSlider
                  label={t("alphaCutoff")}
                  description={t("alphaCutoffHelp")}
                  value={refineOptions.alphaCutoff}
                  min={0}
                  max={95}
                  valueLabel={`${refineOptions.alphaCutoff}%`}
                  disabled={isBusy}
                  onChange={(value) => updateRefineOption("alphaCutoff", value)}
                />
                <RefineSlider
                  label={t("edgeShift")}
                  description={t("edgeShiftHelp")}
                  value={refineOptions.edgeShift}
                  min={-32}
                  max={32}
                  valueLabel={`${refineOptions.edgeShift}px`}
                  disabled={isBusy}
                  onChange={(value) => updateRefineOption("edgeShift", value)}
                />
                <RefineSlider
                  label={t("edgeFeather")}
                  description={t("edgeFeatherHelp")}
                  value={refineOptions.edgeFeather}
                  min={0}
                  max={32}
                  valueLabel={`${refineOptions.edgeFeather}px`}
                  disabled={isBusy}
                  onChange={(value) => updateRefineOption("edgeFeather", value)}
                />
              </div>
            </section>

            {isBatchMode ? (
              <section className="border-b border-border py-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      {t("batchActions")}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {t("batchZipHint")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addMoreInputRef.current?.click()}
                    disabled={isBusy}
                    className="shrink-0 cursor-pointer text-[10px] uppercase tracking-[0.18em] text-accent transition-opacity disabled:cursor-default disabled:opacity-40"
                  >
                    {t("batchAddMore")}
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={runQueueWithPreflight}
                    disabled={isBusy || batch.summary.queued === 0}
                    className="flex cursor-pointer items-center justify-center gap-2 bg-foreground px-3 py-3 text-[11px] uppercase tracking-[0.16em] text-background transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-50"
                  >
                    {isBusy ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
                    )}
                    {t("batchStart")}
                  </button>
                  <button
                    type="button"
                    onClick={batch.cancelQueue}
                    disabled={!isBusy}
                    className="flex cursor-pointer items-center justify-center gap-2 border border-border px-3 py-3 text-[11px] uppercase tracking-[0.16em] text-foreground transition-opacity hover:opacity-80 disabled:cursor-default disabled:opacity-40"
                  >
                    {t("batchCancel")}
                  </button>
                  <button
                    type="button"
                    onClick={handleRetryFailed}
                    disabled={isBusy || !batch.summary.hasFailures}
                    className="flex cursor-pointer items-center justify-center gap-2 border border-border px-3 py-3 text-[11px] uppercase tracking-[0.16em] text-foreground transition-opacity hover:opacity-80 disabled:cursor-default disabled:opacity-40"
                  >
                    <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {t("batchRetryFailed")}
                  </button>
                  <button
                    type="button"
                    onClick={handleChangeImage}
                    className="flex cursor-pointer items-center justify-center gap-2 border border-border px-3 py-3 text-[11px] uppercase tracking-[0.16em] text-foreground transition-opacity hover:opacity-80"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {t("batchClear")}
                  </button>
                </div>
              </section>
            ) : (
              <section className="border-b border-border py-5">
                <button
                  onClick={handleRemoveBackground}
                  disabled={isBusy}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 bg-foreground px-4 py-3 text-xs uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-50"
                >
                  {isBusy ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
                  )}
                  {removeButtonLabel}
                </button>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  {hasPendingRefineChanges
                    ? t("pendingCleanupHint")
                    : hasResult
                      ? t("rerunHint")
                      : t("runHint")}
                </p>
              </section>
            )}

            <section className="space-y-5 py-5">
              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {t("format")}
                </label>
                <select
                  value={format}
                  disabled={isBusy}
                  onChange={(event) =>
                    setFormat(event.target.value as BackgroundRemovalOutputFormat)
                  }
                  className="mt-2 h-10 w-full border border-border bg-background px-3 text-sm text-foreground disabled:cursor-default disabled:opacity-50"
                >
                  <option value="image/png">{t("pngTransparent")}</option>
                  <option value="image/webp">{t("webpTransparent")}</option>
                  <option value="image/jpeg">{t("jpgWhite")}</option>
                </select>
              </div>

              {showQuality && (
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      {t("quality")}
                    </label>
                    <span className="text-xs text-muted-foreground">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={quality}
                    disabled={isBusy}
                    onChange={(event) => setQuality(Number(event.target.value))}
                    className="mt-3 w-full accent-foreground disabled:cursor-default disabled:opacity-50"
                  />
                </div>
              )}

              <button
                onClick={isBatchMode ? handleDownloadBatchZip : handleDownload}
                disabled={
                  isBatchMode
                    ? !batch.summary.canDownloadReady || isBusy
                    : !hasResult || isBusy
                }
                className="flex w-full cursor-pointer items-center justify-center gap-2 bg-foreground px-4 py-3 text-xs uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
                {isBatchMode ? t("batchDownloadZip") : t("download")}
              </button>
              <p className="text-xs leading-5 text-muted-foreground">
                {isBatchMode
                  ? t("batchDownloadHint", { count: batch.summary.ready })
                  : hasResult
                    ? t("downloadCurrentHint")
                    : t("downloadPendingHint")}
              </p>
            </section>
          </aside>
        </div>
      )}

      {previewImage && (
        <ImagePreviewOverlay
          label={previewImage.label}
          imageUrl={previewImage.url}
          closeLabel={t("closePreview")}
          resetLabel={t("resetZoom")}
          zoomInLabel={t("zoomIn")}
          zoomOutLabel={t("zoomOut")}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </>
  )
}

function PreviewPanel({
  label,
  imageUrl,
  emptyText,
  previewLabel,
  onPreview,
}: {
  label: string
  imageUrl: string
  emptyText?: string
  previewLabel: string
  onPreview?: () => void
}) {
  return (
    <div className="flex min-h-[190px] min-w-0 flex-col border border-border bg-background p-2 shadow-sm sm:min-h-[260px] sm:p-3 md:min-h-[420px]">
      <p className="mb-2 truncate text-[9px] uppercase tracking-[0.18em] text-muted-foreground sm:mb-3 sm:text-[10px] sm:tracking-[0.22em]">
        {label}
      </p>
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[linear-gradient(45deg,#e7e5df_25%,transparent_25%),linear-gradient(-45deg,#e7e5df_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e7e5df_75%),linear-gradient(-45deg,transparent_75%,#e7e5df_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0]">
        {imageUrl ? (
          <button
            type="button"
            onClick={onPreview}
            className="group flex h-full w-full cursor-zoom-in items-center justify-center"
            aria-label={`${previewLabel}: ${label}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={label}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.015]"
            />
            <span className="pointer-events-none absolute right-2 top-2 flex h-8 w-8 items-center justify-center border border-border bg-background/85 text-muted-foreground opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              <ZoomIn className="h-4 w-4" strokeWidth={1.5} />
            </span>
          </button>
        ) : (
          <p className="max-w-40 px-3 text-center text-xs leading-5 text-muted-foreground sm:max-w-56 sm:px-6 sm:text-sm sm:leading-6">
            {emptyText}
          </p>
        )}
      </div>
    </div>
  )
}

function SummaryCount({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-serif text-xl text-foreground">{value}</p>
      <p className="mt-1 text-[9px] uppercase tracking-[0.18em]">{label}</p>
    </div>
  )
}

function RefineSlider({
  label,
  description,
  value,
  min,
  max,
  valueLabel,
  disabled = false,
  onChange,
}: {
  label: string
  description: string
  value: number
  min: number
  max: number
  valueLabel: string
  disabled?: boolean
  onChange: (value: number) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </label>
        <span className="shrink-0 text-xs text-muted-foreground">
          {valueLabel}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-foreground disabled:cursor-default disabled:opacity-50"
      />
      <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function ImagePreviewOverlay({
  label,
  imageUrl,
  closeLabel,
  resetLabel,
  zoomInLabel,
  zoomOutLabel,
  onClose,
}: {
  label: string
  imageUrl: string
  closeLabel: string
  resetLabel: string
  zoomInLabel: string
  zoomOutLabel: string
  onClose: () => void
}) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    offsetX: number
    offsetY: number
  } | null>(null)

  const setClampedScale = useCallback((nextScale: number) => {
    setScale(Math.max(1, Math.min(4, Number(nextScale.toFixed(2)))))
  }, [])

  const resetView = useCallback(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }, [])

  const zoomBy = useCallback(
    (delta: number) => {
      setClampedScale(scale + delta)
      if (scale + delta <= 1) setOffset({ x: 0, y: 0 })
    },
    [scale, setClampedScale]
  )

  const handleWheel = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      event.preventDefault()
      zoomBy(event.deltaY > 0 ? -0.2 : 0.2)
    },
    [zoomBy]
  )

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLImageElement>) => {
      event.stopPropagation()
      if (scale <= 1) return

      event.currentTarget.setPointerCapture(event.pointerId)
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        offsetX: offset.x,
        offsetY: offset.y,
      }
    },
    [offset.x, offset.y, scale]
  )

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLImageElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    setOffset({
      x: drag.offsetX + event.clientX - drag.startX,
      y: drag.offsetY + event.clientY - drag.startY,
    })
  }, [])

  const handlePointerUp = useCallback((event: ReactPointerEvent<HTMLImageElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    dragRef.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center overflow-hidden bg-foreground/90 p-4 backdrop-blur-sm"
      onClick={onClose}
      onWheel={handleWheel}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center border border-background/25 text-background/70 transition-colors hover:text-background sm:right-6 sm:top-6"
        aria-label={closeLabel}
      >
        <X className="h-5 w-5" strokeWidth={1.5} />
      </button>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={label}
        className="max-h-[calc(100vh-7rem)] max-w-[calc(100vw-2rem)] touch-none select-none object-contain shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-transform duration-100"
        style={{
          cursor: scale > 1 ? "grab" : "zoom-in",
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
        }}
        onClick={(event) => event.stopPropagation()}
        onDoubleClick={(event) => {
          event.stopPropagation()
          if (scale > 1) resetView()
          else setClampedScale(2)
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      <div
        className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 border border-background/20 bg-foreground/70 p-1 text-background/70 shadow-[0_12px_40px_rgba(0,0,0,0.24)] backdrop-blur-md sm:bottom-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => zoomBy(-0.25)}
          className="flex h-9 w-9 cursor-pointer items-center justify-center transition-colors hover:text-background disabled:cursor-default disabled:opacity-35"
          disabled={scale <= 1}
          aria-label={zoomOutLabel}
        >
          <ZoomOut className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={resetView}
          className="flex h-9 min-w-16 cursor-pointer items-center justify-center gap-1.5 px-2 text-[10px] uppercase tracking-[0.16em] transition-colors hover:text-background"
          aria-label={resetLabel}
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
          {Math.round(scale * 100)}%
        </button>
        <button
          type="button"
          onClick={() => zoomBy(0.25)}
          className="flex h-9 w-9 cursor-pointer items-center justify-center transition-colors hover:text-background disabled:cursor-default disabled:opacity-35"
          disabled={scale >= 4}
          aria-label={zoomInLabel}
        >
          <ZoomIn className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

function StatusLine({
  icon,
  text,
}: {
  icon: ReactElement<{ className?: string; strokeWidth?: number }>
  text: string
}) {
  return (
    <p className="flex items-start gap-2">
      {icon &&
        <span className="mt-0.5 text-accent">
          {icon}
        </span>
      }
      <span>{text}</span>
    </p>
  )
}
