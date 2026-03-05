"use client"

import dynamic from "next/dynamic"

export const DynamicSplitEditor = dynamic(
  () => import("./SplitEditor").then((mod) => ({ default: mod.SplitEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        加载编辑器...
      </div>
    ),
  }
)
