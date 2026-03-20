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
    <div className="border-t border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start justify-between gap-4 py-6 text-left group"
      >
        <h3
          className={`text-sm font-medium transition-colors duration-500 ${
            isOpen ? "text-accent" : "text-foreground group-hover:text-accent"
          }`}
        >
          {question}
        </h3>
        <div
          className={`shrink-0 w-6 h-6 border flex items-center justify-center transition-all duration-500 ${
            isOpen
              ? "border-accent rotate-45"
              : "border-primary/20 rotate-0 group-hover:border-accent"
          }`}
        >
          <Plus className="h-3 w-3 text-foreground" strokeWidth={1.5} />
        </div>
      </button>
      <div className="accordion-body" data-open={isOpen}>
        <div>
          <div className={`pb-6 transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}>
            <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
