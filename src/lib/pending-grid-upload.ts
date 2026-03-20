let pendingFile: File | null = null

export function setPendingGridUpload(file: File) {
  pendingFile = file
}

export function consumePendingGridUpload(): File | null {
  const f = pendingFile
  pendingFile = null
  return f
}
