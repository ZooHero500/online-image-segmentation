"use client"

import dynamic from "next/dynamic"

export const DynamicGridEditor = dynamic(
  () => import("./GridEditor").then((mod) => ({ default: mod.GridEditor })),
  { ssr: false }
)
