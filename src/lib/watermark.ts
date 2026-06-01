export type WatermarkLayerType = "text" | "image"
export type WatermarkRepeatMode = "single" | "repeat"
export type WatermarkOutputFormat = "image/png" | "image/jpeg" | "image/webp"

export interface WatermarkLayer {
  id: string
  type: WatermarkLayerType
  repeatMode: WatermarkRepeatMode
  text: string
  imageSrc: string | null
  imageName: string | null
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  fontSize: number
  fontFamily: string
  color: string
  spacingX: number
  spacingY: number
  enabled: boolean
}

export interface WatermarkState {
  layers: WatermarkLayer[]
  selectedLayerId: string | null
}

let nextWatermarkLayerId = 0

export function createWatermarkLayer(
  type: WatermarkLayerType,
  overrides: Partial<WatermarkLayer> = {}
): WatermarkLayer {
  return {
    id: `wm-${++nextWatermarkLayerId}`,
    type,
    repeatMode: "single",
    text: type === "text" ? "ImgSplit" : "",
    imageSrc: null,
    imageName: null,
    x: 0.5,
    y: 0.5,
    width: 240,
    height: 80,
    rotation: -24,
    opacity: 0.35,
    fontSize: 48,
    fontFamily: "Arial",
    color: "#ffffff",
    spacingX: 280,
    spacingY: 180,
    enabled: true,
    ...overrides,
  }
}

export function createWatermarkState(
  layers: WatermarkLayer[] = []
): WatermarkState {
  return {
    layers,
    selectedLayerId: layers[0]?.id ?? null,
  }
}

export function updateWatermarkLayer(
  state: WatermarkState,
  layerId: string,
  patch: Partial<WatermarkLayer>
): WatermarkState {
  return {
    ...state,
    layers: state.layers.map((layer) =>
      layer.id === layerId ? { ...layer, ...patch } : layer
    ),
  }
}

export function getEnabledLayers(state: WatermarkState): WatermarkLayer[] {
  return state.layers.filter((layer) => layer.enabled)
}
