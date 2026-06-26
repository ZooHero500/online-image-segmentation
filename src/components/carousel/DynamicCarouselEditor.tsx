"use client"

import dynamic from "next/dynamic"

export const DynamicCarouselEditor = dynamic(
  () => import("./CarouselEditor").then((mod) => ({ default: mod.CarouselEditor })),
  { ssr: false }
)
