"use client"

import { useCallback } from "react"
import { useTranslations, useLocale } from "next-intl"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogoIcon } from "@/components/LogoIcon"
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
  open?: boolean
  onClose?: () => void
}

export function HistorySidebar({
  onLoadRecord,
  onNewCanvas,
  open,
  onClose,
}: HistorySidebarProps) {
  const t = useTranslations("history")
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
      onClose?.()
    },
    [onLoadRecord, onClose]
  )

  const handleDelete = useCallback(
    async (e: React.MouseEvent, id: string) => {
      e.stopPropagation()
      await deleteRecord(id)
    },
    [deleteRecord]
  )

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-primary/20 backdrop-blur-[2px] md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={[
          "flex flex-col h-full w-72 bg-card shadow-lg",
          "fixed inset-y-0 left-0 z-50",
          "transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
          "md:static md:z-auto md:w-64 md:translate-x-0 md:shadow-none md:border-r md:transition-none",
        ].join(" ")}
        style={{ transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground md:hidden"
        >
          <X className="h-4 w-4" />
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-3 border-b hover:bg-muted/50 transition-colors"
          title={t("backToHome")}
        >
          <LogoIcon className="h-4 w-4 text-foreground" />
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-foreground">
            ImgSplit
          </span>
        </Link>

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
    </>
  )
}
