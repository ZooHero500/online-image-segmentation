# Batch Background Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend `/remove-background` from one image to a stable batch image background remover with queue progress, per-image retry/removal, and ZIP export.

**Status:** Implemented on 2026-06-05. The final implementation keeps the plan's serial queue shape, adds request-id guarded worker calls, per-item retry/removal, localized batch controls, and ready-only ZIP export.

**Architecture:** Keep the existing single-image RMBG worker path as the inference source of truth, but run images through a main-thread serial queue so the model loads once and memory stays predictable. The editor becomes a batch-first surface: one image still gets the side-by-side preview, while multiple images show a compact queue with statuses, failed-item retry, and download-ready ZIP. No concurrent model inference in this version.

**Tech Stack:** Next.js App Router, TypeScript strict mode, Tailwind CSS v4, `@huggingface/transformers`, Web Worker, Canvas API, existing `jszip`, Bun, Vitest.

---

## Scope

Included:
- Upload one or many PNG/JPG/WebP images via existing `UploadZone`.
- Add more files after the first upload.
- Process queue serially with one active worker request at a time.
- Reuse the already loaded RMBG model inside the worker.
- Show overall progress, current item, per-item status, and device.
- Disable refine/export controls while the queue is actively processing.
- Allow cancel queue, retry failed items, remove queued/failed/ready items.
- Download single result when one item is ready.
- Download all ready results as `background_removed_images.zip` when more than one item is ready.
- Keep all existing single-image preview, image preview modal, refine parameters, and local model messaging.

Not included:
- Video.
- Parallel inference.
- Background replacement.
- Per-item custom refine settings.
- Automatic re-processing when refine settings change. The user clicks the run/re-run button, same as the current single-image behavior.

## File Structure

- Modify `src/workers/background-removal.worker.ts`: add `requestId` to request/response messages so stale or canceled batch requests can be ignored safely.
- Create `src/lib/background-removal-batch.ts`: pure batch types, item creation, summary helpers, output names, and ZIP export helpers.
- Create `src/lib/__tests__/background-removal-batch.test.ts`: tests for batch item creation, summary counts, output names, and ZIP export.
- Create `src/lib/background-removal-worker-client.ts`: small Promise-based wrapper around the worker, one request in flight, request id matching, terminate support.
- Create `src/lib/__tests__/background-removal-worker-client.test.ts`: tests for request id matching and error propagation using a fake worker.
- Create `src/components/background-removal/useBackgroundRemovalBatch.ts`: reducer-backed hook that owns queue state, serial processing, cancel/retry/remove, object URL cleanup.
- Create `src/components/background-removal/BatchRemovalList.tsx`: queue list UI for 2+ images.
- Modify `src/components/background-removal/BackgroundRemovalEditor.tsx`: switch upload to `multiple`, use the batch hook, keep single-image mode, show batch queue mode, add add-more and ZIP download actions.
- Modify `src/messages/{en,zh-CN,ja,ko,es}.json`: add batch labels, status labels, action labels, and hints.

---

### Task 1: Add Batch Pure Helpers

**Files:**
- Create: `src/lib/background-removal-batch.ts`
- Create: `src/lib/__tests__/background-removal-batch.test.ts`

- [ ] **Step 1: Write tests for batch helper behavior**

Create `src/lib/__tests__/background-removal-batch.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import JSZip from "jszip"
import {
  createBatchRemovalItems,
  exportBackgroundRemovalBatchAsZip,
  getBackgroundRemovalBatchSummary,
  getBackgroundRemovalOutputFileName,
  getBackgroundRemovalZipFileName,
} from "../background-removal-batch"

function file(name: string, type = "image/png") {
  return new File(["image"], name, { type })
}

function image(width = 100, height = 80) {
  return { naturalWidth: width, naturalHeight: height, width, height } as HTMLImageElement
}

describe("background removal batch helpers", () => {
  it("creates queued batch items with stable ids", () => {
    const items = createBatchRemovalItems(
      [
        { file: file("first.photo.png"), image: image(), mimeType: "image/png" },
        { file: file("second.jpg", "image/jpeg"), image: image(200, 160), mimeType: "image/jpeg" },
      ],
      (() => {
        let index = 0
        return () => `batch-${++index}`
      })()
    )

    expect(items.map((item) => item.id)).toEqual(["batch-1", "batch-2"])
    expect(items.map((item) => item.status)).toEqual(["queued", "queued"])
    expect(items[0].baseName).toBe("first.photo")
    expect(items[1].dimensions).toEqual({ width: 200, height: 160 })
  })

  it("summarizes queue progress", () => {
    const summary = getBackgroundRemovalBatchSummary([
      { id: "1", status: "ready" },
      { id: "2", status: "error" },
      { id: "3", status: "processing" },
      { id: "4", status: "queued" },
    ])

    expect(summary).toEqual({
      total: 4,
      ready: 1,
      failed: 1,
      active: 1,
      queued: 1,
      completed: 2,
      percent: 50,
      isBusy: true,
      canDownloadReady: true,
      hasFailures: true,
    })
  })

  it("builds clear output filenames", () => {
    expect(getBackgroundRemovalOutputFileName("product.photo.png", "image/png")).toBe("product.photo-no-bg.png")
    expect(getBackgroundRemovalOutputFileName("portrait.jpg", "image/webp")).toBe("portrait-no-bg.webp")
    expect(getBackgroundRemovalZipFileName()).toBe("background_removed_images.zip")
  })

  it("exports ready items as a zip", async () => {
    const zipBlob = await exportBackgroundRemovalBatchAsZip([
      {
        id: "1",
        originalFileName: "a.png",
        outputFormat: "image/png",
        blob: new Blob(["a"], { type: "image/png" }),
      },
      {
        id: "2",
        originalFileName: "b.jpg",
        outputFormat: "image/webp",
        blob: new Blob(["b"], { type: "image/webp" }),
      },
    ])

    expect(zipBlob.type).toBe("application/zip")
    const zip = await JSZip.loadAsync(zipBlob)
    expect(Object.keys(zip.files).sort()).toEqual(["a-no-bg.png", "b-no-bg.webp"])
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
bunx vitest run src/lib/__tests__/background-removal-batch.test.ts
```

