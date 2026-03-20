/** 分割线 */
export interface SplitLine {
  id: string
  orientation: 'horizontal' | 'vertical'
  /** 像素坐标（相对于原始图片） */
  position: number
}

/** 分割结果 */
export interface SplitResult {
  /** 行号，从 1 开始 */
  row: number
  /** 列号，从 1 开始 */
  col: number
  blob: Blob
  width: number
  height: number
}

/** 图片数据（用于历史记录存储） */
export interface ImageData {
  blob: Blob
  fileName: string
  mimeType: string
}

/** 历史记录 */
export interface HistoryRecord {
  id: string
  originalFileName: string
  originalMimeType: string
  lines: SplitLine[]
  /** Unix timestamp */
  createdAt: number
  /** 缩略图 base64 */
  thumbnailDataUrl: string
  /** 原始图片 Blob（第一张图片，向后兼容） */
  imageBlob: Blob
  /** 所有图片（多图时使用） */
  images?: ImageData[]
}

/** 上传结果 */
export interface UploadResult {
  file: File
  image: HTMLImageElement
  mimeType: string
}

/** 批量分割结果（单张图片） */
export interface BatchSplitResult {
  fileName: string
  mimeType: string
  results: SplitResult[]
}

/** ZIP 导出选项（单图） */
export interface ZipExportOptions {
  originalFileName: string
  results: SplitResult[]
  fileExtension: string
}

/** ZIP 导出选项（多图） */
export interface BatchZipExportOptions {
  items: {
    originalFileName: string
    results: SplitResult[]
    fileExtension: string
  }[]
}

/** AI 识别出的图片元素 */
export interface RecognizedElement {
  /** 英文标签（用于 Lang-SAM 分割） */
  label_en: string
  /** 中文标签（用于界面显示） */
  label_zh: string
  /** 识别置信度 0-1 */
  confidence: number
}

/** AI 分割图层 */
export interface SegmentLayer {
  /** 唯一 ID */
  id: string
  /** 英文标签 */
  label_en: string
  /** 中文标签 */
  label_zh: string
  /** 分割遮罩图片 URL（来自 Replicate） */
  maskUrl: string
  /** 遮罩加载后的 HTMLImageElement */
  maskImage: HTMLImageElement | null
  /** 图层显示颜色（十六进制） */
  color: string
  /** 是否可见 */
  visible: boolean
}

/** AI 分割工作流步骤 */
export type AiSegmentStep = 'upload' | 'analyze' | 'select' | 'segment' | 'result'

/** /api/analyze 请求体 */
export interface AnalyzeRequest {
  /** Base64 编码的图片数据 */
  image: string
}

/** /api/analyze 响应体 */
export interface AnalyzeResponse {
  elements: RecognizedElement[]
}

/** /api/segment 请求体 */
export interface SegmentRequest {
  /** 图片 URL 或 Base64 */
  image: string
  /** 要分割的标签 */
  labels: Array<{ label_en: string; label_zh: string }>
}

/** /api/segment 单个分割结果 */
export interface SegmentResultItem {
  label_en: string
  label_zh: string
  /** 分割后的遮罩图片 URL */
  maskUrl: string
  /** 分配的图层颜色 */
  color: string
}

/** /api/segment 响应体 */
export interface SegmentResponse {
  segments: SegmentResultItem[]
}
