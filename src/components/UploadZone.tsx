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
      className={`group flex flex-col items-center justify-center border-t border-b p-16 md:p-24 transition-all duration-700 ease-luxury cursor-pointer ${
        isDragOver
          ? "border-[#D4AF37] bg-[#D4AF37]/5"
          : "border-[#1A1A1A]/20 hover:border-[#1A1A1A]/40"
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
        <p className="text-xs uppercase tracking-[0.3em] text-[#6C6863] mb-6">
          上传图片
        </p>
        <p className="font-serif text-2xl md:text-3xl text-[#1A1A1A] mb-4">
          拖拽图片到此处
        </p>
        <div className="flex items-center gap-4 justify-center mb-6">
          <span className="h-px w-8 bg-[#1A1A1A]/20" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#6C6863]">或</span>
          <span className="h-px w-8 bg-[#1A1A1A]/20" />
        </div>
        <p className="text-sm text-[#1A1A1A] group-hover:text-[#D4AF37] transition-colors duration-500">
          点击选择文件
        </p>
        <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-[#6C6863]/70">
          PNG / JPG / WebP &middot; 最大 20MB
        </p>
      </div>

      {error && (
        <p className="mt-6 text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
