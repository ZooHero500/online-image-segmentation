import { afterEach, describe, expect, it, vi } from "vitest"
import { BackgroundRemovalWorkerClient } from "../background-removal-worker-client"
import type { BackgroundRemovalWorkerMessage } from "../background-removal-worker-client"

class FakeWorker {
  onmessage: ((event: MessageEvent<BackgroundRemovalWorkerMessage>) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  postedMessages: unknown[] = []
  terminated = false

  postMessage(message: unknown) {
    this.postedMessages.push(message)
  }

  terminate() {
    this.terminated = true
  }

  send(message: BackgroundRemovalWorkerMessage) {
    this.onmessage?.({ data: message } as MessageEvent<BackgroundRemovalWorkerMessage>)
  }

  fail(message = "Worker failed") {
    this.onerror?.({ message } as ErrorEvent)
  }
}

function createClient(worker = new FakeWorker()) {
  return {
    worker,
    client: new BackgroundRemovalWorkerClient(() => worker as unknown as Worker),
  }
}

function imageFile() {
  return new File(["image"], "sample.png", { type: "image/png" })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe("BackgroundRemovalWorkerClient", () => {
  it("resolves matching result messages", async () => {
    const { client, worker } = createClient()
    const resultBlob = new Blob(["result"], { type: "image/png" })

    const promise = client.remove({
      requestId: "request-1",
      file: imageFile(),
      modelId: "imgsplit/rmbg-1.4",
    })

    worker.send({
      type: "result",
      requestId: "request-1",
      image: resultBlob,
      device: "wasm",
    })

    await expect(promise).resolves.toEqual({ image: resultBlob, device: "wasm" })
    expect(worker.postedMessages).toEqual([
      {
        type: "remove-background",
        requestId: "request-1",
        image: expect.any(File),
        modelId: "imgsplit/rmbg-1.4",
      },
    ])
  })

  it("ignores messages for another request id", async () => {
    const { client, worker } = createClient()
    const onStatus = vi.fn()
    const onProgress = vi.fn()
    const resultBlob = new Blob(["result"], { type: "image/png" })

    const promise = client.remove({
      requestId: "request-1",
      file: imageFile(),
      modelId: "imgsplit/rmbg-1.4",
      onStatus,
      onProgress,
    })

    worker.send({
      type: "status",
      requestId: "request-2",
      status: "processing",
      device: "webgpu",
    })
    worker.send({
      type: "download-progress",
      requestId: "request-2",
      progress: 0.5,
      loaded: 50,
      total: 100,
    })
    worker.send({
      type: "result",
      requestId: "request-2",
      image: new Blob(["wrong"], { type: "image/png" }),
      device: "webgpu",
    })

    expect(onStatus).not.toHaveBeenCalled()
    expect(onProgress).not.toHaveBeenCalled()

    worker.send({
      type: "result",
      requestId: "request-1",
      image: resultBlob,
      device: "wasm",
    })

    await expect(promise).resolves.toEqual({ image: resultBlob, device: "wasm" })
  })

  it("rejects matching error messages", async () => {
    const { client, worker } = createClient()

    const promise = client.remove({
      requestId: "request-1",
      file: imageFile(),
      modelId: "imgsplit/rmbg-1.4",
    })

    worker.send({
      type: "error",
      requestId: "request-1",
      message: "Background removal failed",
    })

    await expect(promise).rejects.toThrow("Background removal failed")
  })

  it("calls status and progress callbacks for matching messages", async () => {
    const { client, worker } = createClient()
    const onStatus = vi.fn()
    const onProgress = vi.fn()
    const resultBlob = new Blob(["result"], { type: "image/png" })

    const promise = client.remove({
      requestId: "request-1",
      file: imageFile(),
      modelId: "imgsplit/rmbg-1.4",
      onStatus,
      onProgress,
    })

    const statusMessage = {
      type: "status",
      requestId: "request-1",
      status: "loading",
      device: "wasm",
    } as const
    const progressMessage = {
      type: "download-progress",
      requestId: "request-1",
      progress: 0.25,
      loaded: 25,
      total: 100,
    } as const

    worker.send(statusMessage)
    worker.send(progressMessage)
    worker.send({
      type: "result",
      requestId: "request-1",
      image: resultBlob,
      device: "wasm",
    })

    expect(onStatus).toHaveBeenCalledWith(statusMessage)
    expect(onProgress).toHaveBeenCalledWith(progressMessage)
    await expect(promise).resolves.toEqual({ image: resultBlob, device: "wasm" })
  })

  it("rejects a second active request", async () => {
    const { client } = createClient()

    const firstPromise = client.remove({
      requestId: "request-1",
      file: imageFile(),
      modelId: "imgsplit/rmbg-1.4",
    })

    await expect(
      client.remove({
        requestId: "request-2",
        file: imageFile(),
        modelId: "imgsplit/rmbg-1.4",
      })
    ).rejects.toThrow("active request")

    client.terminate()
    await expect(firstPromise).rejects.toThrow("canceled")
  })

  it("rejects pending work and terminates the worker", async () => {
    const { client, worker } = createClient()

    const promise = client.remove({
      requestId: "request-1",
      file: imageFile(),
      modelId: "imgsplit/rmbg-1.4",
    })

    client.terminate()

    await expect(promise).rejects.toThrow("canceled")
    expect(worker.terminated).toBe(true)
  })

  it("rejects pending work when the worker errors", async () => {
    const { client, worker } = createClient()

    const promise = client.remove({
      requestId: "request-1",
      file: imageFile(),
      modelId: "imgsplit/rmbg-1.4",
    })

    worker.fail("Worker crashed")

    await expect(promise).rejects.toThrow("Worker crashed")
    expect(worker.terminated).toBe(true)
  })

  it("ignores stale worker events after replacement", async () => {
    const firstWorker = new FakeWorker()
    const secondWorker = new FakeWorker()
    const createWorker = vi
      .fn<[], Worker>()
      .mockReturnValueOnce(firstWorker as unknown as Worker)
      .mockReturnValueOnce(secondWorker as unknown as Worker)
    const client = new BackgroundRemovalWorkerClient(createWorker)

    const firstPromise = client.remove({
      requestId: "request-1",
      file: imageFile(),
      modelId: "imgsplit/rmbg-1.4",
    })

    client.terminate()
    await expect(firstPromise).rejects.toThrow("canceled")

    const secondBlob = new Blob(["result"], { type: "image/png" })
    const secondPromise = client.remove({
      requestId: "request-2",
      file: imageFile(),
      modelId: "imgsplit/rmbg-1.4",
    })

    firstWorker.fail("Late worker error")
    firstWorker.send({
      type: "result",
      requestId: "request-2",
      image: new Blob(["wrong"], { type: "image/png" }),
      device: "webgpu",
    })

    expect(secondWorker.terminated).toBe(false)

    secondWorker.send({
      type: "result",
      requestId: "request-2",
      image: secondBlob,
      device: "wasm",
    })

    await expect(secondPromise).resolves.toEqual({
      image: secondBlob,
      device: "wasm",
    })
  })
})
