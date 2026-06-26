"use client"

import { useTranslations } from "next-intl"
import { CheckCircle2 } from "lucide-react"

interface CarouselStepsProps {
  step: 1 | 2 | 3
}

export function CarouselSteps({ step }: CarouselStepsProps) {
  const t = useTranslations("carousel.steps")

  const steps = [
    { key: 1 as const, label: t("upload") },
    { key: 2 as const, label: t("adjust") },
    { key: 3 as const, label: t("download") },
  ]

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8 py-4 md:py-6">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            {s.key < step ? (
              <div className="w-6 h-6 bg-primary flex items-center justify-center">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={1.5} />
              </div>
            ) : (
              <div
                className={`w-6 h-6 flex items-center justify-center text-[11px] font-medium ${
                  s.key === step
                    ? "bg-accent text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {s.key}
              </div>
            )}
            <span
              className={`text-xs uppercase tracking-[0.15em] ${
                s.key === step
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`hidden md:block w-8 h-px ${
                s.key < step ? "bg-primary" : "bg-secondary"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
