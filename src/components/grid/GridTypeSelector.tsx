"use client"

import { useTranslations } from "next-intl"
import type { GridType } from "@/lib/grid-splitter"

interface GridTypeSelectorProps {
  value: GridType
  onChange: (type: GridType) => void
  withGap: boolean
  onGapChange: (v: boolean) => void
  layout?: "vertical" | "horizontal"
}

const GRID_OPTIONS: { type: GridType; rows: number; cols: number }[] = [
  { type: "3x3", rows: 3, cols: 3 },
  { type: "1x3", rows: 1, cols: 3 },
  { type: "2x2", rows: 2, cols: 2 },
]

function GridIcon({ rows, cols }: { rows: number; cols: number }) {
  const cells = Array.from({ length: rows * cols })
  return (
    <div
      className="grid gap-[1px]"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: cols >= rows ? 20 : Math.round(20 * (cols / rows)),
        height: rows >= cols ? 20 : Math.round(20 * (rows / cols)),
      }}
    >
      {cells.map((_, i) => (
        <div key={i} className="bg-current" />
      ))}
    </div>
  )
}

export function GridTypeSelector({
  value,
  onChange,
  withGap,
  onGapChange,
  layout = "vertical",
}: GridTypeSelectorProps) {
  const t = useTranslations("grid")

  const isHorizontal = layout === "horizontal"

  return (
    <div className={isHorizontal ? "flex items-center gap-2 overflow-x-auto" : ""}>
      {!isHorizontal && (
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
          {t("gridType.label")}
        </div>
      )}
      <div className={`flex ${isHorizontal ? "gap-2" : "flex-col gap-2 mb-6"}`}>
        {GRID_OPTIONS.map((opt) => (
          <button
            key={opt.type}
            onClick={() => onChange(opt.type)}
            className={`flex items-center gap-2.5 px-3 py-2.5 transition-colors duration-300 flex-shrink-0 ${
              value === opt.type
                ? "bg-primary text-primary-foreground"
                : "border border-secondary text-muted-foreground hover:border-primary/30"
            }`}
          >
            <GridIcon rows={opt.rows} cols={opt.cols} />
            <span className="text-xs tracking-[0.1em]">
              {t(`gridType.${opt.type}`)}
            </span>
          </button>
        ))}
      </div>

      {!isHorizontal && (
        <>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
            {t("gap.label")}
          </div>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs text-foreground">{t("gap.label")}</span>
            <button
              role="switch"
              aria-checked={withGap}
              onClick={() => onGapChange(!withGap)}
              className={`relative w-9 h-5 transition-colors duration-300 ${
                withGap ? "bg-accent" : "bg-secondary"
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white shadow-sm transition-transform duration-300 ${
                  withGap ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </label>
        </>
      )}

      {isHorizontal && (
        <button
          onClick={() => onGapChange(!withGap)}
          className={`flex items-center gap-2 px-3 py-2.5 flex-shrink-0 transition-colors duration-300 ${
            withGap
              ? "bg-accent text-primary-foreground"
              : "border border-secondary text-muted-foreground hover:border-primary/30"
          }`}
        >
          <span className="text-xs tracking-[0.1em]">{t("gap.label")}</span>
        </button>
      )}
    </div>
  )
}
