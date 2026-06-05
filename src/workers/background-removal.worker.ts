import type { RawImage } from "@huggingface/transformers"

type RemoveBackgroundMessage = {
  type: "remove-background"
  requestId: string
  image: Blob
  modelId: string
}

type WorkerRequest = RemoveBackgroundMessage

type WorkerStatus = "loading" | "ready" | "processing"
type WorkerDevice = "webgpu" | "wasm"

type WorkerResponse =
  | { type: "status"; requestId: string; status: WorkerStatus; device?: WorkerDevice }
  | { type: "download-progress"; requestId: string; progress: number | null; loaded?: number; total?: number }
  | { type: "result"; requestId: string; image: Blob; device: WorkerDevice }
  | { type: "error"; requestId: string; message: string }

type ProgressEvent = {
  status?: string
  progress?: number
  loaded?: number
  total?: number
}

type CallableProcessor = ((...args: unknown[]) => Promise<unknown>) & {
  image_processor?: unknown
}

type ProcessorObject = {
  _call?: (...args: unknown[]) => Promise<unknown>
  image_processor?: CallableProcessor | ProcessorObject
}

type LoadedSegmenter = {
  processor?: CallableProcessor | ProcessorObject
  model?: ModelLike
}

type ModelLike = {
  sessions?: {
    model?: {
      inputNames?: string[]
      outputNames?: string[]
    }
  }
  (inputs: Record<string, unknown>): Promise<Record<string, TensorLike>>
}

type TensorLike = {
  data: ArrayLike<number> & {
    some?: (callback: (value: number) => boolean) => boolean
  }
  dims: number[]
  sigmoid_: () => TensorLike
  mul_: (value: number) => TensorLike
  to: (type: "uint8") => TensorLike
  [Symbol.iterator]: () => IterableIterator<TensorLike>
}

const workerSelf = globalThis as unknown as {
  location?: Location
  postMessage: (message: WorkerResponse) => void
  onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null
}

const segmenterPromises = new Map<string, Promise<LoadedSegmenter>>()
let activeDevice: WorkerDevice = "wasm"

const modelSource =
  process.env.NEXT_PUBLIC_BACKGROUND_REMOVAL_MODEL_SOURCE ?? "local-with-fallback"
const allowLocalModels = modelSource !== "remote"
const allowRemoteModels = modelSource !== "local"

function post(message: WorkerResponse) {
  workerSelf.postMessage(message)
}

function getPreferredDevice(): WorkerDevice {
  return typeof navigator !== "undefined" && "gpu" in navigator ? "webgpu" : "wasm"
}

function getLocalModelPath(): string {
  const origin = workerSelf.location?.origin
  return origin ? new URL("/models/", origin).href : "/models/"
}

async function loadSegmenter(
  modelId: string,
  device: WorkerDevice,
  requestId: string
): Promise<LoadedSegmenter> {
  const cacheKey = `${modelId}:${device}`
  const cachedSegmenter = segmenterPromises.get(cacheKey)
  if (cachedSegmenter) return cachedSegmenter

  const { AutoProcessor, SegformerForSemanticSegmentation, env } = await import(
    "@huggingface/transformers"
  )
  const usesLocalAlias = modelId.startsWith("imgsplit/")

  env.allowLocalModels = allowLocalModels
  env.allowRemoteModels = allowRemoteModels && !usesLocalAlias
  env.localModelPath = getLocalModelPath()
  env.useBrowserCache = true

  activeDevice = device
  post({ type: "status", requestId, status: "loading", device: activeDevice })

  const segmenterPromise = Promise.all([
    AutoProcessor.from_pretrained(modelId, {
      progress_callback: handleProgress(requestId),
    }),
    SegformerForSemanticSegmentation.from_pretrained(modelId, {
      device,
      dtype: "q8",
      progress_callback: handleProgress(requestId),
    }),
  ]).then(([processor, model]) => ({ processor, model }))

  segmenterPromises.set(cacheKey, segmenterPromise)
  segmenterPromise.catch(() => segmenterPromises.delete(cacheKey))
  return segmenterPromise
}

