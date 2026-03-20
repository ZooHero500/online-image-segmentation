"use client"

import { useTranslations } from "next-intl"
import { CheckCircle2 } from "lucide-react"

interface GridStepsProps {
  currentStep: 1 | 2 | 3
}

export function GridSteps({ currentStep }: GridStepsProps) {
  const t = useTranslations("grid.steps")

  const steps = [
    { key: 1 as const, label: t("upload") },
    { key: 2 as const, label: t("adjust") },
    { key: 3 as const, label: t("download") },
  ]

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8 py-4 md:py-6">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            {step.key < currentStep ? (
              <div className="w-6 h-6 bg-primary flex items-center justify-center">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={1.5} />
              </div>
            ) : (
              <div
                className={`w-6 h-6 flex items-center justify-center text-[11px] font-medium ${
                  step.key === currentStep
                    ? "bg-accent text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {step.key}
              </div>
            )}
            <span
              className={`text-xs uppercase tracking-[0.15em] ${
                step.key === currentStep
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`hidden md:block w-8 h-px ${
                step.key < currentStep ? "bg-primary" : "bg-secondary"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
