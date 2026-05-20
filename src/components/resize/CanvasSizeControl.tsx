"use client"

import { useState, useCallback } from "react"
import { ArrowLeftRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { validateCanvasSize } from "@/lib/resize-utils"

interface CanvasSizeControlProps {
  width: number
  height: number
  onChange: (size: { width: number; height: number }) => void
}

const PRESETS = [
  { key: "preset_1_1", w: 1080, h: 1080, label: "1080 × 1080" },
  { key: "preset_4_3", w: 1200, h: 900, label: "1200 × 900" },
  { key: "preset_3_4", w: 900, h: 1200, label: "900 × 1200" },
  { key: "preset_16_9", w: 1920, h: 1080, label: "1920 × 1080" },
  { key: "preset_9_16", w: 1080, h: 1920, label: "1080 × 1920" },
] as const

export function CanvasSizeControl({
  width,
  height,
  onChange,
}: CanvasSizeControlProps) {
  const t = useTranslations("resize")
  const [inputW, setInputW] = useState(String(width))
  const [inputH, setInputH] = useState(String(height))
  const [error, setError] = useState<string | null>(null)

  const applySize = useCallback(
    (w: string, h: string) => {
      const numW = parseInt(w, 10)
      const numH = parseInt(h, 10)
      if (isNaN(numW) || isNaN(numH)) {
        setError(t("invalidSize"))
        return
      }
      const validation = validateCanvasSize(numW, numH)
      if (!validation.valid) {
        setError(t("invalidSize"))
        return
      }
      setError(null)
      onChange({ width: numW, height: numH })
    },
    [onChange, t]
  )

  const handleBlurW = useCallback(() => {
    applySize(inputW, inputH)
  }, [inputW, inputH, applySize])

  const handleBlurH = useCallback(() => {
    applySize(inputW, inputH)
  }, [inputW, inputH, applySize])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        applySize(inputW, inputH)
      }
    },
    [inputW, inputH, applySize]
  )

  const handleSwap = useCallback(() => {
    setInputW(inputH)
    setInputH(inputW)
    applySize(inputH, inputW)
  }, [inputW, inputH, applySize])

  const handlePreset = useCallback(
    (w: number, h: number) => {
      setInputW(String(w))
      setInputH(String(h))
      setError(null)
      onChange({ width: w, height: h })
    },
    [onChange]
  )

  const activePreset = PRESETS.find(
    (p) => p.w === width && p.h === height
  )?.key

  return (
    <div className="flex flex-col gap-5">
      {/* Section: Canvas Size */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
          {t("canvasSize")}
        </p>
        <div className="flex items-center gap-1.5">
          <div className="flex-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
              {t("width")}
            </label>
            <input
              type="number"
              value={inputW}
              onChange={(e) => setInputW(e.target.value)}
              onBlur={handleBlurW}
              onKeyDown={handleKeyDown}
              min={1}
              max={4096}
              className="w-full h-8 px-2 text-sm bg-background border border-border rounded text-foreground text-center focus:outline-none focus:border-accent"
            />
          </div>

          <button
            onClick={handleSwap}
            className="w-7 h-7 flex items-center justify-center text-muted-foreground cursor-pointer hover:text-foreground transition-colors mt-4"
            title={t("swap")}
          >
            <ArrowLeftRight className="h-3 w-3" />
          </button>

          <div className="flex-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
              {t("height")}
            </label>
            <input
              type="number"
              value={inputH}
              onChange={(e) => setInputH(e.target.value)}
              onBlur={handleBlurH}
              onKeyDown={handleKeyDown}
              min={1}
              max={4096}
              className="w-full h-8 px-2 text-sm bg-background border border-border rounded text-foreground text-center focus:outline-none focus:border-accent"
            />
          </div>
        </div>
        {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
      </div>

      {/* Section: Presets */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
          {t("presets")}
        </p>
        <div className="flex flex-col gap-1">
          {PRESETS.map((preset) => (
            <button
              key={preset.key}
              onClick={() => handlePreset(preset.w, preset.h)}
              className={`flex items-center justify-between px-3 py-2 text-xs rounded cursor-pointer transition-colors ${
                activePreset === preset.key
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="uppercase tracking-wider">{t(preset.key)}</span>
              <span className="text-[10px] text-muted-foreground/70">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
