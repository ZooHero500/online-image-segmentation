"use client"

import { useCallback, useState } from "react"
import { DynamicSplitEditor } from "@/components/DynamicSplitEditor"
import { AiSegmentation } from "@/components/AiSegmentation"
import { HistorySidebar } from "@/components/HistorySidebar"
import { useHistory } from "@/hooks/use-history"
import type { SplitLine } from "@/types"

type WorkspaceMode = "manual" | "ai"

interface EditorState {
  imageBlob: Blob
  lines: SplitLine[]
  originalFileName: string
  originalMimeType: string
  images?: Array<{ blob: Blob; fileName: string; mimeType: string }>
}

export default function WorkspacePage() {
  const [mode, setMode] = useState<WorkspaceMode>("manual")
  const [editorKey, setEditorKey] = useState(0)
  const [initialState, setInitialState] = useState<EditorState | undefined>()
  const { saveCurrentWork } = useHistory()

  const handleLoadRecord = useCallback((record: EditorState) => {
    setInitialState(record)
    setEditorKey((k) => k + 1)
    setMode("manual")
  }, [])

  const handleNewCanvas = useCallback(() => {
    setInitialState(undefined)
    setEditorKey((k) => k + 1)
    setMode("manual")
  }, [])

  const handleSaveHistory = useCallback(
    async (data: {
      originalFileName: string
      originalMimeType: string
      lines: SplitLine[]
      imageBlob: Blob
      thumbnailDataUrl: string
      images?: Array<{ blob: Blob; fileName: string; mimeType: string }>
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
        mode={mode}
        onSwitchMode={setMode}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {mode === "manual" ? (
          <div className="flex-1 flex flex-col overflow-hidden p-4">
            <DynamicSplitEditor
              key={editorKey}
              initialState={initialState}
              onSaveHistory={handleSaveHistory}
              showShortcutHints
            />
          </div>
        ) : (
          <AiSegmentation />
        )}
      </main>
    </div>
  )
}