Expected: FAIL because `src/lib/background-removal-batch.ts` does not exist.

- [ ] **Step 3: Implement batch helpers**

Create `src/lib/background-removal-batch.ts`:

```ts
import type { UploadResult } from "@/types"
import {
  exportBackgroundRemovalCanvas,
  getBackgroundRemovalBaseName,
  getBackgroundRemovalOutputExtension,
} from "@/lib/background-removal"
import type { BackgroundRemovalOutputFormat } from "@/lib/background-removal"

export type BatchRemovalStatus =
  | "queued"
  | "loading-model"
  | "processing"
  | "ready"
  | "error"
  | "canceled"

export type BatchRemovalItem = {
  id: string
  file: File
  image: HTMLImageElement
  mimeType: string
  baseName: string
  dimensions: { width: number; height: number }
  status: BatchRemovalStatus
  progress: number | null
  error: string | null
  resultCanvas: HTMLCanvasElement | null
  resultUrl: string
  device: "webgpu" | "wasm" | null
}

export type BatchRemovalSummaryItem = Pick<BatchRemovalItem, "id" | "status">

export type BatchRemovalZipItem = {
  id: string
  originalFileName: string
  outputFormat: BackgroundRemovalOutputFormat
  blob: Blob
}

export function createBatchRemovalItems(
  results: UploadResult[],
  createId: () => string
): BatchRemovalItem[] {
  return results.map((result) => ({
    id: createId(),
    file: result.file,
    image: result.image,
    mimeType: result.mimeType,
    baseName: getBackgroundRemovalBaseName(result.file.name),
    dimensions: {
      width: result.image.naturalWidth || result.image.width,
      height: result.image.naturalHeight || result.image.height,
    },
    status: "queued",
    progress: null,
    error: null,
    resultCanvas: null,
    resultUrl: "",
    device: null,
  }))
}

export function getBackgroundRemovalBatchSummary(items: BatchRemovalSummaryItem[]) {
  const total = items.length
  const ready = items.filter((item) => item.status === "ready").length
  const failed = items.filter((item) => item.status === "error").length
  const active = items.filter(
    (item) => item.status === "loading-model" || item.status === "processing"
  ).length
  const queued = items.filter((item) => item.status === "queued").length
  const completed = ready + failed + items.filter((item) => item.status === "canceled").length

  return {
    total,
    ready,
    failed,
    active,
    queued,
    completed,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    isBusy: active > 0,
    canDownloadReady: ready > 0,
    hasFailures: failed > 0,
  }
}

export function getBackgroundRemovalOutputFileName(
  originalFileName: string,
  format: BackgroundRemovalOutputFormat
): string {
  return `${getBackgroundRemovalBaseName(originalFileName)}-no-bg.${getBackgroundRemovalOutputExtension(format)}`
}

export function getBackgroundRemovalZipFileName(): string {
  return "background_removed_images.zip"
}

export async function exportBackgroundRemovalBatchAsZip(
  items: BatchRemovalZipItem[]
): Promise<Blob> {
  const { default: JSZip } = await import("jszip")
  const zip = new JSZip()

  for (const item of items) {
    zip.file(getBackgroundRemovalOutputFileName(item.originalFileName, item.outputFormat), item.blob)
  }

  return zip.generateAsync({ type: "blob", mimeType: "application/zip" })
}

export async function canvasToBatchZipItem(
  item: BatchRemovalItem,
  outputFormat: BackgroundRemovalOutputFormat,
  quality: number
): Promise<BatchRemovalZipItem | null> {
  if (!item.resultCanvas) return null

  return {
    id: item.id,
    originalFileName: item.file.name,
    outputFormat,
    blob: await exportBackgroundRemovalCanvas(item.resultCanvas, outputFormat, quality),
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:

```bash
bunx vitest run src/lib/__tests__/background-removal-batch.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/lib/background-removal-batch.ts src/lib/__tests__/background-removal-batch.test.ts
git commit -m "feat(remove-background): add batch helper utilities"
```

---

### Task 2: Add Request IDs to the Worker Protocol

**Files:**
- Modify: `src/workers/background-removal.worker.ts`

- [ ] **Step 1: Update worker message types**

Modify the top-level message types in `src/workers/background-removal.worker.ts`:

```ts
type RemoveBackgroundMessage = {
  type: "remove-background"
  requestId: string
  image: Blob
  modelId: string
}

type WorkerResponse =
  | { type: "status"; requestId: string; status: WorkerStatus; device?: WorkerDevice }
  | { type: "download-progress"; requestId: string; progress: number | null; loaded?: number; total?: number }
  | { type: "result"; requestId: string; image: Blob; device: WorkerDevice }
  | { type: "error"; requestId: string; message: string }
```

- [ ] **Step 2: Thread request ids through worker posts**

Change helper signatures and post calls:

```ts
function post(message: WorkerResponse) {
  workerSelf.postMessage(message)
}

