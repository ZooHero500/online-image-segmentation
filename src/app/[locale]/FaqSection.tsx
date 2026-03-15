"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

export function FaqItem({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-t border-[#1A1A1A]/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start justify-between gap-4 py-6 text-left group"
      >
        <h3
          className={`text-sm font-medium transition-colors duration-500 ${
            isOpen ? "text-[#D4AF37]" : "text-[#1A1A1A] group-hover:text-[#D4AF37]"
          }`}
        >
          {question}
        </h3>
        <div
          className={`shrink-0 w-6 h-6 border flex items-center justify-center transition-all duration-500 ${
            isOpen
              ? "border-[#D4AF37] rotate-45"
              : "border-[#1A1A1A]/20 rotate-0 group-hover:border-[#D4AF37]"
          }`}
        >
          <Plus className="h-3 w-3 text-[#1A1A1A]" strokeWidth={1.5} />
        </div>
      </button>
      {isOpen && (
        <div className="pb-6 animate-fade-in-down">
          <p className="text-sm text-[#6C6863] leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}
