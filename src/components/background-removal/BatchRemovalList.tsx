"use client"

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Eye,
  Loader2,
  RotateCcw,
  Trash2,
  XCircle,
} from "lucide-react"
import type { BatchRemovalItem } from "@/lib/background-removal-batch"

type BatchRemovalListProps = {
  items: BatchRemovalItem[]
  statusText: Record<BatchRemovalItem["status"], string>
  retryLabel: string
  removeLabel: string
  previewLabel: string
  onRetry: (id: string) => void
  onRemove: (id: string) => void
  onPreview: (item: BatchRemovalItem) => void
}

function isActiveItem(item: BatchRemovalItem) {
  return item.status === "loading-model" || item.status === "processing"
}

function getThumbnailUrl(item: BatchRemovalItem) {
  return item.status === "ready" && item.resultUrl ? item.resultUrl : item.sourceUrl
}

function getProgressValue(item: BatchRemovalItem) {
  if (item.status === "ready") return 1
  if (isActiveItem(item)) return Math.max(item.progress ?? 0.08, 0.08)
  return item.progress ?? 0
}

function StatusIcon({ item }: { item: BatchRemovalItem }) {
  if (isActiveItem(item)) {
    return (
      <Loader2
        className="h-3.5 w-3.5 shrink-0 animate-spin text-accent"
        strokeWidth={1.5}
      />
    )
  }

  if (item.status === "ready") {
    return (
      <CheckCircle2
        className="h-3.5 w-3.5 shrink-0 text-accent"
        strokeWidth={1.5}
      />
    )
  }

  if (item.status === "error") {
    return (
      <AlertCircle
        className="h-3.5 w-3.5 shrink-0 text-destructive"
        strokeWidth={1.5}
      />
    )
  }

  if (item.status === "canceled") {
    return (
      <XCircle
        className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
        strokeWidth={1.5}
      />
    )
  }

  return (
    <Clock3
      className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
      strokeWidth={1.5}
    />
  )
}

export function BatchRemovalList({
  items,
  statusText,
  retryLabel,
  removeLabel,
  previewLabel,
  onRetry,
  onRemove,
  onPreview,
}: BatchRemovalListProps) {
  return (
    <div className="min-h-0 overflow-y-auto border border-border bg-background">
      {items.map((item) => {
        const isActive = isActiveItem(item)
        const canPreview = item.status === "ready" && Boolean(item.resultUrl)
        const canRetry = item.status === "error" || item.status === "canceled"
        const progress = getProgressValue(item)
        const progressPercent = Math.round(progress * 100)

        return (
          <div
            key={item.id}
            className="grid grid-cols-[56px_minmax(0,1fr)_auto] gap-3 border-b border-border p-3 transition-colors duration-300 last:border-b-0 hover:bg-secondary/35"
          >
            <button
              type="button"
              disabled={!canPreview}
              onClick={() => onPreview(item)}
              className="group relative h-14 w-14 cursor-pointer overflow-hidden border border-border bg-secondary/60 disabled:cursor-default"
              aria-label={previewLabel}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getThumbnailUrl(item)}
                alt={item.file.name}
                className="h-full w-full object-cover"
              />
              {canPreview && (
                <span className="absolute inset-0 flex items-center justify-center bg-background/70 text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Eye className="h-4 w-4" strokeWidth={1.5} />
                </span>
              )}
            </button>

            <div className="min-w-0">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">{item.file.name}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {item.dimensions.width} x {item.dimensions.height}
                  </p>
                </div>
                {item.device && (
                  <span className="shrink-0 border border-border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                    {item.device}
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <StatusIcon item={item} />
                <span className="truncate">{statusText[item.status]}</span>
              </div>

              <div
                className="mt-2 h-1 overflow-hidden bg-secondary"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPercent}
              >
                <div
                  className={`h-full bg-accent transition-all duration-300 ${
                    isActive ? "animate-pulse" : ""
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {item.error && (
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-destructive">
                  {item.error}
                </p>
              )}
            </div>

            <div className="flex items-start gap-1">
              {canRetry && (
                <button
                  type="button"
                  onClick={() => onRetry(item.id)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  aria-label={retryLabel}
                >
                  <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
                </button>
              )}
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                disabled={isActive}
                className="flex h-8 w-8 cursor-pointer items-center justify-center text-muted-foreground transition-colors duration-300 hover:text-foreground disabled:cursor-default disabled:opacity-35"
                aria-label={removeLabel}
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