function handleProgress(requestId: string) {
  return (event: ProgressEvent) => {
    if (event.status !== "progress") return

    const progress =
      typeof event.progress === "number"
        ? Math.max(0, Math.min(1, event.progress / 100))
        : null

    post({
      type: "download-progress",
      requestId,
      progress,
      loaded: event.loaded,
      total: event.total,
    })
  }
}
```

Inside `loadSegmenter(modelId, device, requestId)`, pass `progress_callback: handleProgress(requestId)`.

Inside `removeBackgroundWithDevice(message, device)`, post:

```ts
post({ type: "status", requestId: message.requestId, status: "ready", device: activeDevice })
post({ type: "status", requestId: message.requestId, status: "processing", device: activeDevice })
```

Inside success and error paths:

```ts
post({ type: "result", requestId: message.requestId, image, device: activeDevice })
post({
  type: "error",
  requestId: event.data.requestId,
  message: error instanceof Error ? error.message : "Background removal failed",
})
```

- [ ] **Step 3: Verify existing build catches type drift**

Run:

```bash
bun run build
```

Expected: FAIL until `BackgroundRemovalEditor.tsx` is updated to send and read `requestId`.

- [ ] **Step 4: Temporarily update the single-image editor for request id compatibility**

In `src/components/background-removal/BackgroundRemovalEditor.tsx`, update the worker message type:

```ts
type WorkerStatusMessage =
  | { type: "status"; requestId: string; status: "loading" | "ready" | "processing"; device?: "webgpu" | "wasm" }
  | { type: "download-progress"; requestId: string; progress: number | null; loaded?: number; total?: number }
  | { type: "result"; requestId: string; image: Blob; device: "webgpu" | "wasm" }
  | { type: "error"; requestId: string; message: string }
```

In `handleRemoveBackground`, create a request id:

```ts
const requestId = `single-${Date.now()}-${Math.random().toString(36).slice(2)}`
```

Ignore stale worker messages:

```ts
worker.onmessage = async (event: MessageEvent<WorkerStatusMessage>) => {
  const message = event.data
  if (message.requestId !== requestId) return

  // keep the existing message handling below this guard
}
```

Send the id:

```ts
worker.postMessage({
  type: "remove-background",
  requestId,
  image: item.file,
  modelId: BACKGROUND_REMOVAL_MODEL_ID,
})
```

- [ ] **Step 5: Run verification**

Run:

```bash
bunx eslint src/workers/background-removal.worker.ts src/components/background-removal/BackgroundRemovalEditor.tsx
bun run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/workers/background-removal.worker.ts src/components/background-removal/BackgroundRemovalEditor.tsx
git commit -m "refactor(remove-background): add request ids to worker protocol"
```

---

### Task 3: Add a Promise-Based Worker Client

**Files:**
- Create: `src/lib/background-removal-worker-client.ts`
- Create: `src/lib/__tests__/background-removal-worker-client.test.ts`
- Modify: `src/components/background-removal/BackgroundRemovalEditor.tsx`

- [ ] **Step 1: Write tests for request matching and errors**

Create `src/lib/__tests__/background-removal-worker-client.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest"
import { BackgroundRemovalWorkerClient } from "../background-removal-worker-client"

class FakeWorker {
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: (() => void) | null = null
  posted: unknown[] = []
  terminated = false

  postMessage(message: unknown) {
    this.posted.push(message)
  }

  terminate() {
    this.terminated = true
  }
}

