"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

function EditorLoading() {
  const t = useTranslations("watermark")
  return (
    <div className="flex h-64 items-center justify-center text-muted-foreground">
      {t("loadingEditor")}
    </div>
  )
}

const LazyWatermarkEditor = dynamic(
  () =>
    import("./WatermarkEditor").then((mod) => ({
      default: mod.WatermarkEditor,
    })),
  {
    ssr: false,
    loading: () => <EditorLoading />,
  }
)

export function DynamicWatermarkEditor() {
  return (
    <Suspense fallback={<EditorLoading />}>
      <LazyWatermarkEditor />
    </Suspense>
  )
}
