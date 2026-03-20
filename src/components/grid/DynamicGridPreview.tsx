"use client"

import dynamic from "next/dynamic"

export const DynamicGridPreview = dynamic(
  () => import("./GridPreview").then((mod) => ({ default: mod.GridPreview })),
  { ssr: false }
)
