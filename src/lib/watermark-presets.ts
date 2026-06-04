import {
  createWatermarkLayer,
  createWatermarkState,
  type WatermarkState,
} from "./watermark"

export type WatermarkTemplateId =
  | "corner-copyright"
  | "center-mark"
  | "diagonal-repeat"
  | "dense-anti-theft"
  | "brand-badge"
  | "subtle-protection"

export interface WatermarkTemplate {
  id: WatermarkTemplateId
  labelKey: string
  descriptionKey: string
}

export interface ApplyTemplateOptions {
  imageWidth: number
  imageHeight: number
  text?: string
}

export interface ApplyTemplateToStateOptions extends ApplyTemplateOptions {
  targetLayerId?: string | null
}

export const WATERMARK_TEMPLATES: WatermarkTemplate[] = [
  {
    id: "corner-copyright",
    labelKey: "templateCorner",
    descriptionKey: "templateCornerDesc",
  },
  {
    id: "center-mark",
    labelKey: "templateCenter",
    descriptionKey: "templateCenterDesc",
  },
  {
    id: "diagonal-repeat",
    labelKey: "templateDiagonal",
    descriptionKey: "templateDiagonalDesc",
  },
  {
    id: "dense-anti-theft",
    labelKey: "templateDense",
    descriptionKey: "templateDenseDesc",
  },
  {
    id: "brand-badge",
    labelKey: "templateBrand",
    descriptionKey: "templateBrandDesc",
  },
  {
    id: "subtle-protection",
    labelKey: "templateSubtle",
    descriptionKey: "templateSubtleDesc",
  },
]

export function applyWatermarkTemplate(
  templateId: WatermarkTemplateId,
  options: ApplyTemplateOptions
): WatermarkState {
  const text = options.text ?? "Copyright"

  switch (templateId) {
    case "corner-copyright":
      return createWatermarkState([
        createWatermarkLayer("text", {
          text,
          x: 0.82,
          y: 0.9,
          rotation: 0,
          opacity: 0.55,
          fontSize: Math.max(24, Math.round(options.imageWidth * 0.035)),
        }),
      ])
    case "center-mark":
      return createWatermarkState([
        createWatermarkLayer("text", {
          text,
          x: 0.5,
          y: 0.5,
          rotation: 0,
          opacity: 0.28,
          fontSize: Math.max(48, Math.round(options.imageWidth * 0.08)),
        }),
      ])
    case "diagonal-repeat":
      return createWatermarkState([
        createWatermarkLayer("text", {
          text,
          repeatMode: "repeat",
          rotation: -28,
          opacity: 0.22,
          fontSize: Math.max(28, Math.round(options.imageWidth * 0.04)),
          spacingX: 320,
          spacingY: 200,
        }),
      ])
    case "dense-anti-theft":
      return createWatermarkState([
        createWatermarkLayer("text", {
          text,
          repeatMode: "repeat",
          rotation: -32,
          opacity: 0.32,
          fontSize: Math.max(22, Math.round(options.imageWidth * 0.032)),
          spacingX: 220,
          spacingY: 140,
        }),
      ])
    case "brand-badge":
      return createWatermarkState([
        createWatermarkLayer("text", {
          text,
          x: 0.16,
          y: 0.12,
          rotation: 0,
          opacity: 0.85,
          fontSize: Math.max(24, Math.round(options.imageWidth * 0.04)),
        }),
      ])
    case "subtle-protection":
      return createWatermarkState([
        createWatermarkLayer("text", {
          text,
          x: 0.5,
          y: 0.5,
          rotation: -24,
          opacity: 0.12,
          fontSize: Math.max(72, Math.round(options.imageWidth * 0.12)),
        }),
      ])
  }
}

export function applyWatermarkTemplateToState(
  state: WatermarkState,
  templateId: WatermarkTemplateId,
  options: ApplyTemplateToStateOptions
): WatermarkState {
  const targetLayer =
    state.layers.find(
      (layer) => layer.id === options.targetLayerId && layer.type === "text"
    ) ?? state.layers.find((layer) => layer.type === "text")

  const templateLayer = applyWatermarkTemplate(templateId, {
    imageWidth: options.imageWidth,
    imageHeight: options.imageHeight,
    text: options.text ?? targetLayer?.text,
  }).layers[0]

  if (!targetLayer) {
    return {
      layers: [...state.layers, templateLayer],
      selectedLayerId: templateLayer.id,
    }
  }

  return {
    layers: state.layers.map((layer) =>
      layer.id === targetLayer.id
        ? {
            ...templateLayer,
            id: layer.id,
            enabled: layer.enabled,
          }
        : layer
    ),
    selectedLayerId: targetLayer.id,
  }
}
