"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"
import {
  CheckCircle2,
  Download,
  Layers2,
  Maximize2,
  RefreshCcw,
  SlidersHorizontal,
  Upload,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { LogoIcon } from "@/components/LogoIcon"
import { UploadZone } from "@/components/UploadZone"
import { Link } from "@/i18n/navigation"
import {
  clampSocialExportScale,
  createSocialExportCropStateMap,
  exportSocialPresetsAsZip,
  getSocialExportOutputExtension,
  getSocialExportZipFileName,
  renderSocialExportToCanvas,
  resetSocialExportCropForFitMode,
  type SocialExportCropStateMap,
  type SocialExportFitMode,
  type SocialExportOutputFormat,
} from "@/lib/social-export"
import {
  SOCIAL_EXPORT_DEFAULT_PRESET_IDS,
  SOCIAL_EXPORT_PLATFORMS,
  SOCIAL_EXPORT_PRESET_PACKS,
  SOCIAL_EXPORT_PRESETS,
  getSocialExportDefaultPresetIds,
  type SocialExportPlatform,
  type SocialExportPreset,
  type SocialExportPresetPackId,
  type SocialExportPresetId,
} from "@/lib/social-export-presets"
import type { UploadResult } from "@/types"

const OUTPUT_FORMATS: Array<{ label: string; value: SocialExportOutputFormat }> = [
  { label: "PNG", value: "image/png" },
  { label: "JPEG", value: "image/jpeg" },
  { label: "WebP", value: "image/webp" },
]

const PLATFORM_LABEL_KEYS: Record<SocialExportPlatform, string> = {
  instagram: "platformInstagram",
  facebook: "platformFacebook",
  youtube: "platformYoutube",
  x: "platformX",
  linkedin: "platformLinkedin",
  tiktok: "platformTiktok",
  xiaohongshu: "platformXiaohongshu",
  wechat: "platformWechat",
}

const PRESET_PACKS: SocialExportPresetPackId[] = ["western", "china", "all"]

const PRESET_PACK_LABEL_KEYS: Record<SocialExportPresetPackId, string> = {
  western: "packWestern",
  china: "packChina",
  all: "packAll",
}

interface UploadedSocialImage {
  file: File
  image: HTMLImageElement
}

interface CanvasPoint {
  x: number
  y: number
}

interface DragState {
  start: CanvasPoint
  offsetX: number
  offsetY: number
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

function SectionTitle({
  icon,
  children,
}: {
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <p className="mb-3 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
      {icon}
      {children}
    </p>
  )
}

function RangeField({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  suffix?: string
  onChange: (value: number) => void
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono text-[11px] text-foreground">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-foreground"
      />
    </label>
  )
}

function PresetCard({
  preset,
  label,
  description,
  selected,
  enabled,
  onSelect,
  onToggle,
}: {
  preset: SocialExportPreset
  label: string
  description: string
  selected: boolean
  enabled: boolean
  onSelect: () => void
  onToggle: () => void
}) {
  return (
    <div
      className={`rounded border transition-colors ${
        selected
          ? "border-accent bg-accent/5"
          : "border-border bg-background hover:bg-muted/50"
      }`}
    >
      <div className="flex items-start gap-3 p-3">
        <Checkbox checked={enabled} onCheckedChange={onToggle} className="mt-0.5" />
        <button
          type="button"
          onClick={onSelect}
          className="min-w-0 flex-1 cursor-pointer text-left"
        >
          <span className="block truncate text-xs font-medium uppercase tracking-[0.16em] text-foreground">
            {label}
          </span>
          <span className="mt-1 block font-mono text-[11px] text-muted-foreground">
            {preset.width} x {preset.height}
          </span>
          <span className="mt-1 hidden text-[11px] leading-snug text-muted-foreground lg:block">
            {description}
          </span>
        </button>
      </div>
    </div>
  )
}

export function SocialExportEditor() {
  const t = useTranslations("socialExport")
  const locale = useLocale()
  const localeDefaultPresetIds = useMemo(
    () => getSocialExportDefaultPresetIds(locale),
    [locale]
  )
  const [uploaded, setUploaded] = useState<UploadedSocialImage | null>(null)
  const [selectedPresetIds, setSelectedPresetIds] = useState<
    SocialExportPresetId[]
  >([...localeDefaultPresetIds])
  const [selectedPresetId, setSelectedPresetId] =
    useState<SocialExportPresetId>(
      localeDefaultPresetIds[0] ?? SOCIAL_EXPORT_DEFAULT_PRESET_IDS[0]
    )
  const [cropStates, setCropStates] = useState<SocialExportCropStateMap>(() =>
    createSocialExportCropStateMap()
  )
  const [outputFormat, setOutputFormat] =
    useState<SocialExportOutputFormat>("image/png")
  const [quality, setQuality] = useState(92)
  const [isRendering, setIsRendering] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [previewAreaSize, setPreviewAreaSize] = useState({ width: 0, height: 0 })
  const mainCanvasRef = useRef<HTMLCanvasElement>(null)
  const previewAreaRef = useRef<HTMLDivElement>(null)
  const previewCanvasRefs = useRef(new Map<SocialExportPresetId, HTMLCanvasElement>())
  const dragRef = useRef<DragState | null>(null)

  const selectedPresets = useMemo(
    () =>
      SOCIAL_EXPORT_PRESETS.filter((preset) =>
        selectedPresetIds.includes(preset.id)
      ),
    [selectedPresetIds]
  )
  const selectedPreset = useMemo(
    () =>
      SOCIAL_EXPORT_PRESETS.find((preset) => preset.id === selectedPresetId) ??
      selectedPresets[0] ??
      SOCIAL_EXPORT_PRESETS[0],
    [selectedPresetId, selectedPresets]
  )
  const selectedCrop = cropStates[selectedPreset.id]
  const hasImage = uploaded != null
  const canExport = hasImage && selectedPresets.length > 0

  const previewDisplaySize = useMemo(() => {
    if (previewAreaSize.width <= 0 || previewAreaSize.height <= 0) return null
    const chrome = 36
    const availableWidth = Math.max(1, previewAreaSize.width - chrome)
    const availableHeight = Math.max(1, previewAreaSize.height - chrome)
    const scale = Math.min(
      1,
      availableWidth / selectedPreset.width,
      availableHeight / selectedPreset.height
    )

    return {
      width: Math.floor(selectedPreset.width * scale),
      height: Math.floor(selectedPreset.height * scale),
    }
  }, [
    previewAreaSize.height,
    previewAreaSize.width,
    selectedPreset.height,
    selectedPreset.width,
  ])

  useEffect(() => {
    if (selectedPresetIds.includes(selectedPresetId)) return
    setSelectedPresetId(selectedPresetIds[0] ?? SOCIAL_EXPORT_PRESETS[0].id)
  }, [selectedPresetId, selectedPresetIds])

  useEffect(() => {
    const previewArea = previewAreaRef.current
    if (!previewArea) return

    const updatePreviewAreaSize = () => {
      const rect = previewArea.getBoundingClientRect()
      const style = window.getComputedStyle(previewArea)
      const horizontalPadding =
        Number.parseFloat(style.paddingLeft) + Number.parseFloat(style.paddingRight)
      const verticalPadding =
        Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom)

      setPreviewAreaSize({
        width: Math.max(0, rect.width - horizontalPadding),
        height: Math.max(0, rect.height - verticalPadding),
      })
    }

    const observer = new ResizeObserver(updatePreviewAreaSize)
    observer.observe(previewArea)
    const frame = requestAnimationFrame(updatePreviewAreaSize)
    window.addEventListener("resize", updatePreviewAreaSize)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("resize", updatePreviewAreaSize)
    }
  }, [hasImage])

  useEffect(() => {
    if (!uploaded || !mainCanvasRef.current) return

    try {
      setIsRendering(true)
      renderSocialExportToCanvas(
        mainCanvasRef.current,
        uploaded.image,
        selectedPreset,
        selectedCrop
      )
    } catch {
      toast.error(t("previewFailed"))
    } finally {
      setIsRendering(false)
    }
  }, [selectedCrop, selectedPreset, t, uploaded])

  useEffect(() => {
    if (!uploaded) return

    for (const preset of selectedPresets) {
      const canvas = previewCanvasRefs.current.get(preset.id)
      if (!canvas) continue
      try {
        renderSocialExportToCanvas(
          canvas,
          uploaded.image,
          preset,
          cropStates[preset.id]
        )
      } catch {
        // Main preview reports render errors; thumbnails can silently wait.
      }
    }
  }, [cropStates, selectedPresets, uploaded])

  const handleImagesLoaded = useCallback((results: UploadResult[]) => {
    const [first] = results
    if (!first) return

    setUploaded({ file: first.file, image: first.image })
    setCropStates(createSocialExportCropStateMap())
    setSelectedPresetId(localeDefaultPresetIds[0] ?? SOCIAL_EXPORT_DEFAULT_PRESET_IDS[0])
    if (results.length > 1) {
      toast.info(t("singleImageOnly"))
    }
  }, [localeDefaultPresetIds, t])

  const replaceImage = useCallback(() => {
    setUploaded(null)
    setCropStates(createSocialExportCropStateMap())
  }, [])

  const togglePreset = useCallback(
    (presetId: SocialExportPresetId) => {
      setSelectedPresetIds((prev) => {
        const exists = prev.includes(presetId)
        if (exists && prev.length === 1) {
          toast.warning(t("keepOnePreset"))
          return prev
        }

        if (exists) return prev.filter((id) => id !== presetId)
        return [...prev, presetId]
      })
    },
    [t]
  )

  const selectAllPresets = useCallback(() => {
    setSelectedPresetIds(SOCIAL_EXPORT_PRESETS.map((preset) => preset.id))
  }, [])

  const selectDefaultPresets = useCallback(() => {
    setSelectedPresetIds([...localeDefaultPresetIds])
    setSelectedPresetId(localeDefaultPresetIds[0] ?? SOCIAL_EXPORT_DEFAULT_PRESET_IDS[0])
  }, [localeDefaultPresetIds])

  const selectPresetPack = useCallback((packId: SocialExportPresetPackId) => {
    const presetIds = SOCIAL_EXPORT_PRESET_PACKS[packId]
    setSelectedPresetIds([...presetIds])
    setSelectedPresetId(presetIds[0] ?? SOCIAL_EXPORT_DEFAULT_PRESET_IDS[0])
  }, [])

  const updateSelectedCrop = useCallback(
    (patch: Partial<(typeof cropStates)[SocialExportPresetId]>) => {
      setCropStates((prev) => ({
        ...prev,
        [selectedPreset.id]: {
          ...prev[selectedPreset.id],
          ...patch,
        },
      }))
    },
    [selectedPreset.id]
  )

  const setFitMode = useCallback(
    (fitMode: SocialExportFitMode) => {
      setCropStates((prev) => ({
        ...prev,
        [selectedPreset.id]: resetSocialExportCropForFitMode(
          prev[selectedPreset.id],
          fitMode
        ),
      }))
    },
    [selectedPreset.id]
  )

  const resetSelectedCrop = useCallback(() => {
    setCropStates((prev) => ({
      ...prev,
      [selectedPreset.id]: resetSocialExportCropForFitMode(
        prev[selectedPreset.id],
        prev[selectedPreset.id].fitMode
      ),
    }))
  }, [selectedPreset.id])

  const getCanvasPoint = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>): CanvasPoint => {
      const canvas = mainCanvasRef.current
      if (!canvas) return { x: 0, y: 0 }
      const rect = canvas.getBoundingClientRect()
      return {
        x: ((event.clientX - rect.left) / rect.width) * selectedPreset.width,
        y: ((event.clientY - rect.top) / rect.height) * selectedPreset.height,
      }
    },
    [selectedPreset.height, selectedPreset.width]
  )

  const handleCanvasPointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!uploaded) return
      event.currentTarget.setPointerCapture(event.pointerId)
      dragRef.current = {
        start: getCanvasPoint(event),
        offsetX: selectedCrop.offsetX,
        offsetY: selectedCrop.offsetY,
      }
    },
    [getCanvasPoint, selectedCrop.offsetX, selectedCrop.offsetY, uploaded]
  )

  const handleCanvasPointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const drag = dragRef.current
      if (!drag) return

      const point = getCanvasPoint(event)
      updateSelectedCrop({
        offsetX: drag.offsetX + point.x - drag.start.x,
        offsetY: drag.offsetY + point.y - drag.start.y,
      })
    },
    [getCanvasPoint, updateSelectedCrop]
  )

  const handleCanvasPointerUp = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      dragRef.current = null
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    },
    []
  )

  const handleExport = useCallback(async () => {
    if (!uploaded || selectedPresets.length === 0) return

    setIsExporting(true)
    try {
      const blob = await exportSocialPresetsAsZip({
        image: uploaded.image,
        originalFileName: uploaded.file.name,
        presets: selectedPresets,
        cropStates,
        format: outputFormat,
        quality: quality / 100,
      })
      downloadBlob(blob, getSocialExportZipFileName(uploaded.file.name))
      toast.success(t("downloadReady", { count: selectedPresets.length }))
    } catch {
      toast.error(t("exportFailed"))
    } finally {
      setIsExporting(false)
    }
  }, [cropStates, outputFormat, quality, selectedPresets, t, uploaded])

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
            <div className="hidden items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:flex">
              <Link href="/" className="transition-colors hover:text-foreground">
                Split
              </Link>
              <Link href="/grid" className="transition-colors hover:text-foreground">
                Grid
              </Link>
              <Link href="/resize" className="transition-colors hover:text-foreground">
                Resize
              </Link>
              <Link href="/compress" className="transition-colors hover:text-foreground">
                Compress
              </Link>
              <Link href="/watermark" className="transition-colors hover:text-foreground">
                Watermark
              </Link>
              <Link href="/mosaic" className="transition-colors hover:text-foreground">
                Mosaic
              </Link>
              <Link href="/collage" className="transition-colors hover:text-foreground">
                Collage
              </Link>
              <Link href="/remove-background" className="transition-colors hover:text-foreground">
                Remove BG
              </Link>
              <span className="font-medium text-foreground">Social Export</span>
              <Link href="/tools" className="transition-colors hover:text-foreground">
                Tools
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasImage && (
              <button
                type="button"
                onClick={replaceImage}
                className="flex cursor-pointer items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
              >
                <Upload className="h-3.5 w-3.5" />
                {t("replaceImage")}
              </button>
            )}
            <LocaleSwitcher variant="compact" />
          </div>
        </div>
      </nav>

      {!hasImage ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl space-y-6 px-4">
            <div className="text-center">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {t("uploadTitle")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("uploadDescription")}
              </p>
            </div>
            <UploadZone
              multiple={false}
              onImagesLoaded={handleImagesLoaded}
              dragHint={t("uploadDragHint")}
              clickHint={t("uploadClickHint")}
            />
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
          <aside className="max-h-64 min-h-0 shrink-0 space-y-5 overflow-y-auto overscroll-contain border-b border-border bg-background p-4 pb-8 lg:max-h-none lg:w-80 lg:border-b-0 lg:border-r">
              <section>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <SectionTitle icon={<Layers2 className="h-3.5 w-3.5" />}>
                    {t("presets")}
                  </SectionTitle>
                  <div className="flex shrink-0 items-center gap-3 text-[10px] uppercase tracking-[0.18em]">
                    <button
                      type="button"
                      onClick={selectDefaultPresets}
                      className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {t("defaults")}
                    </button>
                    <button
                      type="button"
                      onClick={selectAllPresets}
                      className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {t("all")}
                    </button>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-3 gap-1">
                  {PRESET_PACKS.map((packId) => (
                    <button
                      key={packId}
                      type="button"
                      onClick={() => selectPresetPack(packId)}
                      className="min-h-9 cursor-pointer border border-border px-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {t(PRESET_PACK_LABEL_KEYS[packId])}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {SOCIAL_EXPORT_PLATFORMS.map((platform) => {
                    const platformPresets = SOCIAL_EXPORT_PRESETS.filter(
                      (preset) => preset.platform === platform
                    )
                    return (
                      <div key={platform}>
                        <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                          {t(PLATFORM_LABEL_KEYS[platform])}
                        </p>
                        <div className="space-y-2">
                          {platformPresets.map((preset) => (
                            <PresetCard
                              key={preset.id}
                              preset={preset}
                              label={t(preset.labelKey)}
                              description={t(preset.descriptionKey)}
                              selected={preset.id === selectedPreset.id}
                              enabled={selectedPresetIds.includes(preset.id)}
                              onSelect={() => setSelectedPresetId(preset.id)}
                              onToggle={() => togglePreset(preset.id)}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
          </aside>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div
              ref={previewAreaRef}
              className="flex min-h-0 flex-1 items-center justify-center bg-muted/20 p-3 md:p-5"
            >
              <div className="relative max-h-full max-w-full border border-border bg-background p-2 shadow-sm">
                {isRendering && (
                  <div className="absolute left-3 top-3 z-20 rounded bg-background/90 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {t("rendering")}
                  </div>
                )}
                <canvas
                  ref={mainCanvasRef}
                  aria-label={t("previewCanvas")}
                  onPointerDown={handleCanvasPointerDown}
                  onPointerMove={handleCanvasPointerMove}
                  onPointerUp={handleCanvasPointerUp}
                  onPointerCancel={handleCanvasPointerUp}
                  className="block cursor-grab select-none active:cursor-grabbing"
                  style={
                    previewDisplaySize
                      ? {
                          width: previewDisplaySize.width,
                          height: previewDisplaySize.height,
                        }
                      : undefined
                  }
                />
                <div className="mt-2 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span>{t(selectedPreset.labelKey)}</span>
                  <span className="font-mono">
                    {selectedPreset.width} x {selectedPreset.height}
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-border bg-background">
              <div className="flex gap-3 overflow-x-auto p-3">
                {selectedPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`w-32 shrink-0 cursor-pointer rounded border p-2 text-left transition-colors ${
                      preset.id === selectedPreset.id
                        ? "border-accent bg-accent/5"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <canvas
                      ref={(node) => {
                        if (node) previewCanvasRefs.current.set(preset.id, node)
                        else previewCanvasRefs.current.delete(preset.id)
                      }}
                      className="mb-2 block w-full bg-muted object-contain"
                      style={{ aspectRatio: preset.width / preset.height }}
                    />
                    <span className="block truncate text-[10px] uppercase tracking-[0.14em] text-foreground">
                      {t(preset.labelKey)}
                    </span>
                    <span className="mt-1 block font-mono text-[10px] text-muted-foreground">
                      {preset.width} x {preset.height}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="max-h-80 min-h-0 shrink-0 space-y-6 overflow-y-auto overscroll-contain border-t border-border bg-background p-4 pb-8 lg:max-h-none lg:w-72 lg:border-l lg:border-t-0">
              <section>
                <SectionTitle icon={<SlidersHorizontal className="h-3.5 w-3.5" />}>
                  {t("selectedOutput")}
                </SectionTitle>
                <p className="text-sm font-medium text-foreground">
                  {t(selectedPreset.labelKey)}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {t(selectedPreset.descriptionKey)}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {(["fill", "fit"] as SocialExportFitMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setFitMode(mode)}
                      className={`flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded border text-xs uppercase tracking-[0.18em] transition-colors ${
                        selectedCrop.fitMode === mode
                          ? "border-accent bg-accent/5 text-accent"
                          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {mode === "fill" ? (
                        <Maximize2 className="h-3.5 w-3.5" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                      {t(mode)}
                    </button>
                  ))}
                </div>
                <div className="mt-5 space-y-4">
                  <RangeField
                    label={t("scale")}
                    value={Math.round(selectedCrop.scale * 100)}
                    min={selectedCrop.fitMode === "fit" ? 50 : 100}
                    max={300}
                    suffix="%"
                    onChange={(value) =>
                      updateSelectedCrop({
                        scale: clampSocialExportScale(
                          value / 100,
                          selectedCrop.fitMode
                        ),
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={resetSelectedCrop}
                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded border border-border py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    {t("resetCrop")}
                  </button>
                </div>
              </section>

              <section>
                <SectionTitle icon={<Download className="h-3.5 w-3.5" />}>
                  {t("export")}
                </SectionTitle>
                <div className="grid grid-cols-3 gap-2">
                  {OUTPUT_FORMATS.map((format) => (
                    <button
                      key={format.value}
                      type="button"
                      onClick={() => setOutputFormat(format.value)}
                      className={`h-9 cursor-pointer rounded border text-[10px] uppercase tracking-[0.16em] transition-colors ${
                        outputFormat === format.value
                          ? "border-accent bg-accent/5 text-accent"
                          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
                {outputFormat !== "image/png" && (
                  <div className="mt-4">
                    <RangeField
                      label={t("quality")}
                      value={quality}
                      min={40}
                      max={100}
                      suffix="%"
                      onChange={setQuality}
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={!canExport || isExporting}
                  className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center gap-2 bg-primary px-4 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  {isExporting
                    ? t("exporting")
                    : t("downloadZip", {
                        count: selectedPresets.length,
                        format: getSocialExportOutputExtension(outputFormat).toUpperCase(),
                      })}
                </button>
                <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                  {t("zipHint")}
                </p>
              </section>
          </aside>
        </div>
      )}
    </>
  )
}
