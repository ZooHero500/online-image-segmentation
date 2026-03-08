"use client"

import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

function EditorLoading() {
  const t = useTranslations("workspace")
  return (
    <div className="flex items-center justify-center h-64 text-muted-foreground">
      {t("loadingEditor")}
    </div>
  )
}

export const DynamicSplitEditor = dynamic(
  () => import("./SplitEditor").then((mod) => ({ default: mod.SplitEditor })),
  {
    ssr: false,
    loading: () => <EditorLoading />,
  }
)
