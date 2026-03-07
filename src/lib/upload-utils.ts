export const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"]
export const MAX_SIZE = 20 * 1024 * 1024 // 20MB per file
export const MAX_TOTAL_SIZE = 50 * 1024 * 1024 // 50MB total

interface ValidationError {
  key: "unsupportedFormat" | "fileTooLarge"
  params?: Record<string, string>
}

interface ValidationResult {
  valid: boolean
  files: File[]
  error?: ValidationError
  totalSizeWarning?: boolean
}

export function validateFiles(files: File[], existingSize: number = 0): ValidationResult {
  const validFiles: File[] = []

  for (const file of files) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return {
        valid: false,
        files: [],
        error: { key: "unsupportedFormat" },
      }
    }
    if (file.size > MAX_SIZE) {
      return {
        valid: false,
        files: [],
        error: { key: "fileTooLarge", params: { name: file.name } },
      }
    }
    validFiles.push(file)
  }

  const totalSize = validFiles.reduce((sum, f) => sum + f.size, 0)

  return {
    valid: true,
    files: validFiles,
    totalSizeWarning: totalSize + existingSize > MAX_TOTAL_SIZE,
  }
}

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load image"))
    }
    img.src = url
  })
}