function getProcessorCallable(
  processor: ProcessorObject
): CallableProcessor | null {
  if (typeof processor._call === "function") {
    return processor._call.bind(processor) as CallableProcessor
  }

  const imageProcessor = processor.image_processor
  if (typeof imageProcessor === "function") return imageProcessor

  if (
    imageProcessor &&
    typeof imageProcessor === "object" &&
    typeof imageProcessor._call === "function"
  ) {
    return imageProcessor._call.bind(imageProcessor) as CallableProcessor
  }

  return null
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

workerSelf.onmessage = (event: MessageEvent<WorkerRequest>) => {
  if (event.data.type !== "remove-background") return

  void removeBackground(event.data).catch((error) => {
    post({
      type: "error",
      requestId: event.data.requestId,
      message: error instanceof Error ? error.message : "Background removal failed",
    })
  })
}

async function removeBackground(message: RemoveBackgroundMessage) {
  const preferredDevice = getPreferredDevice()

  try {
    const image = await removeBackgroundWithDevice(message, preferredDevice)
    post({ type: "result", requestId: message.requestId, image, device: activeDevice })
    return
  } catch (error) {
    if (preferredDevice !== "webgpu") throw error

    segmenterPromises.delete(`${message.modelId}:webgpu`)
    const image = await removeBackgroundWithDevice(message, "wasm")
    post({ type: "result", requestId: message.requestId, image, device: activeDevice })
  }
}

async function removeBackgroundWithDevice(
  message: RemoveBackgroundMessage,
  device: WorkerDevice
) {
  activeDevice = device
  const segmenter = await loadSegmenter(message.modelId, device, message.requestId)
  post({ type: "status", requestId: message.requestId, status: "ready", device: activeDevice })
  post({ type: "status", requestId: message.requestId, status: "processing", device: activeDevice })

  const { RawImage } = await import("@huggingface/transformers")
  const originalImage = await RawImage.fromBlob(message.image)
  const firstMask = await createForegroundMask(segmenter, originalImage, RawImage)

  const mask = await resizeMaskToImage(firstMask, originalImage)
  const outputImage = originalImage.rgba().putAlpha(mask)
  return outputImage.toBlob("image/png", 1)
}

async function createForegroundMask(
  segmenter: LoadedSegmenter,
  image: RawImage,
  rawImage: typeof RawImage
): Promise<RawImage> {
  const processor = segmenter.processor
  const model = segmenter.model
  const processorCallable =
    typeof processor === "function" ? processor : processor && getProcessorCallable(processor)

  if (!processorCallable || !model) {
    throw new Error("Background removal model is not ready")
  }

  const inputs = await processorCallable([image]) as Record<string, unknown>
  const modelInputNames = model.sessions?.model?.inputNames ?? ["pixel_values"]
  const modelOutputNames = model.sessions?.model?.outputNames ?? ["logits"]

  if (!modelInputNames.includes("pixel_values")) {
    const modelInputName = modelInputNames[0]
    if (!modelInputName) throw new Error("No model input name returned")
    inputs[modelInputName] = inputs.pixel_values
  }

  const output = await model(inputs)
  const outputTensor = output[modelOutputNames[0]]
  const firstTensor = outputTensor ? outputTensor[Symbol.iterator]().next().value : null
  if (!firstTensor) throw new Error("No foreground mask returned")

  if (hasValuesOutsideUnitInterval(firstTensor)) {
    firstTensor.sigmoid_()
  }

  return rawImage.fromTensor(
    firstTensor.mul_(255).to("uint8") as Parameters<typeof rawImage.fromTensor>[0]
  )
}

function hasValuesOutsideUnitInterval(tensor: TensorLike): boolean {
  const epsilon = 1e-5
  if (typeof tensor.data.some === "function") {
    return tensor.data.some((value) => value < -epsilon || value > 1 + epsilon)
  }

  for (let i = 0; i < tensor.data.length; i += 1) {
    const value = tensor.data[i]
    if (value < -epsilon || value > 1 + epsilon) return true
  }
  return false
}

async function resizeMaskToImage(mask: RawImage, image: RawImage): Promise<RawImage> {
  if (mask.width === image.width && mask.height === image.height) return mask
  return mask.resize(image.width, image.height)
}
