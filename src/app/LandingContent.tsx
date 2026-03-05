"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { UploadZone } from "@/components/UploadZone"
import { setPendingUpload } from "@/lib/pending-upload"
import type { UploadResult } from "@/types"

export function LandingContent() {
  const router = useRouter()

  const handleImageLoaded = useCallback(
    (result: UploadResult) => {
      setPendingUpload(result)
      router.push("/workspace")
    },
    [router]
  )

  return <UploadZone onImageLoaded={handleImageLoaded} />
}
