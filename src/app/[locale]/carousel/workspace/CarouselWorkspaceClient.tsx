"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { LogoIcon } from "@/components/LogoIcon"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { CarouselSteps } from "@/components/carousel/CarouselSteps"
import { CarouselUploadZone } from "@/components/carousel/CarouselUploadZone"
import { CarouselCountSelector } from "@/components/carousel/CarouselCountSelector"
import { AspectSelector } from "@/components/carousel/AspectSelector"
import { DynamicCarouselEditor } from "@/components/carousel/DynamicCarouselEditor"
import { CarouselPreview } from "@/components/carousel/CarouselPreview"
import { useCarouselEditor } from "@/hooks/use-carousel-editor"
import { splitCarousel } from "@/lib/carousel-splitter"
import { consumePendingCarouselUpload } from "@/lib/pending-carousel-upload"
import { loadImage } from "@/lib/upload-utils"
import type { CarouselSlide } from "@/lib/carousel-splitter"

type Step = 1 | 2 | 3

export function CarouselWorkspaceClient() {
  const tDownload = useTranslations("carousel.download")

  const [step, setStep] = useState<Step>(1)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [mimeType, setMimeType] = useState<string>("image/png")
  const [slides, setSlides] = useState<CarouselSlide[] | null>(null)
  const [generating, setGenerating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 400, height: 400 })
  const pendingConsumed = useRef(false)

  const editor = useCarouselEditor(
    image ? { width: image.naturalWidth, height: image.naturalHeight } : { width: 1, height: 1 },
    containerSize
  )

  // Consume pending upload on mount
  useEffect(() => {
    if (pendingConsumed.current) return
    pendingConsumed.current = true
    const file = consumePendingCarouselUpload()
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
    setSlides(null)
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
    setSlides(null)
    setStep(1)
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!image) return
    setGenerating(true)
    try {
      const result = await splitCarousel(
        image,
        editor.state,
        { displayWidth: editor.frameSize.width, displayHeight: editor.frameSize.height },
        mimeType,
      )
      setSlides(result)
      setStep(3)
    } finally {
      setGenerating(false)
    }
  }, [image, editor.state, editor.frameSize.width, editor.frameSize.height, mimeType])

  const handleReadjust = useCallback(() => {
    setSlides(null)
    setStep(2)
  }, [])

  const slideUrls = useMemo(() => {
    if (!slides) return []
    return slides.map((s) => URL.createObjectURL(s.blob))
  }, [slides])

  useEffect(() => {
    return () => {
      slideUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [slideUrls])

  const handleSaveSingle = useCallback(
    (slide: CarouselSlide, index: number) => {
      const ext = mimeType === "image/jpeg" ? "jpg" : "png"
      const url = URL.createObjectURL(slide.blob)
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      if (isIOS) {
        window.open(url, "_blank")
      } else {
        const a = document.createElement("a")
        a.href = url
        a.download = `carousel-${index + 1}.${ext}`
        a.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }
    },
    [mimeType]
  )

  const handleDownloadAll = useCallback(async () => {
    if (!slides) return
    const { exportCarouselAsZip, getCarouselZipFileName } = await import("@/lib/zip-exporter")
    const ext = mimeType === "image/jpeg" ? "jpg" : "png"
    const zipBlob = await exportCarouselAsZip(slides.map((s) => s.blob), ext)
    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = getCarouselZipFileName()
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }, [slides, mimeType])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-[1600px] mx-auto px-4 md:px-16 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/carousel" className="flex items-center gap-3">
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

      <CarouselSteps step={step} />

      <div className="flex-1 flex flex-col">
        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="max-w-[800px] mx-auto w-full px-4 md:px-8 py-8">
            <CarouselUploadZone onImageLoaded={handleImageLoaded} />
          </div>
        )}

        {/* Step 2: Adjust */}
        {step === 2 && image && (
          <div className="flex-1 flex flex-col md:flex-row gap-0 max-w-[1400px] mx-auto w-full">
            {/* Left sidebar — desktop */}
            <div className="hidden md:flex md:flex-col w-[200px] flex-shrink-0 p-4 gap-4">
              <CarouselCountSelector
                value={editor.state.slideCount}
                onChange={editor.setSlideCount}
              />
              <AspectSelector
                value={editor.state.aspect}
                onChange={editor.setAspect}
              />
              <button
                onClick={handleReupload}
                className="mt-auto py-2.5 border border-primary/20 text-muted-foreground text-xs uppercase tracking-[0.15em] hover:border-primary/40 hover:text-foreground transition-colors duration-500"
              >
                {tDownload("reupload")}
              </button>
            </div>

            {/* Mobile toolbar */}
            <div className="md:hidden px-2 py-3 flex flex-col gap-3">
              <div className="flex flex-col gap-3">
                <CarouselCountSelector
                  value={editor.state.slideCount}
                  onChange={editor.setSlideCount}
                />
                <AspectSelector
                  value={editor.state.aspect}
                  onChange={editor.setAspect}
                />
              </div>
              <button
                onClick={handleReupload}
                className="px-3 py-2.5 border border-secondary text-muted-foreground text-xs tracking-[0.1em] self-start"
              >
                {tDownload("reupload")}
              </button>
            </div>

            {/* Center editor */}
            <div ref={containerRef} className="flex-1 flex items-center justify-center">
              <DynamicCarouselEditor
                image={image}
                imageUrl={imageUrl}
                frameSize={editor.frameSize}
                state={editor.state}
                scaleRange={editor.scaleRange}
                onOffsetChange={editor.setOffset}
                onScaleChange={editor.handleScale}
                slideCount={editor.state.slideCount}
              />
            </div>

            {/* Right preview — desktop */}
            <div className="hidden md:flex md:flex-col w-[200px] flex-shrink-0 p-4 gap-4 justify-between">
              <div className="flex-1 flex items-center justify-center">
                {/* Preview placeholder on desktop — shown below on mobile */}
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-3 bg-primary text-primary-foreground text-xs uppercase tracking-[0.15em] hover:bg-accent transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? tDownload("generating") : tDownload("generate")}
              </button>
            </div>

            {/* Mobile generate */}
            <div className="md:hidden px-2 py-3">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-3 bg-primary text-primary-foreground text-xs uppercase tracking-[0.15em] hover:bg-accent transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? tDownload("generating") : tDownload("generate")}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Download results */}
        {step === 3 && slides && (
          <div className="max-w-[800px] mx-auto w-full px-4 md:px-8 py-8">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
              {tDownload("count", { count: slides.length })}
            </div>

            {/* Carousel preview strip */}
            <div className="mb-6">
              <CarouselPreview slides={slides} />
            </div>

            {/* Individual slide grid */}
            <div
              className="grid gap-1 mb-6"
              style={{
                gridTemplateColumns: `repeat(${Math.min(slides.length, 5)}, 1fr)`,
              }}
            >
              {slides.map((slide, i) => (
                <button
                  key={slide.index}
                  onClick={() => handleSaveSingle(slide, i)}
                  className="relative aspect-square overflow-hidden group cursor-pointer"
                >
                  <img
                    src={slideUrls[i]}
                    alt={`Slide ${slide.index}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-primary-foreground/0 group-hover:text-primary-foreground/80 text-xs uppercase tracking-[0.15em] transition-colors duration-300">
                      {slide.index}
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
