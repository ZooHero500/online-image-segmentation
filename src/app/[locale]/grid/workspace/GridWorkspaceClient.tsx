"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { LogoIcon } from "@/components/LogoIcon"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { GridSteps } from "@/components/grid/GridSteps"
import { GridUploadZone } from "@/components/grid/GridUploadZone"
import { GridTypeSelector } from "@/components/grid/GridTypeSelector"
import { DynamicGridEditor } from "@/components/grid/DynamicGridEditor"
import { DynamicGridPreview as GridPreview } from "@/components/grid/DynamicGridPreview"
import { useGridEditor } from "@/hooks/use-grid-editor"
import { getGridConfig } from "@/lib/grid-splitter"
import { consumePendingGridUpload } from "@/lib/pending-grid-upload"
import { loadImage } from "@/lib/upload-utils"
import type { GridSplitResult } from "@/lib/grid-splitter"

type Step = 1 | 2 | 3

export function GridWorkspaceClient() {
  const tDownload = useTranslations("grid.download")

  const [step, setStep] = useState<Step>(1)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [mimeType, setMimeType] = useState<string>("image/png")
  const [results, setResults] = useState<GridSplitResult[] | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 400, height: 400 })
  const pendingConsumed = useRef(false)

  const editor = useGridEditor(
    image ? { width: image.naturalWidth, height: image.naturalHeight } : { width: 1, height: 1 },
    containerSize
  )

  // Consume pending upload on mount
  useEffect(() => {
    if (pendingConsumed.current) return
    pendingConsumed.current = true
    const file = consumePendingGridUpload()
    if (!file) return
    loadImage(file).then((img) => {
      const url = URL.createObjectURL(file)
      setImage(img)
      setImageUrl(url)
      setMimeType(file.type)
      setStep(2)
      requestAnimationFrame(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect()
          setContainerSize({
            width: Math.min(rect.width - 48, 600),
            height: Math.min(rect.height - 48, 600),
          })
        }
      })
    })
  }, [])

  const handleImageLoaded = useCallback((img: HTMLImageElement, file: File) => {
    if (imageUrl) URL.revokeObjectURL(imageUrl)
    const url = URL.createObjectURL(file)
    setImage(img)
    setImageUrl(url)
    setMimeType(file.type)
    setResults(null)
    setStep(2)
    requestAnimationFrame(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerSize({
          width: Math.min(rect.width - 48, 600),
          height: Math.min(rect.height - 48, 600),
        })
      }
    })
  }, [imageUrl])

  const handleReupload = useCallback(() => {
    setResults(null)
    setStep(1)
  }, [])

  const handleGenerated = useCallback((r: GridSplitResult[]) => {
    setResults(r)
    setStep(3)
  }, [])

  const handleReadjust = useCallback(() => {
    setResults(null)
    setStep(2)
  }, [])

  const resultUrls = useMemo(() => {
    if (!results) return []
    return results.map((r) => URL.createObjectURL(r.blob))
  }, [results])

  useEffect(() => {
    return () => {
      resultUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [resultUrls])

  const handleSaveSingle = useCallback(
    (result: GridSplitResult) => {
      const ext = mimeType === "image/jpeg" ? "jpg" : "png"
      const url = URL.createObjectURL(result.blob)
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      if (isIOS) {
        window.open(url, "_blank")
      } else {
        const a = document.createElement("a")
        a.href = url
        a.download = `grid-${result.index}.${ext}`
        a.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }
    },
    [mimeType]
  )

  const handleDownloadAll = useCallback(async () => {
    if (!results) return
    const { exportGridAsZip, getGridZipFileName } = await import("@/lib/zip-exporter")
    const ext = mimeType === "image/jpeg" ? "jpg" : "png"
    const zipBlob = await exportGridAsZip(results.map((r) => r.blob), ext)
    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = getGridZipFileName()
    a.click()
    URL.revokeObjectURL(url)
  }, [results, mimeType])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-[1600px] mx-auto px-4 md:px-16 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/grid" className="flex items-center gap-3">
              <LogoIcon className="h-4 w-4 text-foreground" />
              <span className="text-xs uppercase tracking-[0.3em] font-medium text-foreground">
                ImgSplit
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <LocaleSwitcher variant="compact" />
          </div>
        </div>
      </nav>

      <GridSteps currentStep={step} />

      <div className="flex-1 flex flex-col">
        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="max-w-[800px] mx-auto w-full px-4 md:px-8 py-8">
            <GridUploadZone onImageLoaded={handleImageLoaded} />
          </div>
        )}

        {/* Step 2: Adjust */}
        {step === 2 && image && (
          <div className="flex-1 flex flex-col md:flex-row gap-0 max-w-[1400px] mx-auto w-full">
            {/* Left sidebar — desktop */}
            <div className="hidden md:flex md:flex-col w-[180px] flex-shrink-0 p-4">
              <GridTypeSelector
                value={editor.state.gridType}
                onChange={editor.setGridType}
                withGap={editor.state.withGap}
                onGapChange={editor.setWithGap}
                layout="vertical"
              />
              <button
                onClick={handleReupload}
                className="mt-auto py-2.5 border border-primary/20 text-muted-foreground text-xs uppercase tracking-[0.15em] hover:border-primary/40 hover:text-foreground transition-colors duration-500"
              >
                {tDownload("reupload")}
              </button>
            </div>

            {/* Mobile toolbar */}
            <div className="md:hidden px-2 py-3 flex items-center gap-2">
              <div className="flex-1">
                <GridTypeSelector
                  value={editor.state.gridType}
                  onChange={editor.setGridType}
                  withGap={editor.state.withGap}
                  onGapChange={editor.setWithGap}
                  layout="horizontal"
                />
              </div>
              <button
                onClick={handleReupload}
                className="px-3 py-2.5 border border-secondary text-muted-foreground text-xs tracking-[0.1em] flex-shrink-0"
              >
                {tDownload("reupload")}
              </button>
            </div>

            {/* Center editor */}
            <div ref={containerRef} className="flex-1 flex items-center justify-center">
              <DynamicGridEditor
                image={image}
                gridType={editor.state.gridType}
                offsetX={editor.state.offsetX}
                offsetY={editor.state.offsetY}
                scale={editor.state.scale}
                frameWidth={editor.frameSize.width}
                frameHeight={editor.frameSize.height}
                onOffsetChange={editor.setOffset}
                onScaleChange={editor.handleScale}
              />
            </div>

            {/* Right preview — desktop */}
            <div className="hidden md:block w-[180px] flex-shrink-0 p-4">
              <GridPreview
                image={image}
                mimeType={mimeType}
                state={editor.state}
                frameWidth={editor.frameSize.width}
                frameHeight={editor.frameSize.height}
                onGenerated={handleGenerated}
              />
            </div>

            {/* Mobile generate */}
            <div className="md:hidden px-2 py-3">
              <GridPreview
                image={image}
                mimeType={mimeType}
                state={editor.state}
                frameWidth={editor.frameSize.width}
                frameHeight={editor.frameSize.height}
                onGenerated={handleGenerated}
              />
            </div>
          </div>
        )}

        {/* Step 3: Download results */}
        {step === 3 && results && (
          <div className="max-w-[600px] mx-auto w-full px-4 md:px-8 py-8">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
              {tDownload("count", { count: results.length })}
            </div>

            <div
              className="grid gap-1 mb-6"
              style={{
                gridTemplateColumns: `repeat(${getGridConfig(editor.state.gridType).cols}, 1fr)`,
              }}
            >
              {results.map((result, i) => (
                <button
                  key={result.index}
                  onClick={() => handleSaveSingle(result)}
                  className="relative aspect-square overflow-hidden group cursor-pointer"
                >
                  <img
                    src={resultUrls[i]}
                    alt={`Grid ${result.index}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-primary-foreground/0 group-hover:text-primary-foreground/80 text-xs uppercase tracking-[0.15em] transition-colors duration-300">
                      {result.index}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleDownloadAll}
              className="w-full py-3 bg-primary text-primary-foreground text-xs uppercase tracking-[0.15em] hover:bg-accent transition-colors duration-500 mb-3"
            >
              {tDownload("zip")}
            </button>
            <button
              onClick={handleReadjust}
              className="w-full py-3 border border-primary text-foreground text-xs uppercase tracking-[0.15em] hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
            >
              {tDownload("readjust")}
            </button>
            <p className="mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {tDownload("tapToSave")}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
