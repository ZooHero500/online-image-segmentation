"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { useTransition } from "react"
import { Globe } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const localeLabels: Record<string, string> = {
  en: "English",
  "zh-CN": "中文",
}

const localeShortLabels: Record<string, string> = {
  en: "EN",
  "zh-CN": "中文",
}

export function LocaleSwitcher({
  className,
  variant = "default",
}: {
  className?: string
  variant?: "default" | "compact"
}) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleChange = (value: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: value })
    })
  }

  if (variant === "compact") {
    return (
      <div className={`relative inline-flex items-center ${className ?? ""}`}>
        <Globe className="absolute left-2 size-3.5 text-muted-foreground pointer-events-none" />
        <select
          value={locale}
          onChange={(e) => handleChange(e.target.value)}
          disabled={isPending}
          className="appearance-none bg-transparent border-0 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors duration-500 cursor-pointer outline-none pl-7 pr-1 py-1"
        >
          {routing.locales.map((loc) => (
            <option key={loc} value={loc}>
              {localeShortLabels[loc] ?? loc}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <Select value={locale} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger size="sm" className={`w-full ${className ?? ""}`}>
        <Globe className="size-3.5" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent side="top">
        {routing.locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {localeLabels[loc] ?? loc}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
