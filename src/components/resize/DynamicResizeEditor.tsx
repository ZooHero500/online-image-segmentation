"use client"

import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

function EditorLoading() {
  const t = useTranslations("resize")
  return (
    <div className="flex items-center justify-center h-64 text-muted-foreground">
      {t("loadingEditor")}
    </div>
  )
}

interface DynamicResizeEditorProps {
  initialWidth?: number
  initialHeight?: number
  initialCropAspectRatio?: number | null
}

export const DynamicResizeEditor = dynamic<DynamicResizeEditorProps>(
  () =>
    import("./ResizeEditor").then((mod) => ({ default: mod.ResizeEditor })),
  {
    ssr: false,
    loading: () => <EditorLoading />,
  }
)
