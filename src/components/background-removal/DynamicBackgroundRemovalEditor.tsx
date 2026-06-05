"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

function EditorLoading() {
  const t = useTranslations("removeBackground")
  return (
    <div className="flex h-64 items-center justify-center text-muted-foreground">
      {t("loadingEditor")}
    </div>
  )
}

const LazyBackgroundRemovalEditor = dynamic(
  () =>
    import("./BackgroundRemovalEditor").then((mod) => ({
      default: mod.BackgroundRemovalEditor,
    })),
  {
    ssr: false,
    loading: () => <EditorLoading />,
  }
)

export function DynamicBackgroundRemovalEditor() {
  return (
    <Suspense fallback={<EditorLoading />}>
      <LazyBackgroundRemovalEditor />
    </Suspense>
  )
}
