"use client"

import { useCallback, useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { LogoIcon } from "@/components/LogoIcon"
import { UploadZone } from "@/components/UploadZone"
import type { UploadResult } from "@/types"

export function WatermarkEditor() {
  const t = useTranslations("watermark")
  const [source, setSource] = useState<UploadResult | null>(null)

  const handleImageLoaded = useCallback((result: UploadResult) => {
    setSource(result)
  }, [])

  const handleReplaceImage = useCallback(() => {
    setSource(null)
  }, [])

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
              <Link
                href="/resize"
                className="hover:text-foreground transition-colors"
              >
                Resize
              </Link>
              <Link
                href="/compress"
                className="hover:text-foreground transition-colors"
              >
                Compress
              </Link>
              <span className="text-foreground font-medium">Watermark</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {source && (
              <button
                onClick={handleReplaceImage}
                className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors cursor-pointer"
              >
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
          <div className="flex-1 min-h-0 bg-muted/20 flex items-center justify-center p-4">
            <div className="max-w-full max-h-full border border-border bg-background p-3">
              {/* The Konva editor replaces this placeholder in Task 4. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={source.image.src}
                alt={source.file.name}
                className="max-h-[70vh] max-w-full object-contain"
              />
            </div>
          </div>
          <aside className="shrink-0 md:w-72 lg:w-80 border-t md:border-t-0 md:border-l border-border bg-background">
            <div className="p-4 space-y-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                  {t("templates")}
                </p>
                <div className="h-20 rounded border border-dashed border-border" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                  {t("layers")}
                </p>
                <div className="h-20 rounded border border-dashed border-border" />
              </div>
              <button
                type="button"
                disabled
                className="w-full py-2.5 text-xs uppercase tracking-wider bg-foreground text-background rounded opacity-50"
              >
                {t("download")}
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
