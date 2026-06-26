let pendingFile: File | null = null

export function setPendingCarouselUpload(file: File) {
  pendingFile = file
}

export function consumePendingCarouselUpload(): File | null {
  const f = pendingFile
  pendingFile = null
  return f
}
