"use client"

import { useCallback, useRef, useState } from "react"
import type { UploadResult } from "@/types"

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"]
const MAX_SIZE = 20 * 1024 * 1024 // 20MB

interface UploadZoneProps {
  onImageLoaded: (result: UploadResult) => void
}

function loadImage(file: File): Promise<HTMLImageElement> {
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

export function UploadZone({ onImageLoaded }: UploadZoneProps) {
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    async (file: File) => {
      setError(null)

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("不支持的文件格式，请上传 PNG、JPG 或 WebP 格式的图片")
        return
      }

      if (file.size > MAX_SIZE) {
        setError("文件过大（超过 20MB），建议压缩后重试")
        return
      }

      try {
        const image = await loadImage(file)
        onImageLoaded({ file, image, mimeType: file.type })
      } catch {
        setError("图片加载失败，请重试")
      }
    },
    [onImageLoaded]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
      if (inputRef.current) inputRef.current.value = ""
    },
    [processFile]
  )

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors cursor-pointer ${
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-muted-foreground/50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="mt-4 text-sm text-muted-foreground">
          拖拽图片到此处，或{" "}
          <span className="text-primary font-medium">点击选择文件</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          支持 PNG、JPG、WebP，最大 20MB
        </p>
      </div>

      {error && (
        <p className="mt-4 text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
