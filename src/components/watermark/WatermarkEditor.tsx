"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import {
  Download,
  ImagePlus,
  Layers,
  RotateCcw,
  Trash2,
  Type,
  Upload,
} from "lucide-react"
import { Link } from "@/i18n/navigation"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { LogoIcon } from "@/components/LogoIcon"
import { UploadZone } from "@/components/UploadZone"
import {
  createWatermarkLayer,
  createWatermarkState,
  exportWatermarkedImage,
  getWatermarkBaseName,
  getWatermarkOutputExtension,
  renderWatermarkToCanvas,
  updateWatermarkLayer,
  type WatermarkImageAssets,
  type WatermarkLayer,
  type WatermarkOutputFormat,
  type WatermarkState,
} from "@/lib/watermark"
import {
  applyWatermarkTemplate,
  applyWatermarkTemplateToState,
  WATERMARK_TEMPLATES,
  type WatermarkTemplateId,
} from "@/lib/watermark-presets"
import { ACCEPTED_TYPES } from "@/lib/upload-utils"
import type { UploadResult } from "@/types"

const OUTPUT_FORMATS: Array<{
  label: string
  value: WatermarkOutputFormat
}> = [
  { label: "PNG", value: "image/png" },
  { label: "JPEG", value: "image/jpeg" },
  { label: "WebP", value: "image/webp" },
]

const COLOR_SWATCHES = [
  "#111827",
  "#ffffff",
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#2563eb",
]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error("Failed to read image"))
    reader.readAsDataURL(file)
  })
}

function loadImageFromSrc(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Failed to load image"))
    image.src = src
  })
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

function getDefaultState(image: HTMLImageElement): WatermarkState {
  return applyWatermarkTemplate("diagonal-repeat", {
    imageWidth: image.naturalWidth,
    imageHeight: image.naturalHeight,
    text: "Copyright",
  })
}

function SectionTitle({
  icon,
  children,
}: {
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
      {icon}
      {children}
    </p>
  )
}

