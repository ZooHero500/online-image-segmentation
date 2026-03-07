"use client"

import { useCallback } from "react"
import { useRouter } from "@/i18n/navigation"
import { UploadZone } from "@/components/UploadZone"
import { setPendingUpload } from "@/lib/pending-upload"
import type { UploadResult } from "@/types"

export function LandingContent() {
  const router = useRouter()

  const handleImagesLoaded = useCallback(
    (results: UploadResult[]) => {
      setPendingUpload(results)
      router.push("/workspace")
    },
    [router]
  )

  return <UploadZone onImagesLoaded={handleImagesLoaded} />
}
