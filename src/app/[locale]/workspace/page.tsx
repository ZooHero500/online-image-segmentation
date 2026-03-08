"use client"

import { useCallback, useState } from "react"
import { DynamicSplitEditor } from "@/components/DynamicSplitEditor"
import { HistorySidebar } from "@/components/HistorySidebar"
import { useHistory } from "@/hooks/use-history"
import type { SplitLine } from "@/types"

interface EditorState {
  imageBlob: Blob
  lines: SplitLine[]
  originalFileName: string
  originalMimeType: string
}

export default function WorkspacePage() {
  const [editorKey, setEditorKey] = useState(0)
  const [initialState, setInitialState] = useState<EditorState | undefined>()
  const { saveCurrentWork } = useHistory()

  const handleLoadRecord = useCallback((record: EditorState) => {
    setInitialState(record)
    setEditorKey((k) => k + 1)
  }, [])

  const handleNewCanvas = useCallback(() => {
    setInitialState(undefined)
    setEditorKey((k) => k + 1)
  }, [])

  const handleSaveHistory = useCallback(
    async (data: {
      originalFileName: string
      originalMimeType: string
      lines: SplitLine[]
      imageBlob: Blob
      thumbnailDataUrl: string
    }) => {
      await saveCurrentWork(data)
    },
    [saveCurrentWork]
  )

  return (
    <div className="flex h-screen">
      <HistorySidebar
        onLoadRecord={handleLoadRecord}
        onNewCanvas={handleNewCanvas}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden p-4">
          <DynamicSplitEditor
            key={editorKey}
            initialState={initialState}
            onSaveHistory={handleSaveHistory}
            showShortcutHints
          />
        </div>
      </main>
    </div>
  )
}
