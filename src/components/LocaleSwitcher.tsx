"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { useTransition } from "react"

const localeLabels: Record<string, string> = {
  en: "EN",
  "zh-CN": "中文",
}

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleSwitch = (nextLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
    })
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleSwitch(loc)}
          disabled={isPending}
          className={`px-2 py-1 uppercase tracking-[0.15em] transition-colors duration-500 ${
            locale === loc
              ? "text-[#D4AF37] font-medium"
              : "text-[#6C6863] hover:text-[#1A1A1A]"
          } ${isPending ? "opacity-50" : ""}`}
        >
          {localeLabels[loc] ?? loc}
        </button>
      ))}
    </div>
  )
}
