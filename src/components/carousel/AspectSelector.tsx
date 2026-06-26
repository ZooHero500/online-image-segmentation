"use client"

import { useTranslations } from "next-intl"
import type { AspectPreset } from "@/lib/carousel-splitter"

interface Props { value: AspectPreset; onChange: (a: AspectPreset) => void }

const OPTIONS: { key: AspectPreset; labelKey: string }[] = [
  { key: "4:5", labelKey: "ratio45" },
  { key: "1:1", labelKey: "ratio11" },
  { key: "original", labelKey: "ratioOriginal" },
]

export function AspectSelector({ value, onChange }: Props) {
  const t = useTranslations("carousel.aspect")
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{t("label")}</span>
      <div className="flex gap-1.5">
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            aria-pressed={value === o.key}
            className={
              "h-9 flex-1 rounded-md border px-2 text-sm transition " +
              (value === o.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-accent")
            }
          >
            {t(o.labelKey)}
          </button>
        ))}
      </div>
    </div>
  )
}
