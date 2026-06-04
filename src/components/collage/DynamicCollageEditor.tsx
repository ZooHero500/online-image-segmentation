"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

function EditorLoading() {
  const t = useTranslations("collage")
  return (
    <div className="flex h-64 items-center justify-center text-muted-foreground">
      {t("loadingEditor")}
    </div>
  )
}

const LazyCollageEditor = dynamic(
  () =>
    import("./CollageEditor").then((mod) => ({
      default: mod.CollageEditor,
    })),
  {
    ssr: false,
    loading: () => <EditorLoading />,
  }
)

export function DynamicCollageEditor() {
  return (
    <Suspense fallback={<EditorLoading />}>
      <LazyCollageEditor />
    </Suspense>
  )
}
