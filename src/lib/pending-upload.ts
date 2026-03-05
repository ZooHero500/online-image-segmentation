import type { UploadResult } from "@/types"

let pending: UploadResult | null = null

export function setPendingUpload(data: UploadResult) {
  pending = data
}

export function consumePendingUpload(): UploadResult | null {
  const d = pending
  pending = null
  return d
}