export function WatermarkEditor() {
  const t = useTranslations("watermark")
  const [source, setSource] = useState<UploadResult | null>(null)
  const [watermarkState, setWatermarkState] = useState<WatermarkState>(() =>
    createWatermarkState()
  )
  const [imageAssets, setImageAssets] = useState<WatermarkImageAssets>({})
  const [outputFormat, setOutputFormat] =
    useState<WatermarkOutputFormat>("image/png")
  const [quality, setQuality] = useState(92)
  const [isRendering, setIsRendering] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const selectedLayer = useMemo(
    () =>
      watermarkState.layers.find(
        (layer) => layer.id === watermarkState.selectedLayerId
      ) ?? null,
    [watermarkState]
  )

  useEffect(() => {
    if (!source || !canvasRef.current) return

    let cancelled = false
    setIsRendering(true)

    renderWatermarkToCanvas(
      canvasRef.current,
      source.image,
      watermarkState,
      imageAssets
    )
      .catch(() => {
        if (!cancelled) toast.error(t("previewFailed"))
      })
      .finally(() => {
        if (!cancelled) setIsRendering(false)
      })

    return () => {
      cancelled = true
    }
  }, [source, watermarkState, imageAssets, t])

  const handleImageLoaded = useCallback((result: UploadResult) => {
    setSource(result)
    setWatermarkState(getDefaultState(result.image))
    setImageAssets({})
  }, [])

  const handleReplaceImage = useCallback(() => {
    setSource(null)
    setWatermarkState(createWatermarkState())
    setImageAssets({})
  }, [])

  const selectTemplate = useCallback(
    (templateId: WatermarkTemplateId) => {
      if (!source) return
      setWatermarkState((prev) => {
        const targetLayer =
          prev.layers.find(
            (layer) =>
              layer.id === prev.selectedLayerId && layer.type === "text"
          ) ?? prev.layers.find((layer) => layer.type === "text")

        return applyWatermarkTemplateToState(prev, templateId, {
          imageWidth: source.image.naturalWidth,
          imageHeight: source.image.naturalHeight,
          text: targetLayer?.text ?? "Copyright",
          targetLayerId: targetLayer?.id,
        })
      })
    },
    [source]
  )

  const addTextLayer = useCallback(() => {
    if (!source) return
    const layer = createWatermarkLayer("text", {
      text: "Copyright",
      fontSize: Math.max(28, Math.round(source.image.naturalWidth * 0.045)),
      x: 0.5,
      y: 0.5,
      opacity: 0.35,
    })
    setWatermarkState((prev) => ({
      layers: [...prev.layers, layer],
      selectedLayerId: layer.id,
    }))
  }, [source])

  const addLogoLayer = useCallback(async (file: File) => {
    if (!source || !ACCEPTED_TYPES.includes(file.type)) {
      toast.error(t("logoLoadFailed"))
      return
    }

    try {
      const dataUrl = await readFileAsDataUrl(file)
      const image = await loadImageFromSrc(dataUrl)
      const width = clamp(Math.round(source.image.naturalWidth * 0.18), 80, 360)
      const height = Math.round(width / (image.naturalWidth / image.naturalHeight))
      const layer = createWatermarkLayer("image", {
        imageSrc: dataUrl,
        imageName: file.name,
        x: 0.82,
        y: 0.88,
        width,
        height,
        rotation: 0,
        opacity: 0.78,
      })

      setImageAssets((prev) => ({ ...prev, [dataUrl]: image }))
      setWatermarkState((prev) => ({
        layers: [...prev.layers, layer],
        selectedLayerId: layer.id,
      }))
    } catch {
      toast.error(t("logoLoadFailed"))
    }
  }, [source, t])

  const handleLogoInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) void addLogoLayer(file)
      event.target.value = ""
    },
    [addLogoLayer]
  )

  const updateSelectedLayer = useCallback((patch: Partial<WatermarkLayer>) => {
    setWatermarkState((prev) => {
      if (!prev.selectedLayerId) return prev
      return updateWatermarkLayer(prev, prev.selectedLayerId, patch)
    })
  }, [])

  const removeSelectedLayer = useCallback(() => {
    setWatermarkState((prev) => {
      if (!prev.selectedLayerId) return prev
      const layers = prev.layers.filter((layer) => layer.id !== prev.selectedLayerId)
      return {
        layers,
        selectedLayerId: layers.at(-1)?.id ?? null,
      }
    })
  }, [])

  const handleDownload = useCallback(async () => {
    if (!source) return
    setIsExporting(true)
    try {
      const blob = await exportWatermarkedImage(
        source.image,
        watermarkState,
        outputFormat,
        quality / 100,
        imageAssets
      )
      const ext = getWatermarkOutputExtension(outputFormat)
      const baseName = getWatermarkBaseName(source.file.name)
      downloadBlob(blob, `${baseName}_watermark.${ext}`)
      toast.success(t("downloadReady"))
    } catch {
      toast.error(t("exportFailed"))
    } finally {
      setIsExporting(false)
    }
  }, [source, watermarkState, outputFormat, quality, imageAssets, t])

  const hasLayers = watermarkState.layers.length > 0

  return (
    <>
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
              <Link href="/" className="hover:text-foreground transition-colors">
                Split
              </Link>
              <Link href="/grid" className="hover:text-foreground transition-colors">
                Grid
              </Link>
              <Link href="/resize" className="hover:text-foreground transition-colors">
                Resize
              </Link>
              <Link href="/compress" className="hover:text-foreground transition-colors">
                Compress
              </Link>
              <Link href="/mosaic" className="hover:text-foreground transition-colors">
                Mosaic
              </Link>
              <Link href="/collage" className="hover:text-foreground transition-colors">
                Collage
              </Link>
              <Link href="/tools" className="hover:text-foreground transition-colors">
                Tools
              </Link>
              <span className="text-foreground font-medium">Watermark</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {source && (
              <button
                onClick={handleReplaceImage}
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                {t("replaceImage")}
              </button>
            )}
            <LocaleSwitcher variant="compact" />
          </div>
        </div>
      </nav>

      {!source ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-2xl space-y-6 px-4">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
                {t("uploadTitle")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("uploadDescription")}
              </p>
            </div>
            <UploadZone onImageLoaded={handleImageLoaded} />
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex flex-col md:flex-row">
          <div className="flex-1 min-h-0 bg-muted/20 flex items-center justify-center p-3 md:p-5">
            <div className="relative max-w-full max-h-full overflow-auto border border-border bg-background p-2 shadow-sm">
              {isRendering && (
                <div className="absolute left-3 top-3 z-10 rounded bg-background/90 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {t("rendering")}
                </div>
              )}
              <canvas
                ref={canvasRef}
                className="block h-auto max-h-[calc(100vh-9rem)] max-w-full"
                aria-label={t("previewCanvas")}
              />
            </div>
          </div>

          <aside className="shrink-0 md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-border bg-background flex flex-col min-h-0">
            <input
              ref={logoInputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              className="hidden"
              onChange={handleLogoInput}
            />

            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6">
              <section>
                <SectionTitle icon={<RotateCcw className="h-3.5 w-3.5" />}>
                  {t("templates")}
                </SectionTitle>
                <div className="grid grid-cols-2 gap-2">
                  {WATERMARK_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => selectTemplate(template.id)}
                      className="min-h-16 rounded border border-border px-3 py-2 text-left hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer"
                    >
                      <span className="block text-xs font-medium text-foreground">
                        {t(template.labelKey)}
                      </span>
                      <span className="mt-1 block text-[10px] leading-4 text-muted-foreground">
                        {t(template.descriptionKey)}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <SectionTitle icon={<Layers className="h-3.5 w-3.5" />}>
                  {t("layers")}
                </SectionTitle>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addTextLayer}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded border border-border py-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <Type className="h-3.5 w-3.5" />
                    {t("addText")}
                  </button>
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded border border-border py-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                    {t("addLogo")}
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {watermarkState.layers.map((layer, index) => (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() =>
                        setWatermarkState((prev) => ({
                          ...prev,
                          selectedLayerId: layer.id,
                        }))
                      }
                      className={`flex w-full items-center justify-between rounded border px-3 py-2 text-left transition-colors cursor-pointer ${
                        layer.id === watermarkState.selectedLayerId
                          ? "border-accent bg-accent/5"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-xs text-foreground">
                          {layer.type === "text"
                            ? layer.text || t("untitledText")
                            : layer.imageName || t("logo")}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {index + 1} · {t(layer.type === "image" ? "logo" : "text")} · {t(layer.repeatMode)}
                        </span>
                      </span>
                      <span
                        className={`h-2 w-2 rounded-full ${
                          layer.enabled ? "bg-accent" : "bg-muted-foreground/40"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </section>

              {selectedLayer && (
                <section>
                  <SectionTitle>{t("selectedLayer")}</SectionTitle>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span>{t("enabled")}</span>
                      <input
                        type="checkbox"
                        checked={selectedLayer.enabled}
                        onChange={(event) =>
                          updateSelectedLayer({ enabled: event.target.checked })
                        }
                        className="h-4 w-4 accent-foreground"
                      />
                    </label>

                    {selectedLayer.type === "text" ? (
                      <>
                        <label className="block">
                          <span className="mb-1 block text-xs text-muted-foreground">
                            {t("text")}
                          </span>
                          <input
                            type="text"
                            value={selectedLayer.text}
                            onChange={(event) =>
                              updateSelectedLayer({ text: event.target.value })
                            }
                            className="h-9 w-full rounded border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:border-accent"
                          />
                        </label>

                        <div>
                          <span className="mb-2 block text-xs text-muted-foreground">
                            {t("color")}
                          </span>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={selectedLayer.color}
                              onChange={(event) =>
                                updateSelectedLayer({ color: event.target.value })
                              }
                              className="h-8 w-10 rounded border border-border bg-background"
                            />
                            {COLOR_SWATCHES.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => updateSelectedLayer({ color })}
                                className="h-7 w-7 rounded border border-border cursor-pointer"
                                style={{ backgroundColor: color }}
                                aria-label={color}
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="rounded border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                        {selectedLayer.imageName}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <RangeField
                        label={t("opacity")}
                        value={Math.round(selectedLayer.opacity * 100)}
                        min={5}
                        max={100}
                        suffix="%"
                        onChange={(value) =>
                          updateSelectedLayer({ opacity: value / 100 })
                        }
                      />
                      <RangeField
                        label={t("rotation")}
                        value={selectedLayer.rotation}
                        min={-180}
                        max={180}
                        suffix="°"
                        onChange={(value) => updateSelectedLayer({ rotation: value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <RangeField
                        label="X"
                        value={Math.round(selectedLayer.x * 100)}
                        min={0}
                        max={100}
                        suffix="%"
                        onChange={(value) => updateSelectedLayer({ x: value / 100 })}
                      />
                      <RangeField
                        label="Y"
                        value={Math.round(selectedLayer.y * 100)}
                        min={0}
                        max={100}
                        suffix="%"
                        onChange={(value) => updateSelectedLayer({ y: value / 100 })}
                      />
                    </div>

                    <RangeField
                      label={selectedLayer.type === "text" ? t("size") : t("logoSize")}
                      value={
                        selectedLayer.type === "text"
                          ? selectedLayer.fontSize
                          : selectedLayer.width
                      }
                      min={selectedLayer.type === "text" ? 12 : 40}
                      max={selectedLayer.type === "text" ? 220 : 640}
                      suffix="px"
                      onChange={(value) =>
                        selectedLayer.type === "text"
                          ? updateSelectedLayer({ fontSize: value })
                          : updateSelectedLayer({
                              width: value,
                              height:
                                selectedLayer.width > 0
                                  ? Math.round(
                                      (selectedLayer.height / selectedLayer.width) *
                                        value
                                    )
                                  : selectedLayer.height,
                            })
                      }
                    />

                    <div>
                      <span className="mb-2 block text-xs text-muted-foreground">
                        {t("repeat")}
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {(["single", "repeat"] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => updateSelectedLayer({ repeatMode: mode })}
                            className={`rounded py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                              selectedLayer.repeatMode === mode
                                ? "bg-accent/10 text-accent"
                                : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                          >
                            {t(mode)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedLayer.repeatMode === "repeat" && (
                      <div className="grid grid-cols-2 gap-3">
                        <RangeField
                          label={t("spacingX")}
                          value={selectedLayer.spacingX}
                          min={80}
                          max={640}
                          suffix="px"
                          onChange={(value) =>
                            updateSelectedLayer({ spacingX: value })
                          }
                        />
                        <RangeField
                          label={t("spacingY")}
                          value={selectedLayer.spacingY}
                          min={80}
                          max={480}
                          suffix="px"
                          onChange={(value) =>
                            updateSelectedLayer({ spacingY: value })
                          }
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={removeSelectedLayer}
                      className="flex w-full items-center justify-center gap-1.5 rounded border border-border py-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {t("removeLayer")}
                    </button>
                  </div>
                </section>
              )}
            </div>

            <div className="border-t border-border p-4 space-y-3">
              <div className="grid grid-cols-[1fr_120px] gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">
                    {t("quality")}
                  </span>
                  <input
                    type="range"
                    min={50}
                    max={100}
                    value={quality}
                    onChange={(event) => setQuality(Number(event.target.value))}
                    className="w-full accent-foreground"
                    disabled={outputFormat === "image/png"}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">
                    {t("format")}
                  </span>
                  <select
                    value={outputFormat}
                    onChange={(event) =>
                      setOutputFormat(event.target.value as WatermarkOutputFormat)
                    }
                    className="h-9 w-full rounded border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:border-accent"
                  >
                    {OUTPUT_FORMATS.map((format) => (
                      <option key={format.value} value={format.value}>
                        {format.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button
                type="button"
                disabled={!hasLayers || isExporting}
                onClick={handleDownload}
                className="flex w-full items-center justify-center gap-2 rounded bg-foreground py-2.5 text-xs uppercase tracking-wider text-background transition-colors hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-default cursor-pointer"
              >
                <Download className="h-4 w-4" />
                {isExporting ? t("exporting") : t("download")}
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
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
  suffix: string
  onChange: (value: number) => void
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums text-foreground">
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
