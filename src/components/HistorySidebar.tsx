"use client"

import { useCallback } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Scissors, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { Link } from "@/i18n/navigation"
import { useHistory } from "@/hooks/use-history"
import type { HistoryRecord, SplitLine } from "@/types"

interface HistorySidebarProps {
  onLoadRecord: (record: {
    imageBlob: Blob
    lines: SplitLine[]
    originalFileName: string
    originalMimeType: string
    images?: Array<{ blob: Blob; fileName: string; mimeType: string }>
  }) => void
  onNewCanvas: () => void
  mode: "manual" | "ai"
  onSwitchMode: (mode: "manual" | "ai") => void
}

export function HistorySidebar({
  onLoadRecord,
  onNewCanvas,
  mode,
  onSwitchMode,
}: HistorySidebarProps) {
  const t = useTranslations("history")
  const tAi = useTranslations("aiSegmentation")
  const locale = useLocale()
  const { records, isLoading, deleteRecord } = useHistory()

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const time = date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
    if (isToday) return t("today", { time })
    return date.toLocaleDateString(locale, { month: "short", day: "numeric" }) + ` ${time}`
  }

  const handleClick = useCallback(
    (record: HistoryRecord) => {
      onLoadRecord({
        imageBlob: record.imageBlob,
        lines: record.lines,
        originalFileName: record.originalFileName,
        originalMimeType: record.originalMimeType,
        images: record.images,
      })
    },
    [onLoadRecord]
  )

  const handleDelete = useCallback(
    async (e: React.MouseEvent, id: string) => {
      e.stopPropagation()
      await deleteRecord(id)
    },
    [deleteRecord]
  )

  return (
    <div className="flex flex-col h-full w-64 border-r bg-card">
      <Link
        href="/"
        className="flex items-center gap-2 px-3 py-3 border-b hover:bg-muted/50 transition-colors"
        title={t("backToHome")}
      >
        <Scissors className="h-4 w-4 text-foreground" strokeWidth={1.5} />
        <span className="text-xs uppercase tracking-[0.2em] font-medium text-foreground">
          ImageSplit
        </span>
      </Link>

      <div className="flex gap-1 p-3 border-b">
        <Button
          size="sm"
          variant={mode === "manual" ? "default" : "outline"}
          onClick={() => onSwitchMode("manual")}
          className="flex-1 gap-1 text-xs"
        >
          <Scissors className="h-3 w-3" />
          {tAi("backToManual")}
        </Button>
        <Button
          size="sm"
          variant={mode === "ai" ? "default" : "outline"}
          onClick={() => onSwitchMode("ai")}
          className="flex-1 gap-1 text-xs"
        >
          <Sparkles className="h-3 w-3" />
          {tAi("sidebarButton")}
        </Button>
      </div>

      <div className="flex items-center justify-between p-3 border-b">
        <h2 className="text-sm font-medium">{t("title")}</h2>
        <Button size="sm" variant="outline" onClick={onNewCanvas}>
          {t("new")}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <p className="p-4 text-sm text-muted-foreground">{t("loading")}</p>
        )}

        {!isLoading && records.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">{t("empty")}</p>
        )}

        {records.map((record) => (
          <div
            key={record.id}
            className="flex gap-3 p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors group"
            onClick={() => handleClick(record)}
          >
            <img
              src={record.thumbnailDataUrl}
              alt={record.originalFileName}
              className="w-12 h-12 object-cover rounded flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">
                {record.originalFileName}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatTime(record.createdAt)}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("lineCount", { count: record.lines.length })}
              </p>
            </div>
            <button
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity text-xs self-start"
              onClick={(e) => handleDelete(e, record.id)}
            >
              {t("delete")}
            </button>
          </div>
        ))}
      </div>

      <div className="border-t p-3">
        <LocaleSwitcher />
      </div>
    </div>
  )
}
