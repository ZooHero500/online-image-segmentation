"use client"

import { useTranslations } from "next-intl"
import type { OutputFormat } from "@/lib/compress"

interface CompressControlsProps {
  format: OutputFormat
  quality: number
  onFormatChange: (format: OutputFormat) => void
  onQualityChange: (quality: number) => void
  downloadLabel: string
  onDownload: () => void
  onAddMore?: () => void
  showAddMore?: boolean
}

const FORMAT_OPTIONS: { value: OutputFormat; labelKey: string }[] = [
  { value: "image/png", labelKey: "formatPng" },
  { value: "image/jpeg", labelKey: "formatJpeg" },
  { value: "image/webp", labelKey: "formatWebp" },
]

export function CompressControls({
  format,
  quality,
  onFormatChange,
  onQualityChange,
  downloadLabel,
  onDownload,
  onAddMore,
  showAddMore = false,
}: CompressControlsProps) {
  const t = useTranslations("compress")
  const showQuality = format !== "image/png"

  return (
    <div className="flex flex-wrap items-center gap-4 sm:gap-6 p-4 bg-card border border-border rounded-lg">
      {/* Format selector */}
      <div className="flex gap-1">
        {FORMAT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onFormatChange(opt.value)}
            className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${
              format === opt.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {t(opt.labelKey)}
          </button>
        ))}
      </div>

      {/* Quality slider */}
      {showQuality && (
        <div className="flex items-center gap-3 flex-1 min-w-[160px]">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground shrink-0">
            {t("quality")}
          </span>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => onQualityChange(Number(e.target.value))}
            className="flex-1 h-1 accent-primary cursor-pointer"
          />
          <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">
            {quality}%
          </span>
        </div>
      )}

      {/* Download button */}
      <button
        onClick={onDownload}
        className="ml-auto px-5 py-2 bg-primary text-primary-foreground text-xs uppercase tracking-[0.15em] hover:opacity-90 transition-opacity duration-300 press"
      >
        {downloadLabel}
      </button>

      {/* Add more */}
      {showAddMore && onAddMore && (
        <button
          onClick={onAddMore}
          className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors duration-300"
        >
          + {t("addMore")}
        </button>
      )}
    </div>
  )
}
