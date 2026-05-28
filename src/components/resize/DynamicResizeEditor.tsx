"use client"

import { Suspense } from "react"
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

const LazyResizeEditor = dynamic(
  () =>
    import("./ResizeEditor").then((mod) => ({ default: mod.ResizeEditor })),
  {
    ssr: false,
    loading: () => <EditorLoading />,
  }
)

export function DynamicResizeEditor() {
  return (
    <Suspense fallback={<EditorLoading />}>
      <LazyResizeEditor />
    </Suspense>
  )
}
