"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

function EditorLoading() {
  const t = useTranslations("mosaic")
  return (
    <div className="flex h-64 items-center justify-center text-muted-foreground">
      {t("loadingEditor")}
    </div>
  )
}

const LazyMosaicEditor = dynamic(
  () =>
    import("./MosaicEditor").then((mod) => ({
      default: mod.MosaicEditor,
    })),
  {
    ssr: false,
    loading: () => <EditorLoading />,
  }
)

export function DynamicMosaicEditor() {
  return (
    <Suspense fallback={<EditorLoading />}>
      <LazyMosaicEditor />
    </Suspense>
  )
}
