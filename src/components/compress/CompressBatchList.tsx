// src/components/compress/CompressBatchList.tsx
"use client"

import { useTranslations } from "next-intl"
import { formatFileSize } from "@/lib/compress"
import type { CompressResult } from "@/lib/compress"
import { X } from "lucide-react"

export interface BatchItem {
  id: string
  file: File
  image: HTMLImageElement
  result: CompressResult | null
}

interface CompressBatchListProps {
  items: BatchItem[]
  onRemove: (id: string) => void
  onAddMore: () => void
}

export function CompressBatchList({
  items,
  onRemove,
  onAddMore,
}: CompressBatchListProps) {
  const t = useTranslations("compress")

  const totalOriginal = items.reduce((s, i) => s + i.file.size, 0)
  const totalCompressed = items.reduce(
    (s, i) => s + (i.result?.compressedSize ?? i.file.size),
    0
  )
  const totalSaved = totalOriginal - totalCompressed
  const totalPercent =
    totalOriginal > 0 ? Math.round((totalSaved / totalOriginal) * 100) : 0

  const allReady = items.every((i) => i.result !== null)

  return (
    <div className="flex-1 flex flex-col min-h-0 p-4 gap-3">
      {/* File list */}
      <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
        {items.map((item) => (
          <div
            key={item.id}
            className="group flex items-center gap-3 px-3 py-2.5 bg-card border border-border rounded hover:border-primary/30 transition-colors"
          >
            <span className="text-xs text-foreground truncate flex-1 min-w-0">
              {item.file.name}
            </span>
            <span className="text-[11px] tabular-nums text-muted-foreground shrink-0">
              {formatFileSize(item.file.size)}
            </span>
            <span className="text-[11px] text-muted-foreground shrink-0">→</span>
            {item.result ? (
              <>
                <span className="text-[11px] tabular-nums text-accent shrink-0">
                  {formatFileSize(item.result.compressedSize)}
                </span>
                <span className="text-[10px] tabular-nums text-accent shrink-0">
                  ↓{item.result.savedPercent}%
                </span>
                <span className="text-accent text-xs shrink-0">✓</span>
              </>
            ) : (
              <span className="text-[11px] text-muted-foreground shrink-0 animate-pulse">
                {t("processing")}
              </span>
            )}
            <button
              onClick={() => onRemove(item.id)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {/* Add more drop zone */}
        <button
          onClick={onAddMore}
          className="w-full py-3 border border-dashed border-border rounded text-[11px] uppercase tracking-[0.15em] text-muted-foreground hover:border-primary/40 hover:text-accent transition-colors duration-300"
        >
          + {t("addMore")}
        </button>
      </div>

      {/* Summary bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded text-xs text-muted-foreground">
        <span>{t("filesCount", { count: items.length })}</span>
        {allReady && totalSaved > 0 && (
          <span>
            {t("totalSaved", {
              size: formatFileSize(totalSaved),
              percent: String(totalPercent),
            })}
          </span>
        )}
      </div>
    </div>
  )
}
