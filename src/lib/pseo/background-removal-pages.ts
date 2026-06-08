import type { RelatedTool, ToolPageData } from "./types"

type LocaleKey = "en" | "zh-CN" | "ja" | "ko" | "es"
type LocaleBackgroundRemovalPages = Record<LocaleKey, Record<string, ToolPageData>>

interface BackgroundRemovalPageSeed {
  slug: string
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  overline: string
  headlinePart1: string
  headlineAccent: string
  headlinePart2: string
  heroDescription: string
  scenarios: ToolPageData["scenarios"]
  faqEntries: ToolPageData["faqEntries"]
}

const relatedTools: Record<LocaleKey, RelatedTool[]> = {
  en: [
    { slug: "/remove-background", title: "AI Background Remover", description: "Remove backgrounds locally and export transparent PNG, WebP, or JPG." },
    { slug: "/compress", title: "Image Compressor", description: "Compress finished transparent or white-background exports." },
    { slug: "/resize", title: "Image Resizer", description: "Crop or resize images before publishing." },
  ],
  "zh-CN": [
    { slug: "/remove-background", title: "AI 去背景", description: "本地移除背景，导出透明 PNG、WebP 或 JPG。" },
    { slug: "/compress", title: "图片压缩", description: "压缩透明背景或白底导出的成品图片。" },
    { slug: "/resize", title: "调整图片尺寸", description: "发布前裁剪或调整图片尺寸。" },
  ],
  ja: [
    { slug: "/remove-background", title: "AI背景削除", description: "ローカルで背景を削除し、透明PNG、WebP、JPGで保存。" },
    { slug: "/compress", title: "画像圧縮", description: "透明背景や白背景の完成画像を軽量化。" },
    { slug: "/resize", title: "画像リサイズ", description: "公開前に画像を切り抜き・リサイズ。" },
  ],
  ko: [
    { slug: "/remove-background", title: "AI 배경 제거", description: "로컬에서 배경을 제거하고 투명 PNG, WebP, JPG로 내보내세요." },
    { slug: "/compress", title: "이미지 압축", description: "투명 배경 또는 흰 배경 결과를 압축하세요." },
    { slug: "/resize", title: "이미지 크기 조정", description: "게시 전에 이미지를 자르거나 크기를 조정하세요." },
  ],
  es: [
    { slug: "/remove-background", title: "Quitar Fondo con IA", description: "Quita fondos localmente y exporta PNG transparente, WebP o JPG." },
    { slug: "/compress", title: "Compresor de imágenes", description: "Comprime resultados con fondo transparente o blanco." },
    { slug: "/resize", title: "Redimensionar imagen", description: "Recorta o redimensiona antes de publicar." },
  ],
}

const howToSteps: Record<LocaleKey, ToolPageData["howToSteps"]> = {
  en: [
    { stepNumber: 1, title: "Upload Images", description: "Choose one image or add several PNG, JPEG, or WebP files for bulk processing." },
    { stepNumber: 2, title: "Run Local AI", description: "Download the model once, then remove backgrounds inside your browser." },
    { stepNumber: 3, title: "Export Results", description: "Download transparent PNG/WebP, white-background JPG, or a ZIP for ready batch items." },
  ],
  "zh-CN": [
    { stepNumber: 1, title: "上传图片", description: "选择一张图片，或添加多张 PNG、JPEG、WebP 进行批量处理。" },
    { stepNumber: 2, title: "运行本地 AI", description: "首次下载模型后，在当前浏览器内完成去背景。" },
    { stepNumber: 3, title: "导出结果", description: "下载透明 PNG/WebP、白底 JPG，或把批量结果打包成 ZIP。" },
  ],
  ja: [
    { stepNumber: 1, title: "画像をアップロード", description: "1枚、または複数のPNG、JPEG、WebPを追加して一括処理します。" },
    { stepNumber: 2, title: "ローカルAIを実行", description: "初回にモデルをダウンロードし、ブラウザ内で背景を削除します。" },
    { stepNumber: 3, title: "結果を書き出し", description: "透明PNG/WebP、白背景JPG、または一括結果のZIPを保存します。" },
  ],
  ko: [
    { stepNumber: 1, title: "이미지 업로드", description: "한 장 또는 여러 PNG, JPEG, WebP 파일을 추가해 일괄 처리하세요." },
    { stepNumber: 2, title: "로컬 AI 실행", description: "처음 모델을 다운로드한 뒤 브라우저 안에서 배경을 제거합니다." },
    { stepNumber: 3, title: "결과 내보내기", description: "투명 PNG/WebP, 흰 배경 JPG 또는 완료된 항목의 ZIP을 다운로드하세요." },
  ],
  es: [
    { stepNumber: 1, title: "Sube imágenes", description: "Elige una imagen o añade varios archivos PNG, JPEG o WebP para procesar en lote." },
    { stepNumber: 2, title: "Ejecuta IA local", description: "Descarga el modelo una vez y quita fondos dentro del navegador." },
    { stepNumber: 3, title: "Exporta resultados", description: "Descarga PNG/WebP transparente, JPG con fondo blanco o un ZIP de elementos listos." },
  ],
}

