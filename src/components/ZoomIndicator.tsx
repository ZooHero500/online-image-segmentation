"use client"

import { useCallback, useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ZoomIndicatorProps {
  zoomPercent: number
  onFitToView: () => void
  onResetTo100: () => void
  onZoomChange: (percent: number) => void
}

export function ZoomIndicator({
  zoomPercent,
  onFitToView,
  onResetTo100,
  onZoomChange,
}: ZoomIndicatorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleClick = useCallback(() => {
    setInputValue(String(zoomPercent))
    setIsEditing(true)
  }, [zoomPercent])

  const handleSubmit = useCallback(() => {
    const val = parseInt(inputValue, 10)
    if (!isNaN(val) && val >= 10 && val <= 1000) {
      onZoomChange(val)
    }
    setIsEditing(false)
  }, [inputValue, onZoomChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit()
      if (e.key === "Escape") setIsEditing(false)
    },
    [handleSubmit]
  )

  return (
    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm border rounded-md px-2 py-1 text-xs z-10">
      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={onFitToView}>
        Fit
      </Button>
      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={onResetTo100}>
        100%
      </Button>
      <div className="w-px h-4 bg-border mx-1" />
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          className="w-12 h-6 text-center text-xs bg-transparent border rounded px-1"
        />
      ) : (
        <button
          onClick={handleClick}
          className="h-6 px-2 text-xs hover:bg-accent rounded cursor-pointer"
        >
          {zoomPercent}%
        </button>
      )}
    </div>
  )
}
