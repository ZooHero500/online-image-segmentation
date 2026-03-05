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
  /** 原始图片 Blob */
  imageBlob: Blob
}

/** 上传结果 */
export interface UploadResult {
  file: File
  image: HTMLImageElement
  mimeType: string
}

/** ZIP 导出选项 */
export interface ZipExportOptions {
  originalFileName: string
  results: SplitResult[]
  fileExtension: string
}
