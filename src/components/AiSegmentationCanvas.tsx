"use client"

import { useRef, useEffect, useMemo, useState } from "react"
import { Stage, Layer, Image as KonvaImage } from "react-konva"
import type { SegmentLayer } from "@/types"

interface AiSegmentationCanvasProps {
  imageBlob: Blob | null
  layers: SegmentLayer[]
  hoveredLayerId: string | null
  isolatedLayerId: string | null
}

const MASK_OPACITY = 0.3
const MASK_HOVER_OPACITY = 0.6

export function AiSegmentationCanvas({
  imageBlob,
  layers,
  hoveredLayerId,
  isolatedLayerId,
}: AiSegmentationCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [mainImage, setMainImage] = useState<HTMLImageElement | null>(null)

  // Load main image from blob
  useEffect(() => {
    if (!imageBlob) return
    const url = URL.createObjectURL(imageBlob)
    const img = new Image()
    img.onload = () => setMainImage(img)
    img.src = url
    return () => URL.revokeObjectURL(url)
  }, [imageBlob])

  // Track container size
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setContainerSize({ width, height })
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Calculate scale to fit image in container
  const scale = useMemo(() => {
    if (!mainImage || !containerSize.width || !containerSize.height) return 1
    const scaleX = containerSize.width / mainImage.width
    const scaleY = containerSize.height / mainImage.height
    return Math.min(scaleX, scaleY, 1) * 0.9 // 90% to leave padding
  }, [mainImage, containerSize])

  // Calculate offset to center image
  const offset = useMemo(() => {
    if (!mainImage) return { x: 0, y: 0 }
    const scaledW = mainImage.width * scale
    const scaledH = mainImage.height * scale
    return {
      x: (containerSize.width - scaledW) / 2,
      y: (containerSize.height - scaledH) / 2,
    }
  }, [mainImage, containerSize, scale])

  // Determine which layers to show
  const visibleLayers = useMemo(() => {
    if (isolatedLayerId) {
      return layers.filter((l) => l.id === isolatedLayerId && l.maskImage)
    }
    return layers.filter((l) => l.visible && l.maskImage)
  }, [layers, isolatedLayerId])

  return (
    <div ref={containerRef} className="flex-1 bg-muted/30 relative overflow-hidden">
      {containerSize.width > 0 && containerSize.height > 0 && (
        <Stage width={containerSize.width} height={containerSize.height}>
          <Layer>
            {/* Main image */}
            {mainImage && (
              <KonvaImage
                image={mainImage}
                x={offset.x}
                y={offset.y}
                width={mainImage.width * scale}
                height={mainImage.height * scale}
              />
            )}

            {/* Mask overlays */}
            {visibleLayers.map((layer) => (
              <KonvaImage
                key={layer.id}
                image={layer.maskImage!}
                x={offset.x}
                y={offset.y}
                width={mainImage ? mainImage.width * scale : 0}
                height={mainImage ? mainImage.height * scale : 0}
                opacity={
                  hoveredLayerId === layer.id
                    ? MASK_HOVER_OPACITY
                    : isolatedLayerId
                      ? 1
                      : MASK_OPACITY
                }
              />
            ))}
          </Layer>
        </Stage>
      )}
    </div>
  )
}
