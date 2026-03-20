"use client"

import { useState, useCallback } from "react"
import { AiSegmentationPanel } from "@/components/AiSegmentationPanel"
import { AiSegmentationCanvas } from "@/components/AiSegmentationCanvas"
import { UploadZone } from "@/components/UploadZone"
import type { SegmentLayer, UploadResult } from "@/types"

interface AiSegmentationProps {
  initialImageBlob?: Blob
}

export function AiSegmentation({ initialImageBlob }: AiSegmentationProps) {
  const [imageBlob, setImageBlob] = useState<Blob | null>(
    initialImageBlob ?? null
  )
  const [layers, setLayers] = useState<SegmentLayer[]>([])
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null)
  const [isolatedLayerId, setIsolatedLayerId] = useState<string | null>(null)

  const handleImageLoaded = useCallback((result: UploadResult) => {
    setImageBlob(result.file)
  }, [])

  const handleLayersChange = useCallback((newLayers: SegmentLayer[]) => {
    setLayers(newLayers)
  }, [])

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Canvas area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {imageBlob ? (
          <AiSegmentationCanvas
            imageBlob={imageBlob}
            layers={layers}
            hoveredLayerId={hoveredLayerId}
            isolatedLayerId={isolatedLayerId}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <UploadZone onImageLoaded={handleImageLoaded} />
          </div>
        )}
      </div>

      {/* Right panel */}
      <AiSegmentationPanel
        imageBlob={imageBlob}
        onLayersChange={handleLayersChange}
        onHoverLayer={setHoveredLayerId}
        onIsolateLayer={setIsolatedLayerId}
      />
    </div>
  )
}
