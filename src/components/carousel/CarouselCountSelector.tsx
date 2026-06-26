"use client"

import { useTranslations } from "next-intl"
import { MIN_SLIDES, MAX_SLIDES } from "@/lib/carousel-splitter"

interface Props { value: number; onChange: (n: number) => void }

export function CarouselCountSelector({ value, onChange }: Props) {
  const t = useTranslations("carousel.count")
  const counts = Array.from({ length: MAX_SLIDES - MIN_SLIDES + 1 }, (_, i) => MIN_SLIDES + i)
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{t("label")}</span>
      <div className="flex flex-wrap gap-1.5">
        {counts.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-pressed={value === n}
            className={
              "h-9 w-9 rounded-md border text-sm transition " +
              (value === n
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-accent")
            }
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
