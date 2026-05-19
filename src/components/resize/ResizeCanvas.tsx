"use client"

import { useRef, useCallback, useEffect, useState } from "react"
import { Stage, Layer, Rect, Image, Transformer, Group } from "@/lib/konva"
import { useTranslations } from "next-intl"
import { Upload } from "lucide-react"
import { ACCEPTED_TYPES } from "@/lib/upload-utils"
import type { ResizeImageTransform, ResizeEditorMode, CropRect } from "@/types"
import type Konva from "konva"
import { CropOverlay } from "./CropOverlay"

interface ResizeCanvasProps {
  canvasWidth: number
  canvasHeight: number
  image: HTMLImageElement | null
  transform: ResizeImageTransform
  onTransformChange: (t: ResizeImageTransform) => void
  mode: ResizeEditorMode
  onModeChange: (m: ResizeEditorMode) => void
  cropRect: CropRect | null
  onCropRectChange: (r: CropRect | null) => void
  onImageFile: (file: File) => void
}

const ARTBOARD_PADDING = 40

export function ResizeCanvas({
  canvasWidth,
  canvasHeight,
  image,
  transform,
  onTransformChange,
  mode,
  onModeChange,
  cropRect,
  onCropRectChange,
  onImageFile,
}: ResizeCanvasProps) {
  const t = useTranslations("resize")
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const imageRef = useRef<Konva.Image>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })
  const [isDragOver, setIsDragOver] = useState(false)

  // Observe container size
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Calculate artboard display scale and position
  const viewScale = Math.min(
    (containerSize.width - ARTBOARD_PADDING * 2) / canvasWidth,
    (containerSize.height - ARTBOARD_PADDING * 2) / canvasHeight,
    1
  )
  const artboardDisplayW = canvasWidth * viewScale
  const artboardDisplayH = canvasHeight * viewScale
  const artboardX = (containerSize.width - artboardDisplayW) / 2
  const artboardY = (containerSize.height - artboardDisplayH) / 2

  // Attach transformer to image when selected
  useEffect(() => {
    if (mode === "selected" && imageRef.current && transformerRef.current) {
      transformerRef.current.nodes([imageRef.current])
      transformerRef.current.getLayer()?.batchDraw()
    } else if (transformerRef.current) {
      transformerRef.current.nodes([])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [mode])

  // Image display dimensions
  const srcW = transform.crop ? transform.crop.width : image?.naturalWidth ?? 0
  const srcH = transform.crop ? transform.crop.height : image?.naturalHeight ?? 0
  const displayW = srcW * transform.scale
  const displayH = srcH * transform.scale

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.target === e.target.getStage() || e.target.name() === "artboard") {
        if (mode === "selected") {
          onModeChange("idle")
        }
      }
    },
    [mode, onModeChange]
  )

  const handleImageClick = useCallback(() => {
    if (mode === "idle") {
      onModeChange("selected")
    }
  }, [mode, onModeChange])

  const handleImageDblClick = useCallback(() => {
    if (!image) return
    const imgLeft = transform.x
    const imgTop = transform.y
    const imgRight = transform.x + displayW
    const imgBottom = transform.y + displayH

    const cropX = Math.max(0, imgLeft)
    const cropY = Math.max(0, imgTop)
    const cropRight = Math.min(canvasWidth, imgRight)
    const cropBottom = Math.min(canvasHeight, imgBottom)

    onCropRectChange({
      x: cropX,
      y: cropY,
      width: Math.max(20, cropRight - cropX),
      height: Math.max(20, cropBottom - cropY),
    })
    onModeChange("crop")
  }, [image, transform, displayW, displayH, canvasWidth, canvasHeight, onCropRectChange, onModeChange])

  const handleImageDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      // Convert stage position back to artboard coordinates
      const newX = (e.target.x() - artboardX) / viewScale
      const newY = (e.target.y() - artboardY) / viewScale
      onTransformChange({
        ...transform,
        x: newX,
        y: newY,
      })
    },
    [transform, onTransformChange, artboardX, artboardY, viewScale]
  )

  const handleTransformEnd = useCallback(() => {
    const node = imageRef.current
    if (!node) return

    const scaleX = node.scaleX()
    const newScale = transform.scale * scaleX

    const newX = (node.x() - artboardX) / viewScale
    const newY = (node.y() - artboardY) / viewScale

    onTransformChange({
      ...transform,
      x: newX,
      y: newY,
      scale: newScale,
    })

    node.scaleX(1)
    node.scaleY(1)
  }, [transform, onTransformChange, artboardX, artboardY, viewScale])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file && ACCEPTED_TYPES.includes(file.type)) {
        onImageFile(file)
      }
    },
    [onImageFile]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) onImageFile(file)
      if (inputRef.current) inputRef.current.value = ""
    },
    [onImageFile]
  )

  return (
    <div
      ref={containerRef}
      className="flex-1 relative bg-muted/30 overflow-hidden"
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        setIsDragOver(false)
      }}
    >
      {isDragOver && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-accent/10 border-2 border-dashed border-accent pointer-events-none">
          <p className="text-accent text-sm uppercase tracking-wider">{t("uploadHint")}</p>
        </div>
      )}

      {!image && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-1">{t("uploadHint")}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
            {t("uploadFormats")}
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={handleFileChange}
      />

      <Stage
        ref={stageRef}
        width={containerSize.width}
        height={containerSize.height}
        onClick={handleStageClick}
      >
        <Layer>
          <Rect
            name="artboard"
            x={artboardX}
            y={artboardY}
            width={artboardDisplayW}
            height={artboardDisplayH}
            fill="#ffffff"
            shadowColor="rgba(0,0,0,0.1)"
            shadowBlur={10}
            shadowOffsetY={2}
          />

          {image && (
            <Group
              clipX={artboardX}
              clipY={artboardY}
              clipWidth={artboardDisplayW}
              clipHeight={artboardDisplayH}
            >
              <Image
                ref={imageRef}
                image={image}
                x={artboardX + transform.x * viewScale}
                y={artboardY + transform.y * viewScale}
                width={displayW * viewScale}
                height={displayH * viewScale}
                crop={
                  transform.crop
                    ? {
                        x: transform.crop.x,
                        y: transform.crop.y,
                        width: transform.crop.width,
                        height: transform.crop.height,
                      }
                    : undefined
                }
                draggable={mode !== "crop"}
                onClick={handleImageClick}
                onDblClick={handleImageDblClick}
                onDragEnd={handleImageDragEnd}
              />
            </Group>
          )}

          {mode === "selected" && (
            <Transformer
              ref={transformerRef}
              rotateEnabled={false}
              enabledAnchors={[
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
              ]}
              keepRatio={true}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 20 || newBox.height < 20) {
                  return oldBox
                }
                return newBox
              }}
              onTransformEnd={handleTransformEnd}
            />
          )}

          {mode === "crop" && cropRect && image && (
            <CropOverlay
              cropRect={{
                x: artboardX + cropRect.x * viewScale,
                y: artboardY + cropRect.y * viewScale,
                width: cropRect.width * viewScale,
                height: cropRect.height * viewScale,
              }}
              imageBounds={{
                x: artboardX + transform.x * viewScale,
                y: artboardY + transform.y * viewScale,
                width: displayW * viewScale,
                height: displayH * viewScale,
              }}
              onCropChange={(displayRect) => {
                onCropRectChange({
                  x: (displayRect.x - artboardX) / viewScale,
                  y: (displayRect.y - artboardY) / viewScale,
                  width: displayRect.width / viewScale,
                  height: displayRect.height / viewScale,
                })
              }}
            />
          )}
        </Layer>
      </Stage>
    </div>
  )
}