const seeds: Record<LocaleKey, BackgroundRemovalPageSeed[]> = {
  en: [
    {
      slug: "transparent-background-maker",
      title: "Transparent Background Maker - Free Local AI Tool | ImgSplit",
      description: "Make a transparent background from PNG, JPG, or WebP images with local AI background removal. Browser-based, private, no image upload.",
      ogTitle: "Transparent Background Maker",
      ogDescription: "Create transparent PNG and WebP backgrounds in your browser.",
      overline: "Transparent Background Maker",
      headlinePart1: "Make ",
      headlineAccent: "Transparent Backgrounds",
      headlinePart2: "Online",
      heroDescription: "Remove image backgrounds with local AI, preview the transparent result on a checkerboard, refine edges, and export PNG or WebP without uploading your image.",
      scenarios: [
        { icon: "Image", title: "Transparent PNG Export", description: "Turn product shots, portraits, icons, and graphics into transparent-background assets." },
        { icon: "ShieldCheck", title: "Private Browser Processing", description: "The AI model downloads once; your image stays on your device during editing and export." },
        { icon: "Sparkles", title: "Edge Cleanup", description: "Tune faint leftovers, edge expansion, and feathering before downloading the final result." },
      ],
      faqEntries: [
        { question: "Can I make a transparent background from a JPG?", answer: "Yes. Upload a JPG, remove the background, then export the result as transparent PNG or WebP." },
        { question: "Is my image uploaded?", answer: "No. The model file is downloaded, but image processing and export happen locally in your browser." },
        { question: "Why does the tool download a model first?", answer: "The model enables AI background removal on your device. After download, the browser can reuse the cached model." },
      ],
    },
    {
      slug: "remove-background-free",
      title: "Remove Background Free - Private Local AI Tool | ImgSplit",
      description: "Remove image backgrounds for free with local AI in your browser. No image upload, transparent PNG/WebP export, and batch ZIP downloads.",
      ogTitle: "Remove Background Free",
      ogDescription: "Free browser-based AI background removal with private local processing.",
      overline: "Free Background Remover",
      headlinePart1: "Remove ",
      headlineAccent: "Backgrounds Free",
      headlinePart2: "Online",
      heroDescription: "Use local AI to remove backgrounds from product photos, portraits, and graphics for free. The model downloads once, images stay on your device, and finished files export as PNG, WebP, JPG, or ZIP.",
      scenarios: [
        { icon: "Sparkles", title: "Free AI Cutouts", description: "Create clean transparent cutouts without signing up or uploading image files." },
        { icon: "ShieldCheck", title: "Private by Design", description: "Only the model is downloaded; your image processing happens inside this browser." },
        { icon: "Images", title: "Single or Batch", description: "Remove one background, add more images, or download ready batch results as a ZIP." },
      ],
      faqEntries: [
        { question: "Is this background remover free?", answer: "Yes. The browser tool is free to use and runs background removal locally after the model is available." },
        { question: "Do I need to create an account?", answer: "No. Upload an image, run local AI background removal, and export the result directly from the browser." },
        { question: "Can I download a transparent result?", answer: "Yes. Export transparent PNG or WebP, or choose JPG when you want a white background." },
      ],
    },
    {
      slug: "bulk-background-remover",
      title: "Bulk Background Remover - Batch AI Tool | ImgSplit",
      description: "Remove backgrounds from multiple images in one browser queue. Add images, run local AI background removal, and download results as a ZIP.",
      ogTitle: "Bulk Background Remover",
      ogDescription: "Remove multiple image backgrounds locally and download a ZIP.",
      overline: "Bulk Background Remover",
      headlinePart1: "Remove ",
      headlineAccent: "Backgrounds in Bulk",
      headlinePart2: "Online",
      heroDescription: "Upload several images, run a serial local AI queue, retry failed items, preview finished results, and export transparent files together as a ZIP.",
      scenarios: [
        { icon: "Images", title: "Product Image Sets", description: "Process multiple catalog, marketplace, or shop images with the same cleanup settings." },
        { icon: "Layers", title: "Batch Queue Control", description: "Track not-started, processing, ready, failed, and canceled items before downloading." },
        { icon: "ShieldCheck", title: "No Image Upload", description: "Each image is processed in the browser after the local model is available." },
      ],
      faqEntries: [
        { question: "Can I remove backgrounds from multiple images?", answer: "Yes. Upload several images or use Add more, then start the batch queue." },
        { question: "How do batch downloads work?", answer: "Ready items can be exported as one ZIP. Failed or canceled items are skipped until retried." },
        { question: "Does batch mode upload my files?", answer: "No. The images stay in your browser; only the AI model file is downloaded when needed." },
      ],
    },
  ],
  "zh-CN": [
    {
      slug: "transparent-background-maker",
      title: "透明背景制作工具 - 免费本地 AI | ImgSplit",
      description: "用本地 AI 给 PNG、JPG、WebP 图片制作透明背景。浏览器端处理，图片不上传。",
      ogTitle: "透明背景制作工具",
      ogDescription: "在浏览器中制作透明 PNG 和 WebP 背景。",
      overline: "透明背景制作",
      headlinePart1: "在线制作",
      headlineAccent: "透明背景",
      headlinePart2: "",
      heroDescription: "使用本地 AI 移除图片背景，在棋盘格上预览透明结果，调整边缘清理后导出 PNG 或 WebP。",
      scenarios: [
        { icon: "Image", title: "透明 PNG 导出", description: "把产品图、人像、图标和素材处理成透明背景资源。" },
        { icon: "ShieldCheck", title: "浏览器本地处理", description: "AI 模型只需下载一次；图片编辑和导出保留在本设备。" },
        { icon: "Sparkles", title: "边缘清理", description: "导出前可调整残影清理、边缘扩展和柔化。" },
      ],
      faqEntries: [
        { question: "JPG 可以做成透明背景吗？", answer: "可以。上传 JPG 后移除背景，再导出为透明 PNG 或 WebP。" },
        { question: "图片会上传吗？", answer: "不会。会下载模型文件，但图片处理和导出都在当前浏览器内完成。" },
        { question: "为什么需要先下载模型？", answer: "模型用于在你的设备上运行 AI 去背景。下载后浏览器会缓存，后续通常无需重复下载。" },
      ],
    },
    {
      slug: "remove-background-free",
      title: "免费去背景工具 - 本地 AI 浏览器处理 | ImgSplit",
      description: "免费使用本地 AI 移除图片背景。图片不上传，支持透明 PNG/WebP、白底 JPG 和批量 ZIP 下载。",
      ogTitle: "免费去背景工具",
      ogDescription: "免费浏览器 AI 去背景，图片在本地处理。",
      overline: "免费去背景",
      headlinePart1: "免费在线",
      headlineAccent: "移除图片背景",
      headlinePart2: "",
      heroDescription: "用本地 AI 免费处理商品图、人像和素材背景。模型下载一次后，图片留在本设备，可导出 PNG、WebP、JPG 或批量 ZIP。",
      scenarios: [
        { icon: "Sparkles", title: "免费 AI 抠图", description: "无需注册，也不用上传图片文件，就能制作透明背景图。" },
        { icon: "ShieldCheck", title: "隐私优先", description: "只下载模型文件；图片处理在当前浏览器内完成。" },
        { icon: "Images", title: "单张或批量", description: "可处理一张图，也可继续添加多张并打包下载结果。" },
      ],
      faqEntries: [
        { question: "这个去背景工具免费吗？", answer: "是的。模型可用后，去背景会在浏览器本地免费运行。" },
        { question: "需要注册账号吗？", answer: "不需要。上传图片后运行本地 AI，完成后直接导出结果。" },
        { question: "可以下载透明背景吗？", answer: "可以。支持透明 PNG 或 WebP，也可以选择白底 JPG。" },
      ],
    },
    {
      slug: "bulk-background-remover",
      title: "批量去背景工具 - 本地 AI 批处理 | ImgSplit",
      description: "在浏览器队列中批量移除多张图片背景，支持继续添加、重试、预览和 ZIP 下载。",
      ogTitle: "批量去背景工具",
      ogDescription: "本地批量移除图片背景并打包下载 ZIP。",
      overline: "批量去背景",
      headlinePart1: "批量移除",
      headlineAccent: "图片背景",
      headlinePart2: "",
      heroDescription: "上传多张图片，使用串行本地 AI 队列处理，可重试失败项、预览结果，并把透明结果打包成 ZIP。",
      scenarios: [
        { icon: "Images", title: "商品图批处理", description: "用同一组边缘参数处理目录、店铺或电商图片。" },
        { icon: "Layers", title: "队列状态清楚", description: "查看未开始、处理中、已就绪、失败和取消状态。" },
        { icon: "ShieldCheck", title: "图片不上传", description: "模型可用后，每张图片都在浏览器本地处理。" },
      ],
      faqEntries: [
        { question: "可以一次处理多张图片吗？", answer: "可以。上传多张图片，或先上传一张后继续添加，再开始批量队列。" },
        { question: "批量结果怎么下载？", answer: "已就绪的图片可以打包成一个 ZIP。失败或取消的项目会跳过，重试后再加入。" },
        { question: "批量模式会上传文件吗？", answer: "不会。图片留在浏览器本地，只在需要时下载 AI 模型文件。" },
      ],
    },
  ],
  ja: [
    {
      slug: "transparent-background-maker",
      title: "透明背景メーカー - 無料ローカルAI | ImgSplit",
      description: "PNG、JPG、WebP画像の背景をローカルAIで透明にします。ブラウザ処理で画像はアップロードされません。",
      ogTitle: "透明背景メーカー",
      ogDescription: "ブラウザ内で透明PNGとWebPを作成。",
      overline: "透明背景メーカー",
      headlinePart1: "オンラインで",
      headlineAccent: "透明背景",
      headlinePart2: "を作成",
      heroDescription: "ローカルAIで背景を削除し、チェッカー背景で確認、エッジを調整してPNGまたはWebPで保存できます。",
      scenarios: [
        { icon: "Image", title: "透明PNG書き出し", description: "商品写真、人物、アイコン、素材を透明背景アセットに変換します。" },
        { icon: "ShieldCheck", title: "ブラウザ内で処理", description: "AIモデルは一度ダウンロード。画像は端末内で編集・書き出しされます。" },
        { icon: "Sparkles", title: "エッジ調整", description: "薄い残り、縁の広げ縮め、ぼかしを調整してから保存できます。" },
      ],
      faqEntries: [
        { question: "JPGから透明背景を作れますか？", answer: "はい。JPGをアップロードし、背景を削除して透明PNGまたはWebPで保存できます。" },
        { question: "画像はアップロードされますか？", answer: "いいえ。モデルファイルはダウンロードされますが、画像処理と書き出しはブラウザ内で行われます。" },
        { question: "なぜモデルをダウンロードしますか？", answer: "端末上でAI背景削除を実行するためです。ダウンロード後はブラウザがキャッシュします。" },
      ],
    },
    {
      slug: "remove-background-free",
      title: "無料背景削除ツール - ローカルAIブラウザ処理 | ImgSplit",
      description: "ブラウザ内のローカルAIで無料で画像背景を削除。画像アップロードなし、透明PNG/WebPと一括ZIP保存に対応。",
      ogTitle: "無料背景削除ツール",
      ogDescription: "無料のブラウザAI背景削除。画像はローカルで処理。",
      overline: "無料背景削除",
      headlinePart1: "無料で",
      headlineAccent: "背景を削除",
      headlinePart2: "オンライン",
      heroDescription: "商品写真、人物、素材の背景をローカルAIで無料削除。モデルは一度だけダウンロードし、画像は端末内で処理、PNG、WebP、JPG、ZIPで保存できます。",
      scenarios: [
        { icon: "Sparkles", title: "無料AI切り抜き", description: "登録や画像アップロードなしで透明背景画像を作成できます。" },
        { icon: "ShieldCheck", title: "プライバシー重視", description: "ダウンロードするのはモデルのみ。画像処理はブラウザ内で完了します。" },
        { icon: "Images", title: "単体・一括対応", description: "1枚の背景削除から複数画像のZIP保存まで対応します。" },
      ],
      faqEntries: [
        { question: "この背景削除ツールは無料ですか？", answer: "はい。モデルが利用可能になると、背景削除はブラウザ内で無料実行されます。" },
        { question: "アカウント登録は必要ですか？", answer: "不要です。画像をアップロードし、ローカルAIで処理して直接保存できます。" },
        { question: "透明背景で保存できますか？", answer: "はい。透明PNGまたはWebP、白背景JPGで保存できます。" },
      ],
    },
    {
      slug: "bulk-background-remover",
      title: "一括背景削除ツール - ローカルAIバッチ | ImgSplit",
      description: "複数画像の背景をブラウザ内キューで一括削除。追加、再試行、プレビュー、ZIP保存に対応。",
      ogTitle: "一括背景削除ツール",
      ogDescription: "複数画像の背景をローカルで削除しZIP保存。",
      overline: "一括背景削除",
      headlinePart1: "背景を",
      headlineAccent: "一括削除",
      headlinePart2: "オンライン",
      heroDescription: "複数画像をアップロードし、ローカルAIキューで順番に処理。失敗の再試行、結果確認、透明ファイルのZIP保存ができます。",
      scenarios: [
        { icon: "Images", title: "商品画像セット", description: "カタログ、EC、ショップ画像を同じ調整でまとめて処理します。" },
        { icon: "Layers", title: "キュー管理", description: "未開始、処理中、完了、失敗、キャンセル状態を確認できます。" },
        { icon: "ShieldCheck", title: "画像アップロードなし", description: "モデル利用後、各画像はブラウザ内で処理されます。" },
      ],
      faqEntries: [
        { question: "複数画像の背景を削除できますか？", answer: "はい。複数画像をアップロードするか、追加してから一括キューを開始します。" },
        { question: "一括結果はどう保存しますか？", answer: "完了した項目を1つのZIPとして保存できます。失敗やキャンセルは再試行できます。" },
        { question: "一括モードで画像はアップロードされますか？", answer: "いいえ。画像はブラウザに残り、必要時にAIモデルだけをダウンロードします。" },
      ],
    },
  ],
  ko: [
    {
      slug: "transparent-background-maker",
      title: "투명 배경 만들기 - 무료 로컬 AI | ImgSplit",
      description: "PNG, JPG, WebP 이미지 배경을 로컬 AI로 투명하게 만드세요. 브라우저 처리, 이미지 업로드 없음.",
      ogTitle: "투명 배경 만들기",
      ogDescription: "브라우저에서 투명 PNG와 WebP를 만드세요.",
      overline: "투명 배경 만들기",
      headlinePart1: "온라인으로",
      headlineAccent: "투명 배경",
      headlinePart2: "만들기",
      heroDescription: "로컬 AI로 이미지 배경을 제거하고 체크보드에서 결과를 확인한 뒤 가장자리를 다듬어 PNG 또는 WebP로 내보내세요.",
      scenarios: [
        { icon: "Image", title: "투명 PNG 내보내기", description: "제품 사진, 인물, 아이콘, 그래픽을 투명 배경 자산으로 만드세요." },
        { icon: "ShieldCheck", title: "브라우저 로컬 처리", description: "AI 모델은 한 번 다운로드하고 이미지는 기기 안에서 편집 및 내보내기 됩니다." },
        { icon: "Sparkles", title: "가장자리 정리", description: "희미한 잔여물, 가장자리 확장, 부드럽게 처리를 조정하세요." },
      ],
      faqEntries: [
        { question: "JPG도 투명 배경으로 만들 수 있나요?", answer: "네. JPG를 업로드하고 배경을 제거한 뒤 투명 PNG 또는 WebP로 내보낼 수 있습니다." },
        { question: "이미지가 업로드되나요?", answer: "아니요. 모델 파일은 다운로드되지만 이미지 처리와 내보내기는 브라우저에서 로컬로 실행됩니다." },
        { question: "왜 모델을 먼저 다운로드하나요?", answer: "기기에서 AI 배경 제거를 실행하기 위해서입니다. 다운로드 후 브라우저가 모델을 캐시합니다." },
      ],
    },
    {
      slug: "remove-background-free",
      title: "무료 배경 제거 도구 - 로컬 AI 브라우저 처리 | ImgSplit",
      description: "브라우저 로컬 AI로 이미지 배경을 무료로 제거하세요. 이미지 업로드 없이 투명 PNG/WebP와 일괄 ZIP 다운로드를 지원합니다.",
      ogTitle: "무료 배경 제거 도구",
      ogDescription: "무료 브라우저 AI 배경 제거, 이미지는 로컬 처리.",
      overline: "무료 배경 제거",
      headlinePart1: "무료로",
      headlineAccent: "배경 제거",
      headlinePart2: "온라인",
      heroDescription: "제품 사진, 인물, 그래픽 배경을 로컬 AI로 무료 제거하세요. 모델은 한 번 다운로드되고 이미지는 기기 안에서 처리되며 PNG, WebP, JPG, ZIP으로 내보낼 수 있습니다.",
      scenarios: [
        { icon: "Sparkles", title: "무료 AI 컷아웃", description: "가입이나 이미지 업로드 없이 투명 배경 결과를 만드세요." },
        { icon: "ShieldCheck", title: "개인정보 우선", description: "모델만 다운로드하고 이미지 처리는 브라우저 안에서 완료됩니다." },
        { icon: "Images", title: "단일 또는 일괄", description: "한 장을 처리하거나 여러 이미지를 추가해 ZIP으로 다운로드하세요." },
      ],
      faqEntries: [
        { question: "이 배경 제거 도구는 무료인가요?", answer: "네. 모델이 준비되면 브라우저 안에서 무료로 배경 제거를 실행할 수 있습니다." },
        { question: "계정이 필요한가요?", answer: "아니요. 이미지를 업로드하고 로컬 AI를 실행한 뒤 바로 결과를 내보내세요." },
        { question: "투명 배경으로 다운로드할 수 있나요?", answer: "네. 투명 PNG 또는 WebP, 흰 배경 JPG를 지원합니다." },
      ],
    },
    {
      slug: "bulk-background-remover",
      title: "일괄 배경 제거 도구 - 로컬 AI 배치 | ImgSplit",
      description: "브라우저 대기열에서 여러 이미지 배경을 일괄 제거하세요. 추가, 재시도, 미리보기, ZIP 다운로드를 지원합니다.",
      ogTitle: "일괄 배경 제거 도구",
      ogDescription: "여러 이미지 배경을 로컬로 제거하고 ZIP으로 다운로드하세요.",
      overline: "일괄 배경 제거",
      headlinePart1: "이미지 배경",
      headlineAccent: "일괄 제거",
      headlinePart2: "온라인",
      heroDescription: "여러 이미지를 업로드하고 로컬 AI 대기열로 순차 처리하세요. 실패 항목 재시도, 결과 미리보기, 투명 파일 ZIP 내보내기를 지원합니다.",
      scenarios: [
        { icon: "Images", title: "제품 이미지 세트", description: "카탈로그, 마켓플레이스, 쇼핑몰 이미지를 같은 설정으로 처리하세요." },
        { icon: "Layers", title: "대기열 제어", description: "시작 전, 처리 중, 완료, 실패, 취소 상태를 확인하세요." },
        { icon: "ShieldCheck", title: "이미지 업로드 없음", description: "모델이 준비되면 각 이미지는 브라우저 안에서 처리됩니다." },
      ],
      faqEntries: [
        { question: "여러 이미지 배경을 제거할 수 있나요?", answer: "네. 여러 이미지를 업로드하거나 추가한 뒤 일괄 대기열을 시작하세요." },
        { question: "일괄 결과는 어떻게 다운로드하나요?", answer: "완료된 항목을 하나의 ZIP으로 내보낼 수 있습니다. 실패나 취소 항목은 재시도할 수 있습니다." },
        { question: "일괄 모드에서 파일이 업로드되나요?", answer: "아니요. 이미지는 브라우저에 머물며 필요할 때 AI 모델 파일만 다운로드됩니다." },
      ],
    },
  ],
  es: [
    {
      slug: "transparent-background-maker",
      title: "Creador de Fondo Transparente - IA Local Gratis | ImgSplit",
      description: "Crea fondos transparentes desde PNG, JPG o WebP con IA local. Procesamiento en navegador, privado y sin subir imágenes.",
      ogTitle: "Creador de Fondo Transparente",
      ogDescription: "Crea PNG y WebP transparentes en tu navegador.",
      overline: "Fondo Transparente",
      headlinePart1: "Crea ",
      headlineAccent: "Fondos Transparentes",
      headlinePart2: "Online",
      heroDescription: "Quita fondos con IA local, previsualiza el resultado transparente, ajusta bordes y exporta PNG o WebP sin subir tu imagen.",
      scenarios: [
        { icon: "Image", title: "Exportación PNG transparente", description: "Convierte productos, retratos, iconos y gráficos en recursos con fondo transparente." },
        { icon: "ShieldCheck", title: "Procesamiento privado", description: "El modelo se descarga una vez; tu imagen permanece en el dispositivo." },
        { icon: "Sparkles", title: "Limpieza de borde", description: "Ajusta restos tenues, expansión y suavizado antes de descargar." },
      ],
      faqEntries: [
        { question: "¿Puedo crear fondo transparente desde JPG?", answer: "Sí. Sube un JPG, quita el fondo y exporta como PNG o WebP transparente." },
        { question: "¿Se sube mi imagen?", answer: "No. Se descarga el modelo, pero el procesamiento y la exportación ocurren en tu navegador." },
        { question: "¿Por qué se descarga un modelo?", answer: "El modelo permite quitar fondos con IA en tu dispositivo. Después, el navegador puede reutilizar la caché." },
      ],
    },
    {
      slug: "remove-background-free",
      title: "Quitar Fondo Gratis - IA Local Privada | ImgSplit",
      description: "Quita fondos gratis con IA local en tu navegador. Sin subir imágenes, con PNG/WebP transparente y descargas ZIP por lote.",
      ogTitle: "Quitar Fondo Gratis",
      ogDescription: "Eliminación de fondo gratis en navegador con procesamiento local privado.",
      overline: "Quitar Fondo Gratis",
      headlinePart1: "Quita ",
      headlineAccent: "Fondos Gratis",
      headlinePart2: "Online",
      heroDescription: "Usa IA local para quitar fondos de productos, retratos y gráficos gratis. El modelo se descarga una vez, las imágenes permanecen en tu dispositivo y puedes exportar PNG, WebP, JPG o ZIP.",
      scenarios: [
        { icon: "Sparkles", title: "Recortes IA gratis", description: "Crea imágenes con fondo transparente sin registro ni subida de archivos." },
        { icon: "ShieldCheck", title: "Privacidad primero", description: "Solo se descarga el modelo; tus imágenes se procesan dentro del navegador." },
        { icon: "Images", title: "Una imagen o lote", description: "Quita un fondo, añade más imágenes o descarga resultados listos como ZIP." },
      ],
      faqEntries: [
        { question: "¿Este quitador de fondos es gratis?", answer: "Sí. Cuando el modelo está disponible, la eliminación de fondo se ejecuta gratis en el navegador." },
        { question: "¿Necesito una cuenta?", answer: "No. Sube una imagen, ejecuta IA local y exporta el resultado directamente." },
        { question: "¿Puedo descargar fondo transparente?", answer: "Sí. Exporta PNG o WebP transparente, o JPG con fondo blanco." },
      ],
    },
    {
      slug: "bulk-background-remover",
      title: "Quitador de Fondos por Lote - IA Local | ImgSplit",
      description: "Quita fondos de varias imágenes en una cola del navegador. Añade imágenes, ejecuta IA local y descarga un ZIP.",
      ogTitle: "Quitador de Fondos por Lote",
      ogDescription: "Quita fondos de varias imágenes localmente y descarga un ZIP.",
      overline: "Fondos por Lote",
      headlinePart1: "Quita ",
      headlineAccent: "Fondos en Lote",
      headlinePart2: "Online",
      heroDescription: "Sube varias imágenes, ejecuta una cola local con IA, reintenta fallos, previsualiza resultados y exporta archivos transparentes en un ZIP.",
      scenarios: [
        { icon: "Images", title: "Conjuntos de producto", description: "Procesa imágenes de catálogo, marketplace o tienda con los mismos ajustes." },
        { icon: "Layers", title: "Control de cola", description: "Revisa estados sin iniciar, en proceso, listos, fallidos y cancelados." },
        { icon: "ShieldCheck", title: "Sin subir imágenes", description: "Cada imagen se procesa en el navegador cuando el modelo está disponible." },
      ],
      faqEntries: [
        { question: "¿Puedo quitar fondos de varias imágenes?", answer: "Sí. Sube varias imágenes o usa Añadir más y luego inicia la cola por lote." },
        { question: "¿Cómo funcionan las descargas por lote?", answer: "Los elementos listos se exportan como un ZIP. Los fallidos o cancelados se omiten hasta reintentarlos." },
        { question: "¿El modo por lote sube mis archivos?", answer: "No. Las imágenes permanecen en tu navegador; solo se descarga el modelo cuando hace falta." },
      ],
    },
  ],
}

function createPages(locale: LocaleKey): Record<string, ToolPageData> {
  return Object.fromEntries(
    seeds[locale].map((seed) => [
      seed.slug,
      {
        slug: seed.slug,
        category: "use-case",
        seo: {
          title: seed.title,
          description: seed.description,
          ogTitle: seed.ogTitle,
          ogDescription: seed.ogDescription,
        },
        hero: {
          overline: seed.overline,
          headlinePart1: seed.headlinePart1,
          headlineAccent: seed.headlineAccent,
          headlinePart2: seed.headlinePart2,
          description: seed.heroDescription,
        },
        scenarios: seed.scenarios,
        howToSteps: howToSteps[locale],
        faqEntries: seed.faqEntries,
        relatedTools: relatedTools[locale],
      },
    ])
  )
}

export const backgroundRemovalPagesByLocale: LocaleBackgroundRemovalPages = {
  en: createPages("en"),
  "zh-CN": createPages("zh-CN"),
  ja: createPages("ja"),
  ko: createPages("ko"),
  es: createPages("es"),
}
