"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { db } from "@/lib/storage-service"
import { ArrowRight } from "lucide-react"

interface SmartCTAProps {
  label: string
  className?: string
}

export function SmartCTA({ label, className }: SmartCTAProps) {
  const router = useRouter()
  const [hasHistory, setHasHistory] = useState(false)

  useEffect(() => {
    db.history.count().then((count) => setHasHistory(count > 0))
  }, [])

  const handleClick = useCallback(() => {
    if (hasHistory) {
      router.push("/workspace")
    } else {
      document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" })
    }
  }, [hasHistory, router])

  return (
    <button
      onClick={handleClick}
      className={className}
    >
      <span className="absolute inset-0 bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
      <span className="relative z-10">{label}</span>
      <ArrowRight className="relative z-10 h-3 w-3" />
    </button>
  )
}
