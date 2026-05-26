// src/components/compress/DynamicCompressEditor.tsx
"use client"

import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

function EditorLoading() {
  const t = useTranslations("compress")
  return (
    <div className="flex items-center justify-center h-64 text-muted-foreground">
      {t("loadingEditor")}
    </div>
  )
}

export const DynamicCompressEditor = dynamic(
  () =>
    import("./CompressEditor").then((mod) => ({
      default: mod.CompressEditor,
    })),
  {
    ssr: false,
    loading: () => <EditorLoading />,
  }
)
