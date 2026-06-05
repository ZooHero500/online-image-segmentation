export type BackgroundRemovalWorkerDevice = "webgpu" | "wasm"

export type BackgroundRemovalWorkerStatusMessage = {
  type: "status"
  requestId: string
  status: "loading" | "ready" | "processing"
  device?: BackgroundRemovalWorkerDevice
}

export type BackgroundRemovalWorkerProgressMessage = {
  type: "download-progress"
  requestId: string
  progress: number | null
  loaded?: number
  total?: number
}

type BackgroundRemovalWorkerResultMessage = {
  type: "result"
  requestId: string
  image: Blob
  device: BackgroundRemovalWorkerDevice
}

type BackgroundRemovalWorkerErrorMessage = {
  type: "error"
  requestId: string
  message: string
}

export type BackgroundRemovalWorkerMessage =
  | BackgroundRemovalWorkerStatusMessage
  | BackgroundRemovalWorkerProgressMessage
  | BackgroundRemovalWorkerResultMessage
  | BackgroundRemovalWorkerErrorMessage

export type BackgroundRemovalWorkerRemoveOptions = {
  requestId: string
  file: File
  modelId: string
  onStatus?: (message: BackgroundRemovalWorkerStatusMessage) => void
  onProgress?: (message: BackgroundRemovalWorkerProgressMessage) => void
}

export type BackgroundRemovalWorkerRemoveResult = {
  image: Blob
  device: BackgroundRemovalWorkerDevice
}

type PendingRequest = {
  requestId: string
  resolve: (result: BackgroundRemovalWorkerRemoveResult) => void
  reject: (error: Error) => void
  onStatus?: BackgroundRemovalWorkerRemoveOptions["onStatus"]
  onProgress?: BackgroundRemovalWorkerRemoveOptions["onProgress"]
}

export class BackgroundRemovalWorkerClient {
  private worker: Worker | null = null
  private pending: PendingRequest | null = null

  constructor(private readonly createWorker: () => Worker) {}

  remove(
    options: BackgroundRemovalWorkerRemoveOptions
  ): Promise<BackgroundRemovalWorkerRemoveResult> {
    if (this.pending) {
      return Promise.reject(
        new Error("Background removal worker already has an active request")
      )
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
    if (this.worker) {
      this.worker.onmessage = null
      this.worker.onerror = null
      this.worker.terminate()
    }
    this.worker = null
  }

  private getWorker() {
    if (this.worker) return this.worker

    const worker = this.createWorker()
    this.worker = worker

    worker.onmessage = (event: MessageEvent<BackgroundRemovalWorkerMessage>) => {
      if (this.worker !== worker) return

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

    worker.onerror = (event: ErrorEvent) => {
      if (this.worker !== worker) return

      const pending = this.pending
      this.pending = null
      worker.onmessage = null
      worker.onerror = null
      worker.terminate()
      this.worker = null
      pending?.reject(new Error(event.message || "Background removal failed"))
    }

    return worker
  }
}