describe("BackgroundRemovalWorkerClient", () => {
  it("resolves only the matching request result", async () => {
    const worker = new FakeWorker()
    const client = new BackgroundRemovalWorkerClient(() => worker as unknown as Worker)
    const promise = client.remove({
      requestId: "request-1",
      file: new File(["image"], "a.png", { type: "image/png" }),
      modelId: "imgsplit/rmbg-1.4",
    })

    worker.onmessage?.({ data: { type: "result", requestId: "other", image: new Blob(["wrong"]), device: "wasm" } } as MessageEvent)
    worker.onmessage?.({ data: { type: "result", requestId: "request-1", image: new Blob(["right"]), device: "wasm" } } as MessageEvent)

    await expect(promise).resolves.toMatchObject({ device: "wasm" })
  })

  it("rejects matching request errors", async () => {
    const worker = new FakeWorker()
    const client = new BackgroundRemovalWorkerClient(() => worker as unknown as Worker)
    const promise = client.remove({
      requestId: "request-2",
      file: new File(["image"], "a.png", { type: "image/png" }),
      modelId: "imgsplit/rmbg-1.4",
    })

    worker.onmessage?.({ data: { type: "error", requestId: "request-2", message: "failed" } } as MessageEvent)

    await expect(promise).rejects.toThrow("failed")
  })

  it("terminates the worker", () => {
    const worker = new FakeWorker()
    const client = new BackgroundRemovalWorkerClient(() => worker as unknown as Worker)
    client.terminate()
    expect(worker.terminated).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
bunx vitest run src/lib/__tests__/background-removal-worker-client.test.ts
```

Expected: FAIL because `BackgroundRemovalWorkerClient` does not exist.

- [ ] **Step 3: Implement worker client**

Create `src/lib/background-removal-worker-client.ts`:

```ts
type WorkerDevice = "webgpu" | "wasm"

type WorkerStatusMessage =
  | { type: "status"; requestId: string; status: "loading" | "ready" | "processing"; device?: WorkerDevice }
  | { type: "download-progress"; requestId: string; progress: number | null; loaded?: number; total?: number }
  | { type: "result"; requestId: string; image: Blob; device: WorkerDevice }
  | { type: "error"; requestId: string; message: string }

type RemoveOptions = {
  requestId: string
  file: File
  modelId: string
  onStatus?: (message: Extract<WorkerStatusMessage, { type: "status" }>) => void
  onProgress?: (message: Extract<WorkerStatusMessage, { type: "download-progress" }>) => void
}

type RemoveResult = {
  image: Blob
  device: WorkerDevice
}

export class BackgroundRemovalWorkerClient {
  private worker: Worker | null = null
  private pending:
    | {
        requestId: string
        resolve: (result: RemoveResult) => void
        reject: (error: Error) => void
        onStatus?: RemoveOptions["onStatus"]
        onProgress?: RemoveOptions["onProgress"]
      }
    | null = null

  constructor(private readonly createWorker: () => Worker) {}

  remove(options: RemoveOptions): Promise<RemoveResult> {
    if (this.pending) {
      return Promise.reject(new Error("Background removal worker already has an active request"))
    }

    const worker = this.getWorker()

    return new Promise((resolve, reject) => {
      this.pending = {
        requestId: options.requestId,
        resolve,
        reject,
        onStatus: options.onStatus,
        onProgress: options.onProgress,
      }

      worker.postMessage({
        type: "remove-background",
        requestId: options.requestId,
        image: options.file,
        modelId: options.modelId,
      })
    })
  }

  terminate() {
    this.pending?.reject(new Error("Background removal canceled"))
    this.pending = null
    this.worker?.terminate()
    this.worker = null
  }

  private getWorker() {
    if (this.worker) return this.worker

    this.worker = this.createWorker()
    this.worker.onmessage = (event: MessageEvent<WorkerStatusMessage>) => {
      const message = event.data
      const pending = this.pending
      if (!pending || message.requestId !== pending.requestId) return

      if (message.type === "status") {
        pending.onStatus?.(message)
        return
      }

      if (message.type === "download-progress") {
        pending.onProgress?.(message)
        return
      }

      this.pending = null

      if (message.type === "error") {
        pending.reject(new Error(message.message))
        return
      }

      pending.resolve({ image: message.image, device: message.device })
    }

    this.worker.onerror = () => {
      const pending = this.pending
      this.pending = null
      pending?.reject(new Error("Background removal failed"))
    }

    return this.worker
  }
}
```

- [ ] **Step 4: Run tests**

Run:

```bash
bunx vitest run src/lib/__tests__/background-removal-worker-client.test.ts
```

Expected: PASS.

- [ ] **Step 5: Use the client in the single-image editor**

In `BackgroundRemovalEditor.tsx`, replace direct worker setup with:

```ts
import { BackgroundRemovalWorkerClient } from "@/lib/background-removal-worker-client"
```

Replace `const workerRef = useRef<Worker | null>(null)` with:

```ts
const workerClientRef = useRef<BackgroundRemovalWorkerClient | null>(null)

function createBackgroundRemovalWorker() {
  return new Worker(
    new URL("../../workers/background-removal.worker.ts", import.meta.url),
    { type: "module" }
  )
}
```

Initialize client before use:

```ts
if (!workerClientRef.current) {
  workerClientRef.current = new BackgroundRemovalWorkerClient(createBackgroundRemovalWorker)
}
```

Call:

```ts
const result = await workerClientRef.current.remove({
  requestId,
  file: item.file,
  modelId: BACKGROUND_REMOVAL_MODEL_ID,
  onStatus: (message) => {
    if (message.device) setDevice(message.device)
    if (message.status === "processing") setState("processing")
    if (message.status === "loading") setState("loading-model")
  },
  onProgress: (message) => {
    setDownloadProgress(message.progress)
    setLoadedBytes(message.loaded ?? null)
    setTotalBytes(message.total ?? null)
  },
})
```

Then keep the existing result handling:

```ts
setDevice(result.device)
const outputImage = await loadImageFromBlob(result.image)
const canvas = createCanvasFromImage(outputImage)
setBaseResultCanvas(canvas)
setState("ready")
setDownloadProgress(1)
await refreshCacheState()
toast.success(t("downloadReady"))
```

Cleanup:

```ts
useEffect(() => {
  return () => {
    workerClientRef.current?.terminate()
  }
}, [])
```

- [ ] **Step 6: Verify**

Run:

```bash
bunx eslint src/lib/background-removal-worker-client.ts src/lib/__tests__/background-removal-worker-client.test.ts src/components/background-removal/BackgroundRemovalEditor.tsx
bunx vitest run src/lib/__tests__/background-removal-worker-client.test.ts
bun run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```bash
git add src/lib/background-removal-worker-client.ts src/lib/__tests__/background-removal-worker-client.test.ts src/components/background-removal/BackgroundRemovalEditor.tsx
git commit -m "refactor(remove-background): wrap background worker requests"
```

---

### Task 4: Add Batch Queue Hook

**Files:**
- Create: `src/components/background-removal/useBackgroundRemovalBatch.ts`
- Modify: `src/components/background-removal/BackgroundRemovalEditor.tsx`

- [ ] **Step 1: Implement the batch hook**

Create `src/components/background-removal/useBackgroundRemovalBatch.ts`:

```ts
"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { BACKGROUND_REMOVAL_MODEL_ID, loadImageFromBlob, refineBackgroundRemovalCanvas } from "@/lib/background-removal"
import type { BackgroundRemovalRefineOptions } from "@/lib/background-removal"
import {
  createBatchRemovalItems,
  getBackgroundRemovalBatchSummary,
} from "@/lib/background-removal-batch"
import type { BatchRemovalItem } from "@/lib/background-removal-batch"
import { BackgroundRemovalWorkerClient } from "@/lib/background-removal-worker-client"
import type { UploadResult } from "@/types"

let nextBatchId = 0
function createBatchId() {
  nextBatchId += 1
  return `bg-${nextBatchId}`
}

function createBackgroundRemovalWorker() {
  return new Worker(
    new URL("../../workers/background-removal.worker.ts", import.meta.url),
    { type: "module" }
  )
}

function createCanvasFromImage(image: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = image.naturalWidth || image.width
  canvas.height = image.naturalHeight || image.height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas is not available")
  ctx.drawImage(image, 0, 0)
  return canvas
}

async function createCanvasObjectUrl(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not create preview"))
        return
      }
      resolve(URL.createObjectURL(blob))
    }, "image/png")
  })
}

export function useBackgroundRemovalBatch(options: {
  refineOptions: BackgroundRemovalRefineOptions
  onCacheRefresh: () => Promise<void>
  onDoneText: string
  onFailText: string
}) {
  const [items, setItems] = useState<BatchRemovalItem[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isCancelRequested, setIsCancelRequested] = useState(false)
  const clientRef = useRef<BackgroundRemovalWorkerClient | null>(null)

  const summary = useMemo(() => getBackgroundRemovalBatchSummary(items), [items])
  const activeItem = items.find(
    (item) => item.status === "loading-model" || item.status === "processing"
  ) ?? null

  const addItems = useCallback((results: UploadResult[]) => {
    setItems((prev) => [...prev, ...createBatchRemovalItems(results, createBatchId)])
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((candidate) => candidate.id === id)
      if (item?.resultUrl) URL.revokeObjectURL(item.resultUrl)
      return prev.filter((candidate) => candidate.id !== id)
    })
  }, [])

  const clearAll = useCallback(() => {
    setItems((prev) => {
      for (const item of prev) {
        if (item.resultUrl) URL.revokeObjectURL(item.resultUrl)
      }
      return []
    })
    setIsRunning(false)
    setIsCancelRequested(false)
    clientRef.current?.terminate()
    clientRef.current = null
  }, [])

  const retryFailed = useCallback(() => {
    setItems((prev) =>
      prev.map((item) =>
        item.status === "error"
          ? { ...item, status: "queued", progress: null, error: null }
          : item
      )
    )
  }, [])

  const cancelQueue = useCallback(() => {
    setIsCancelRequested(true)
    clientRef.current?.terminate()
    clientRef.current = null
    setItems((prev) =>
      prev.map((item) =>
        item.status === "queued" || item.status === "loading-model" || item.status === "processing"
          ? { ...item, status: "canceled", progress: null }
          : item
      )
    )
    setIsRunning(false)
  }, [])

  const runQueue = useCallback(async () => {
    if (isRunning) return

    setIsRunning(true)
    setIsCancelRequested(false)

    if (!clientRef.current) {
      clientRef.current = new BackgroundRemovalWorkerClient(createBackgroundRemovalWorker)
    }

    while (true) {
      if (isCancelRequested) break

      const nextItem = await new Promise<BatchRemovalItem | null>((resolve) => {
        setItems((prev) => {
          const queued = prev.find((item) => item.status === "queued")
          resolve(queued ?? null)
          return prev
        })
      })

      if (!nextItem) break

      setItems((prev) =>
        prev.map((item) =>
          item.id === nextItem.id
            ? { ...item, status: "loading-model", progress: null, error: null }
            : item
        )
      )

      try {
        const result = await clientRef.current.remove({
          requestId: nextItem.id,
          file: nextItem.file,
          modelId: BACKGROUND_REMOVAL_MODEL_ID,
          onStatus: (message) => {
            setItems((prev) =>
              prev.map((item) =>
                item.id === nextItem.id
                  ? { ...item, status: message.status === "processing" ? "processing" : "loading-model", device: message.device ?? item.device }
                  : item
              )
            )
          },
          onProgress: (message) => {
            setItems((prev) =>
              prev.map((item) =>
                item.id === nextItem.id
                  ? { ...item, progress: message.progress }
                  : item
              )
            )
          },
        })

        const outputImage = await loadImageFromBlob(result.image)
        const baseCanvas = createCanvasFromImage(outputImage)
        const refinedCanvas = refineBackgroundRemovalCanvas(baseCanvas, options.refineOptions)
        const resultUrl = await createCanvasObjectUrl(refinedCanvas)

        setItems((prev) =>
          prev.map((item) => {
            if (item.id !== nextItem.id) return item
            if (item.resultUrl) URL.revokeObjectURL(item.resultUrl)
            return {
              ...item,
              status: "ready",
              progress: 1,
              resultCanvas: refinedCanvas,
              resultUrl,
              device: result.device,
              error: null,
            }
          })
        )

        await options.onCacheRefresh()
      } catch (error) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === nextItem.id
              ? {
                  ...item,
                  status: "error",
                  progress: null,
                  error: error instanceof Error ? error.message : options.onFailText,
                }
              : item
          )
        )
      }
    }

    setIsRunning(false)
    toast.success(options.onDoneText)
  }, [isCancelRequested, isRunning, options])

  useEffect(() => {
    return () => {
      clientRef.current?.terminate()
      setItems((prev) => {
        for (const item of prev) {
          if (item.resultUrl) URL.revokeObjectURL(item.resultUrl)
        }
        return prev
      })
    }
  }, [])

  return {
    items,
    summary,
    activeItem,
    isRunning,
    addItems,
    removeItem,
    clearAll,
    retryFailed,
    cancelQueue,
    runQueue,
  }
}
```

- [ ] **Step 2: Run lint for the hook**

Run:

```bash
bunx eslint src/components/background-removal/useBackgroundRemovalBatch.ts
```

Expected: PASS after fixing any stale dependency warnings by memoizing options in the caller or passing stable callbacks.

- [ ] **Step 3: Commit**

Run:

```bash
git add src/components/background-removal/useBackgroundRemovalBatch.ts
git commit -m "feat(remove-background): add serial batch queue hook"
```

---

### Task 5: Add Batch Queue UI

**Files:**
- Create: `src/components/background-removal/BatchRemovalList.tsx`

- [ ] **Step 1: Implement the list component**

Create `src/components/background-removal/BatchRemovalList.tsx`:

```tsx
"use client"

import { AlertCircle, CheckCircle2, Loader2, RotateCcw, Trash2 } from "lucide-react"
import type { BatchRemovalItem } from "@/lib/background-removal-batch"

type BatchRemovalListProps = {
  items: BatchRemovalItem[]
  statusText: Record<BatchRemovalItem["status"], string>
  retryLabel: string
  removeLabel: string
  onRetry: (id: string) => void
  onRemove: (id: string) => void
  onPreview: (item: BatchRemovalItem) => void
}

export function BatchRemovalList({
  items,
  statusText,
  retryLabel,
  removeLabel,
  onRetry,
  onRemove,
  onPreview,
}: BatchRemovalListProps) {
  return (
    <div className="min-h-0 overflow-y-auto border border-border bg-background">
      {items.map((item) => {
        const isBusy = item.status === "loading-model" || item.status === "processing"
        const canPreview = item.status === "ready" && item.resultUrl

        return (
          <div
            key={item.id}
            className="grid grid-cols-[56px_1fr_auto] gap-3 border-b border-border p-3 last:border-b-0"
          >
            <button
              type="button"
              disabled={!canPreview}
              onClick={() => onPreview(item)}
              className="h-14 w-14 overflow-hidden border border-border bg-secondary disabled:cursor-default"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.resultUrl || URL.createObjectURL(item.file)}
                alt={item.file.name}
                className="h-full w-full object-cover"
              />
            </button>

            <div className="min-w-0">
              <p className="truncate text-sm text-foreground">{item.file.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.dimensions.width} x {item.dimensions.height}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                {isBusy && <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" strokeWidth={1.5} />}
                {item.status === "ready" && <CheckCircle2 className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />}
                {item.status === "error" && <AlertCircle className="h-3.5 w-3.5 text-destructive" strokeWidth={1.5} />}
                <span>{statusText[item.status]}</span>
                {item.device && <span>{item.device.toUpperCase()}</span>}
              </div>
              {isBusy && (
                <div className="mt-2 h-1 overflow-hidden bg-secondary">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{ width: `${Math.max(8, Math.round((item.progress ?? 0.08) * 100))}%` }}
                  />
                </div>
              )}
              {item.error && (
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-destructive">{item.error}</p>
              )}
            </div>

            <div className="flex items-start gap-1">
              {item.status === "error" && (
                <button
                  type="button"
                  onClick={() => onRetry(item.id)}
                  className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={retryLabel}
                >
                  <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
                </button>
              )}
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                disabled={isBusy}
                className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:cursor-default disabled:opacity-35"
                aria-label={removeLabel}
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Fix object URL leak before use**

The `URL.createObjectURL(item.file)` call in render creates a leak. Replace it with a thumbnail URL generated in `BatchRemovalItem` during item creation in Task 1:

Add field to `BatchRemovalItem`:

```ts
sourceUrl: string
```

Set it in `createBatchRemovalItems`:

```ts
sourceUrl: URL.createObjectURL(result.file),
```

Update cleanup paths in `useBackgroundRemovalBatch` to revoke both `sourceUrl` and `resultUrl`.

Update `BatchRemovalList` image source:

```tsx
src={item.resultUrl || item.sourceUrl}
```

- [ ] **Step 3: Run lint**

Run:

```bash
bunx eslint src/components/background-removal/BatchRemovalList.tsx src/components/background-removal/useBackgroundRemovalBatch.ts src/lib/background-removal-batch.ts
```

Expected: PASS.

- [ ] **Step 4: Commit**

Run:

```bash
git add src/components/background-removal/BatchRemovalList.tsx src/components/background-removal/useBackgroundRemovalBatch.ts src/lib/background-removal-batch.ts src/lib/__tests__/background-removal-batch.test.ts
git commit -m "feat(remove-background): add batch result list"
```

---

### Task 6: Integrate Batch Mode Into the Editor

**Files:**
- Modify: `src/components/background-removal/BackgroundRemovalEditor.tsx`

- [ ] **Step 1: Switch upload to multiple**

Replace the upload props:

```tsx
<UploadZone
  multiple
  onImagesLoaded={handleImagesLoaded}
  title={t("uploadTitle")}
  dragHint={t("uploadDragHint")}
  clickHint={t("uploadClickHint")}
  formatHint={t("uploadFormatHint")}
/>
```

Add:

```ts
const handleImagesLoaded = useCallback((results: UploadResult[]) => {
  batch.addItems(results)
  setState("selected")
  setError(null)
}, [batch])
```

- [ ] **Step 2: Use batch state as source of truth**

Create the hook in `BackgroundRemovalEditor`:

```ts
const batch = useBackgroundRemovalBatch({
  refineOptions,
  onCacheRefresh: refreshCacheState,
  onDoneText: t("batchDone"),
  onFailText: t("processFailed"),
})

const items = batch.items
const selectedItem = items[0] ?? null
const isBatch = items.length > 1
const isBusy = batch.summary.isBusy || batch.isRunning
const hasResult = selectedItem?.status === "ready" && Boolean(selectedItem.resultCanvas)
```

Keep the existing single-image side-by-side preview when `items.length <= 1`.

- [ ] **Step 3: Replace direct remove action with queue run**

In `handleRemoveBackground`, keep local model preflight and refine handling, but call:

```ts
if (isBusy) return

if (!isModelCached) {
  try {
    await assertBackgroundRemovalModelAvailable()
  } catch {
    const configPath = getBackgroundRemovalModelFilePath("config.json")
    setState("error")
    setError(t("localModelMissing", { path: configPath }))
    toast.error(t("localModelMissingToast"))
    return
  }
}

setAppliedRefineOptions(refineOptions)
await batch.runQueue()
setState("ready")
```

- [ ] **Step 4: Add batch layout**

When `isBatch` is true, replace the preview grid with:

```tsx
<div className="mx-auto flex h-full max-w-6xl flex-col gap-4">
  <div className="grid gap-3 border border-border bg-background p-4 sm:grid-cols-4">
    <SummaryMetric label={t("batchTotal")} value={batch.summary.total} />
    <SummaryMetric label={t("batchReady")} value={batch.summary.ready} />
    <SummaryMetric label={t("batchFailed")} value={batch.summary.failed} />
    <SummaryMetric label={t("batchProgress")} value={`${batch.summary.percent}%`} />
  </div>
  <BatchRemovalList
    items={batch.items}
    statusText={{
      queued: t("batchStatusQueued"),
      "loading-model": t("batchStatusLoading"),
      processing: t("batchStatusProcessing"),
      ready: t("batchStatusReady"),
      error: t("batchStatusError"),
      canceled: t("batchStatusCanceled"),
    }}
    retryLabel={t("batchRetryOne")}
    removeLabel={t("batchRemoveOne")}
    onRetry={(id) => batch.retryOne(id)}
    onRemove={batch.removeItem}
    onPreview={(item) => item.resultUrl && setPreviewImage({ label: item.file.name, url: item.resultUrl })}
  />
</div>
```

Add `SummaryMetric` near the bottom of the file:

```tsx
function SummaryMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-serif text-2xl text-foreground">{value}</p>
    </div>
  )
}
```

Add `retryOne` to `useBackgroundRemovalBatch`:

```ts
const retryOne = useCallback((id: string) => {
  setItems((prev) =>
    prev.map((item) =>
      item.id === id && (item.status === "error" || item.status === "canceled")
        ? { ...item, status: "queued", progress: null, error: null }
        : item
    )
  )
}, [])
```

Return it from the hook.

- [ ] **Step 5: Add batch actions to the side panel**

Add buttons above the download section:

```tsx
{isBatch && (
  <section className="border-b border-border py-5">
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={batch.runQueue}
        disabled={isBusy || batch.summary.queued === 0}
        className="bg-foreground px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-background disabled:opacity-50"
      >
        {t("batchStart")}
      </button>
      <button
        type="button"
        onClick={batch.cancelQueue}
        disabled={!isBusy}
        className="border border-border px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-foreground disabled:opacity-50"
      >
        {t("batchCancel")}
      </button>
      <button
        type="button"
        onClick={batch.retryFailed}
        disabled={!batch.summary.hasFailures || isBusy}
        className="border border-border px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-foreground disabled:opacity-50"
      >
        {t("batchRetryFailed")}
      </button>
      <button
        type="button"
        onClick={batch.clearAll}
        disabled={isBusy}
        className="border border-border px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-foreground disabled:opacity-50"
      >
        {t("batchClear")}
      </button>
    </div>
  </section>
)}
```

- [ ] **Step 6: Add ZIP download**

In `handleDownload`, branch on batch:

```ts
if (isBatch) {
  const readyItems = await Promise.all(
    batch.items
      .filter((item) => item.status === "ready")
      .map((item) => canvasToBatchZipItem(item, format, quality / 100))
  )
  const zipItems = readyItems.filter((item): item is NonNullable<typeof item> => Boolean(item))
  const blob = await exportBackgroundRemovalBatchAsZip(zipItems)
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = getBackgroundRemovalZipFileName()
  a.click()
  URL.revokeObjectURL(url)
  return
}
```

Import:

```ts
import {
  canvasToBatchZipItem,
  exportBackgroundRemovalBatchAsZip,
  getBackgroundRemovalZipFileName,
} from "@/lib/background-removal-batch"
```

- [ ] **Step 7: Verify**

Run:

```bash
bunx eslint src/components/background-removal/BackgroundRemovalEditor.tsx src/components/background-removal/useBackgroundRemovalBatch.ts src/components/background-removal/BatchRemovalList.tsx src/lib/background-removal-batch.ts
bunx vitest run src/lib/__tests__/background-removal-batch.test.ts src/lib/__tests__/background-removal-worker-client.test.ts src/lib/__tests__/background-removal.test.ts
bun run build
```

Expected: PASS.

- [ ] **Step 8: Commit**

Run:

```bash
git add src/components/background-removal/BackgroundRemovalEditor.tsx src/components/background-removal/useBackgroundRemovalBatch.ts src/components/background-removal/BatchRemovalList.tsx src/lib/background-removal-batch.ts src/lib/__tests__/background-removal-batch.test.ts
git commit -m "feat(remove-background): support batch queue processing"
```

---

### Task 7: Add Batch i18n

**Files:**
- Modify: `src/messages/en.json`
- Modify: `src/messages/zh-CN.json`
- Modify: `src/messages/ja.json`
- Modify: `src/messages/ko.json`
- Modify: `src/messages/es.json`

- [ ] **Step 1: Add English messages**

Add these keys under `removeBackground` in `src/messages/en.json`:

```json
{
  "batchTotal": "Total",
  "batchReady": "Ready",
  "batchFailed": "Failed",
  "batchProgress": "Progress",
  "batchStart": "Start queue",
  "batchCancel": "Cancel queue",
  "batchRetryFailed": "Retry failed",
  "batchClear": "Clear all",
  "batchRetryOne": "Retry this image",
  "batchRemoveOne": "Remove this image",
  "batchDone": "Batch processing finished.",
  "batchStatusQueued": "Waiting",
  "batchStatusLoading": "Loading model",
  "batchStatusProcessing": "Removing background",
  "batchStatusReady": "Ready",
  "batchStatusError": "Failed",
  "batchStatusCanceled": "Canceled",
  "batchZipHint": "Downloads all ready results as a ZIP. Failed or canceled items are skipped.",
  "batchAddMore": "Add images"
}
```

- [ ] **Step 2: Add Chinese messages**

Add these keys under `removeBackground` in `src/messages/zh-CN.json`:

```json
{
  "batchTotal": "总数",
  "batchReady": "已完成",
  "batchFailed": "失败",
  "batchProgress": "进度",
  "batchStart": "开始队列",
  "batchCancel": "取消队列",
  "batchRetryFailed": "重试失败项",
  "batchClear": "清空全部",
  "batchRetryOne": "重试这张图片",
  "batchRemoveOne": "移除这张图片",
  "batchDone": "批量处理已结束。",
  "batchStatusQueued": "等待中",
  "batchStatusLoading": "加载模型",
  "batchStatusProcessing": "正在去背景",
  "batchStatusReady": "已完成",
  "batchStatusError": "失败",
  "batchStatusCanceled": "已取消",
  "batchZipHint": "会把已完成的结果打包为 ZIP，失败或取消的图片会跳过。",
  "batchAddMore": "继续添加图片"
}
```

- [ ] **Step 3: Add Japanese, Korean, and Spanish messages**

Use the same key names. Translate them directly and keep button labels short:

Japanese values:

```json
{
  "batchTotal": "合計",
  "batchReady": "完了",
  "batchFailed": "失敗",
  "batchProgress": "進捗",
  "batchStart": "開始",
  "batchCancel": "キャンセル",
  "batchRetryFailed": "失敗を再試行",
  "batchClear": "すべて消去",
  "batchRetryOne": "この画像を再試行",
  "batchRemoveOne": "この画像を削除",
  "batchDone": "一括処理が完了しました。",
  "batchStatusQueued": "待機中",
  "batchStatusLoading": "モデル読み込み",
  "batchStatusProcessing": "背景削除中",
  "batchStatusReady": "完了",
  "batchStatusError": "失敗",
  "batchStatusCanceled": "キャンセル済み",
  "batchZipHint": "完了した結果だけを ZIP で保存します。失敗またはキャンセルした画像は含まれません。",
  "batchAddMore": "画像を追加"
}
```

Korean values:

```json
{
  "batchTotal": "전체",
  "batchReady": "완료",
  "batchFailed": "실패",
  "batchProgress": "진행률",
  "batchStart": "대기열 시작",
  "batchCancel": "대기열 취소",
  "batchRetryFailed": "실패 항목 재시도",
  "batchClear": "전체 지우기",
  "batchRetryOne": "이 이미지 재시도",
  "batchRemoveOne": "이 이미지 제거",
  "batchDone": "일괄 처리가 끝났습니다.",
  "batchStatusQueued": "대기 중",
  "batchStatusLoading": "모델 로딩",
  "batchStatusProcessing": "배경 제거 중",
  "batchStatusReady": "완료",
  "batchStatusError": "실패",
  "batchStatusCanceled": "취소됨",
  "batchZipHint": "완료된 결과만 ZIP으로 저장합니다. 실패하거나 취소된 이미지는 제외됩니다.",
  "batchAddMore": "이미지 추가"
}
```

Spanish values:

```json
{
  "batchTotal": "Total",
  "batchReady": "Listas",
  "batchFailed": "Fallidas",
  "batchProgress": "Progreso",
  "batchStart": "Iniciar cola",
  "batchCancel": "Cancelar cola",
  "batchRetryFailed": "Reintentar fallidas",
  "batchClear": "Borrar todo",
  "batchRetryOne": "Reintentar esta imagen",
  "batchRemoveOne": "Quitar esta imagen",
  "batchDone": "Procesamiento por lote terminado.",
  "batchStatusQueued": "En espera",
  "batchStatusLoading": "Cargando modelo",
  "batchStatusProcessing": "Quitando fondo",
  "batchStatusReady": "Lista",
  "batchStatusError": "Fallida",
  "batchStatusCanceled": "Cancelada",
  "batchZipHint": "Descarga los resultados listos en un ZIP. Las imágenes fallidas o canceladas se omiten.",
  "batchAddMore": "Añadir imágenes"
}
```

- [ ] **Step 4: Verify messages build**

Run:

```bash
bun run build
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/messages/en.json src/messages/zh-CN.json src/messages/ja.json src/messages/ko.json src/messages/es.json
git commit -m "feat(remove-background): add batch i18n copy"
```

---

### Task 8: Manual QA and Performance Guardrails

**Files:**
- Modify: `docs/ideation/PROGRESS.md`

- [ ] **Step 1: Run automated verification**

Run:

```bash
bunx eslint src/components/background-removal/BackgroundRemovalEditor.tsx src/components/background-removal/BatchRemovalList.tsx src/components/background-removal/useBackgroundRemovalBatch.ts src/lib/background-removal-batch.ts src/lib/background-removal-worker-client.ts src/workers/background-removal.worker.ts
bunx vitest run src/lib/__tests__/background-removal.test.ts src/lib/__tests__/background-removal-batch.test.ts src/lib/__tests__/background-removal-worker-client.test.ts
bun run build
```

Expected: PASS.

- [ ] **Step 2: Browser QA**

Run:

```bash
bun run dev -- --port 3001
```

Open:

```text
http://localhost:3001/zh-CN/remove-background
```

Check:
- Upload one image: current side-by-side single-image experience still works.
- Upload three images: queue summary appears instead of two-panel preview.
- Click start queue: only one item is active at a time.
- Parameters and export controls are disabled while processing.
- Finished item can preview result.
- Failed item shows error text and can be retried.
- Cancel queue marks active/queued items as canceled and leaves ready items downloadable.
- ZIP download contains only ready results with `-no-bg` filenames.
- Re-run after changing refine settings processes queued/error/canceled items only after the user clicks start/retry; it does not auto-run.
- Mobile width has no horizontal overflow.

- [ ] **Step 3: Record completion in progress docs**

Update `docs/ideation/PROGRESS.md` AI background removal section:

```md
| 2026-06-05 | ⑦ AI 背景移除 — 增加批量图片队列处理，支持单 worker 串行推理、逐项状态、失败重试、取消队列与 ZIP 下载 |
```

- [ ] **Step 4: Commit**

Run:

```bash
git add docs/ideation/PROGRESS.md
git commit -m "docs(ideation): record batch background removal plan"
```

---

## Self-Review

Spec coverage:
- Batch image upload: Task 6 uses `UploadZone` with `multiple` and `onImagesLoaded`.
- Queue processing: Task 4 implements a serial queue with one active worker request.
- Stability: Task 2 adds request ids, Task 3 wraps worker requests, Task 4 avoids parallel inference.
- User-friendly progress: Task 5 and Task 6 add summary, per-item status, retry, remove, cancel, and clear.
- Export: Task 1 adds ZIP helper, Task 6 wires ZIP download for ready items.
- i18n: Task 7 covers all five locales.
- Verification: Task 8 covers automated and browser QA.

Placeholder scan:
- No unfinished placeholder markers are used.
- Every code-bearing step includes concrete snippets and exact file paths.

Type consistency:
- Queue status names are consistently `queued`, `loading-model`, `processing`, `ready`, `error`, `canceled`.
- Worker request id field is consistently `requestId`.
- Export format type remains `BackgroundRemovalOutputFormat`.
- ZIP file name is consistently `background_removed_images.zip`.
