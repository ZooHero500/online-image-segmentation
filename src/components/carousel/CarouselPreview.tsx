"use client"

import { useEffect, useState } from "react"
import type { CarouselSlide } from "@/lib/carousel-splitter"

export function CarouselPreview({ slides }: { slides: CarouselSlide[] }) {
  const [urls, setUrls] = useState<string[]>([])
  useEffect(() => {
    const next = slides.map((s) => URL.createObjectURL(s.blob))
    setUrls(next)
    return () => next.forEach((u) => URL.revokeObjectURL(u))
  }, [slides])
  return (
    <div className="flex overflow-x-auto rounded-md border border-border">
      {urls.map((u, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={u} alt={`slide ${i + 1}`} className="h-32 w-auto shrink-0" />
      ))}
    </div>
  )
}
