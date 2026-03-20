"use client"

import { useCallback } from "react"
import { useRouter } from "@/i18n/navigation"
import { GridUploadZone } from "@/components/grid/GridUploadZone"
import { setPendingGridUpload } from "@/lib/pending-grid-upload"

export function GridLandingContent() {
  const router = useRouter()

  const handleImageLoaded = useCallback(
    (_img: HTMLImageElement, file: File) => {
      setPendingGridUpload(file)
      router.push("/grid/workspace")
    },
    [router]
  )

  return <GridUploadZone onImageLoaded={handleImageLoaded} />
}
