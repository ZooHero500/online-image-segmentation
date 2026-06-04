export type CollageTemplateId =
  | "two-vertical"
  | "two-horizontal"
  | "diagonal-duo"
  | "three-hero"
  | "three-columns"
  | "four-grid"
  | "five-mosaic"
  | "six-grid"
  | "story-stack"
  | "story-diagonal"

export interface CollagePoint {
  x: number
  y: number
}

export interface CollageSlot {
  id: string
  x: number
  y: number
  width: number
  height: number
  polygon?: CollagePoint[]
}

export interface CollageTemplate {
  id: CollageTemplateId
  labelKey: string
  descriptionKey: string
  imageCount: number
  aspectRatio: number
  slots: CollageSlot[]
}

export interface CollageArtboard {
  id: string
  labelKey: string
  width: number
  height: number
}

export const COLLAGE_ARTBOARDS: CollageArtboard[] = [
  { id: "square", labelKey: "artboardSquare", width: 1080, height: 1080 },
  { id: "story", labelKey: "artboardStory", width: 1080, height: 1920 },
  { id: "landscape", labelKey: "artboardLandscape", width: 1600, height: 900 },
  { id: "print", labelKey: "artboardPrint", width: 2000, height: 2000 },
]

export const COLLAGE_TEMPLATES: CollageTemplate[] = [
  {
    id: "two-vertical",
    labelKey: "templateTwoVertical",
    descriptionKey: "templateTwoVerticalDesc",
    imageCount: 2,
    aspectRatio: 1,
    slots: [
      { id: "left", x: 0, y: 0, width: 0.5, height: 1 },
      { id: "right", x: 0.5, y: 0, width: 0.5, height: 1 },
    ],
  },
  {
    id: "two-horizontal",
    labelKey: "templateTwoHorizontal",
    descriptionKey: "templateTwoHorizontalDesc",
    imageCount: 2,
    aspectRatio: 1,
    slots: [
      { id: "top", x: 0, y: 0, width: 1, height: 0.5 },
      { id: "bottom", x: 0, y: 0.5, width: 1, height: 0.5 },
    ],
  },
  {
    id: "diagonal-duo",
    labelKey: "templateDiagonalDuo",
    descriptionKey: "templateDiagonalDuoDesc",
    imageCount: 2,
    aspectRatio: 1,
    slots: [
      {
        id: "diagonal-left",
        x: 0,
        y: 0,
        width: 0.56,
        height: 1,
        polygon: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 0.7857142857142857, y: 1 },
          { x: 0, y: 1 },
        ],
      },
      {
        id: "diagonal-right",
        x: 0.44,
        y: 0,
        width: 0.56,
        height: 1,
        polygon: [
          { x: 0.21428571428571427, y: 0 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          { x: 0, y: 1 },
        ],
      },
    ],
  },
  {
    id: "three-hero",
    labelKey: "templateThreeHero",
    descriptionKey: "templateThreeHeroDesc",
    imageCount: 3,
    aspectRatio: 1,
    slots: [
      { id: "hero", x: 0, y: 0, width: 0.66, height: 1 },
      { id: "top-right", x: 0.66, y: 0, width: 0.34, height: 0.5 },
      { id: "bottom-right", x: 0.66, y: 0.5, width: 0.34, height: 0.5 },
    ],
  },
  {
    id: "three-columns",
    labelKey: "templateThreeColumns",
    descriptionKey: "templateThreeColumnsDesc",
    imageCount: 3,
    aspectRatio: 1,
    slots: [
      { id: "left", x: 0, y: 0, width: 1 / 3, height: 1 },
      { id: "center", x: 1 / 3, y: 0, width: 1 / 3, height: 1 },
      { id: "right", x: 2 / 3, y: 0, width: 1 / 3, height: 1 },
    ],
  },
  {
    id: "four-grid",
    labelKey: "templateFourGrid",
    descriptionKey: "templateFourGridDesc",
    imageCount: 4,
    aspectRatio: 1,
    slots: [
      { id: "top-left", x: 0, y: 0, width: 0.5, height: 0.5 },
      { id: "top-right", x: 0.5, y: 0, width: 0.5, height: 0.5 },
      { id: "bottom-left", x: 0, y: 0.5, width: 0.5, height: 0.5 },
      { id: "bottom-right", x: 0.5, y: 0.5, width: 0.5, height: 0.5 },
    ],
  },
  {
    id: "five-mosaic",
    labelKey: "templateFiveMosaic",
    descriptionKey: "templateFiveMosaicDesc",
    imageCount: 5,
    aspectRatio: 1,
    slots: [
      { id: "hero-left", x: 0, y: 0, width: 0.5, height: 1 },
      { id: "top-center", x: 0.5, y: 0, width: 0.25, height: 0.5 },
      { id: "top-right", x: 0.75, y: 0, width: 0.25, height: 0.5 },
      { id: "bottom-center", x: 0.5, y: 0.5, width: 0.25, height: 0.5 },
      { id: "bottom-right", x: 0.75, y: 0.5, width: 0.25, height: 0.5 },
    ],
  },
  {
    id: "six-grid",
    labelKey: "templateSixGrid",
    descriptionKey: "templateSixGridDesc",
    imageCount: 6,
    aspectRatio: 1,
    slots: [
      { id: "r1-c1", x: 0, y: 0, width: 1 / 3, height: 0.5 },
      { id: "r1-c2", x: 1 / 3, y: 0, width: 1 / 3, height: 0.5 },
      { id: "r1-c3", x: 2 / 3, y: 0, width: 1 / 3, height: 0.5 },
      { id: "r2-c1", x: 0, y: 0.5, width: 1 / 3, height: 0.5 },
      { id: "r2-c2", x: 1 / 3, y: 0.5, width: 1 / 3, height: 0.5 },
      { id: "r2-c3", x: 2 / 3, y: 0.5, width: 1 / 3, height: 0.5 },
    ],
  },
  {
    id: "story-stack",
    labelKey: "templateStoryStack",
    descriptionKey: "templateStoryStackDesc",
    imageCount: 4,
    aspectRatio: 9 / 16,
    slots: [
      { id: "story-hero", x: 0, y: 0, width: 1, height: 0.48 },
      { id: "story-left", x: 0, y: 0.48, width: 0.5, height: 0.26 },
      { id: "story-right", x: 0.5, y: 0.48, width: 0.5, height: 0.26 },
      { id: "story-bottom", x: 0, y: 0.74, width: 1, height: 0.26 },
    ],
  },
  {
    id: "story-diagonal",
    labelKey: "templateStoryDiagonal",
    descriptionKey: "templateStoryDiagonalDesc",
    imageCount: 4,
    aspectRatio: 9 / 16,
    slots: [
      {
        id: "story-diagonal-hero",
        x: 0,
        y: 0,
        width: 1,
        height: 0.5,
        polygon: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 1, y: 0.86 },
          { x: 0, y: 1 },
        ],
      },
      {
        id: "story-diagonal-left",
        x: 0,
        y: 0.465,
        width: 0.5,
        height: 0.275,
        polygon: [
          { x: 0, y: 0.12727272727272732 },
          { x: 1, y: 0 },
          { x: 1, y: 0.8727272727272726 },
          { x: 0, y: 1 },
        ],
      },
      {
        id: "story-diagonal-right",
        x: 0.5,
        y: 0.43,
        width: 0.5,
        height: 0.275,
        polygon: [
          { x: 0, y: 0.12727272727272732 },
          { x: 1, y: 0 },
          { x: 1, y: 0.8727272727272726 },
          { x: 0, y: 1 },
        ],
      },
      {
        id: "story-diagonal-bottom",
        x: 0,
        y: 0.67,
        width: 1,
        height: 0.33,
        polygon: [
          { x: 0, y: 0.21212121212121218 },
          { x: 0.5, y: 0.10606060606060613 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          { x: 0, y: 1 },
        ],
      },
    ],
  },
]

export function getCollageTemplate(templateId: CollageTemplateId): CollageTemplate {
  return (
    COLLAGE_TEMPLATES.find((template) => template.id === templateId) ??
    COLLAGE_TEMPLATES[0]
  )
}

export function getDefaultArtboardForTemplate(
  templateId: CollageTemplateId
): CollageArtboard {
  if (templateId === "story-stack" || templateId === "story-diagonal") {
    return COLLAGE_ARTBOARDS.find((artboard) => artboard.id === "story")!
  }

  return COLLAGE_ARTBOARDS.find((artboard) => artboard.id === "square")!
}
