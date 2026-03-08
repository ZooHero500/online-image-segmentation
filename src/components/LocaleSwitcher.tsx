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

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleChange = (value: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: value })
    })
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
