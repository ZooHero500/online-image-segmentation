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

export const DynamicResizeEditor = dynamic(
  () =>
    import("./ResizeEditor").then((mod) => ({ default: mod.ResizeEditor })),
  {
    ssr: false,
    loading: () => <EditorLoading />,
  }
)
