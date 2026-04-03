"use client"

import { useCallback, useState } from "react"
import { Menu } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { DynamicSplitEditor } from "@/components/DynamicSplitEditor"
import { HistorySidebar } from "@/components/HistorySidebar"
import { LogoIcon } from "@/components/LogoIcon"
import { useHistory } from "@/hooks/use-history"
import type { SplitLine } from "@/types"

interface EditorState {
  imageBlob: Blob
  lines: SplitLine[]
  originalFileName: string
  originalMimeType: string
  images?: Array<{ blob: Blob; fileName: string; mimeType: string }>
}

export default function WorkspacePage() {
  const [editorKey, setEditorKey] = useState(0)
  const [initialState, setInitialState] = useState<EditorState | undefined>()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { saveCurrentWork } = useHistory()
  const t = useTranslations("history")

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
      images?: Array<{ blob: Blob; fileName: string; mimeType: string }>
    }) => {
      const result = await saveCurrentWork(data)
      if (!result.success) {
        if (result.error === "quota_exceeded") {
          toast.error(t("saveFailed.quotaExceeded"))
        } else if (result.error === "blob_storage_failed") {
          toast.error(t("saveFailed.blobFailed"))
        } else {
          toast.error(t("saveFailed.unknown"))
        }
      }
    },
    [saveCurrentWork, t]
  )

  return (
    <div className="flex h-screen">
      <HistorySidebar
        onLoadRecord={handleLoadRecord}
        onNewCanvas={handleNewCanvas}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-2 border-b md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Menu"
            className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground"
          >
            <Menu className="h-4 w-4" />
          </button>
          <LogoIcon className="h-3.5 w-3.5 text-foreground" />
          <span className="text-xs uppercase tracking-[0.2em] font-medium">ImgSplit</span>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden p-2 md:p-4">
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
