"use client"

import { useCallback, useRef } from "react"
import { DynamicSplitEditor } from "@/components/DynamicSplitEditor"
import { toast } from "sonner"
import Link from "next/link"

export function LandingContent() {
  const hasGuidedRef = useRef(false)

  const showGuide = useCallback(() => {
    if (hasGuidedRef.current) return
    hasGuidedRef.current = true
    toast(
      <div className="flex items-center gap-3">
        <span>进入操作台管理历史记录和多图操作</span>
        <Link
          href="/workspace"
          className="text-primary font-medium hover:underline whitespace-nowrap"
        >
          进入操作台
        </Link>
      </div>,
      { duration: 8000 }
    )
  }, [])

  const handleSplitComplete = useCallback(
    (isFirstSplit: boolean) => {
      if (isFirstSplit) showGuide()
    },
    [showGuide]
  )

  const handleImageUpload = useCallback(
    (uploadCount: number) => {
      if (uploadCount >= 2) showGuide()
    },
    [showGuide]
  )

  return (
    <DynamicSplitEditor
      onSplitComplete={handleSplitComplete}
      onImageUpload={handleImageUpload}
      showShortcutHints
    />
  )
}
