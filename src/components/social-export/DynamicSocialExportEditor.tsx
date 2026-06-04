"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

function EditorLoading() {
  const t = useTranslations("socialExport")
  return (
    <div className="flex h-64 items-center justify-center text-muted-foreground">
      {t("loadingEditor")}
    </div>
  )
}

const LazySocialExportEditor = dynamic(
  () =>
    import("./SocialExportEditor").then((mod) => ({
      default: mod.SocialExportEditor,
    })),
  {
    ssr: false,
    loading: () => <EditorLoading />,
  }
)

export function DynamicSocialExportEditor() {
  return (
    <Suspense fallback={<EditorLoading />}>
      <LazySocialExportEditor />
    </Suspense>
  )
}
