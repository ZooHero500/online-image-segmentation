import type { RelatedTool, ToolPageData } from "./types"

type LocaleKey = "en" | "zh-CN" | "ja" | "ko" | "es"
type LocaleSocialExportPages = Record<LocaleKey, Record<string, ToolPageData>>

interface SocialExportPageSeed {
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
    { slug: "/social-export", title: "Social Export", description: "Generate multiple social sizes from one source image." },
    { slug: "/resize", title: "Image Resizer", description: "Create a custom crop or one-off platform size." },
    { slug: "/compress", title: "Image Compressor", description: "Compress finished exports for faster uploads." },
  ],
  "zh-CN": [
    { slug: "/social-export", title: "社媒导出", description: "一张图片生成多个社交平台尺寸。" },
    { slug: "/resize", title: "图片调整尺寸", description: "制作自定义裁剪或单个社媒尺寸。" },
    { slug: "/compress", title: "图片压缩", description: "导出后压缩图片，方便上传。" },
  ],
  ja: [
    { slug: "/social-export", title: "SNS書き出し", description: "1枚の画像から複数のSNSサイズを生成。" },
    { slug: "/resize", title: "画像リサイズ", description: "カスタムトリミングや単一サイズを作成。" },
    { slug: "/compress", title: "画像圧縮", description: "完成した書き出しを軽量化。" },
  ],
  ko: [
    { slug: "/social-export", title: "소셜 내보내기", description: "이미지 한 장에서 여러 소셜 크기를 만드세요." },
    { slug: "/resize", title: "이미지 크기 조정", description: "사용자 지정 자르기나 단일 플랫폼 크기를 만드세요." },
    { slug: "/compress", title: "이미지 압축", description: "완성된 내보내기 파일을 더 작게 압축하세요." },
  ],
  es: [
    { slug: "/social-export", title: "Exportación social", description: "Genera varios tamaños sociales desde una imagen." },
    { slug: "/resize", title: "Redimensionar imagen", description: "Crea un recorte personalizado o un tamaño puntual." },
    { slug: "/compress", title: "Compresor de imágenes", description: "Comprime los archivos finales para subirlos más rápido." },
  ],
}

const howToSteps: Record<LocaleKey, ToolPageData["howToSteps"]> = {
  en: [
    { stepNumber: 1, title: "Upload One Image", description: "Add a PNG, JPEG, or WebP image. It stays in your browser." },
    { stepNumber: 2, title: "Pick Platform Sizes", description: "Select Instagram, YouTube, Facebook, X/Twitter, LinkedIn, or TikTok outputs." },
    { stepNumber: 3, title: "Export ZIP", description: "Fine-tune crops, choose a format, and download a platform-named ZIP." },
  ],
  "zh-CN": [
    { stepNumber: 1, title: "上传一张图片", description: "添加 PNG、JPEG 或 WebP，图片保留在浏览器本地。" },
    { stepNumber: 2, title: "选择平台尺寸", description: "勾选小红书、微信、抖音/TikTok、Instagram、YouTube、Facebook、X 或 LinkedIn 输出。" },
    { stepNumber: 3, title: "导出 ZIP", description: "微调裁剪，选择格式，然后下载按平台命名的 ZIP。" },
  ],
  ja: [
    { stepNumber: 1, title: "画像を1枚アップロード", description: "PNG、JPEG、WebPを追加。画像はブラウザ内に留まります。" },
    { stepNumber: 2, title: "SNSサイズを選択", description: "Instagram、YouTube、X、TikTok、小紅書、WeChat、Facebookの出力を選びます。" },
    { stepNumber: 3, title: "ZIPを書き出し", description: "トリミングを調整し、形式を選んでZIPを保存します。" },
  ],
  ko: [
    { stepNumber: 1, title: "이미지 한 장 업로드", description: "PNG, JPEG, WebP 이미지를 추가하세요. 파일은 브라우저에 머뭅니다." },
    { stepNumber: 2, title: "플랫폼 크기 선택", description: "Instagram, YouTube, X, TikTok, Xiaohongshu, WeChat, Facebook 출력을 선택하세요." },
    { stepNumber: 3, title: "ZIP 내보내기", description: "자르기를 조정하고 형식을 선택한 뒤 플랫폼별 ZIP을 다운로드하세요." },
  ],
  es: [
    { stepNumber: 1, title: "Sube una imagen", description: "Añade PNG, JPEG o WebP. El archivo permanece en tu navegador." },
    { stepNumber: 2, title: "Elige tamaños", description: "Selecciona salidas para Instagram, YouTube, X, TikTok, Xiaohongshu, WeChat o Facebook." },
    { stepNumber: 3, title: "Exporta ZIP", description: "Ajusta recortes, elige formato y descarga un ZIP por plataforma." },
  ],
}

const seeds: Record<LocaleKey, SocialExportPageSeed[]> = {
  en: [
    {
      slug: "social-media-image-resizer",
      title: "Social Media Image Resizer Online | ImgSplit",
      description: "Resize one image for multiple social media platforms and download all outputs as a ZIP. Free, private, browser-based.",
      ogTitle: "Social Media Image Resizer",
      ogDescription: "Turn one image into multiple social-ready sizes.",
      overline: "Social Image Resizer",
      headlinePart1: "Resize for ",
      headlineAccent: "Every Platform",
      headlinePart2: "",
      heroDescription: "Create Instagram posts, stories, YouTube thumbnails, Facebook covers, X headers, LinkedIn posts, and TikTok vertical images from one source image.",
      scenarios: [
        { icon: "Share2", title: "Multi-Platform Posts", description: "Prepare one campaign image for several social channels without repeating manual crops." },
        { icon: "Package", title: "Named ZIP Export", description: "Download outputs grouped by platform with size labels in each filename." },
      ],
      faqEntries: [
        { question: "Can I export multiple social sizes at once?", answer: "Yes. Select the sizes you need and download them as one ZIP." },
        { question: "Can I adjust each crop?", answer: "Yes. Select an output, drag the preview, and adjust fill, fit, and scale." },
        { question: "Are images uploaded?", answer: "No. Rendering and ZIP creation happen in your browser." },
      ],
    },
    {
      slug: "resize-image-for-social-media",
      title: "Resize Image for Social Media - Free Online Tool | ImgSplit",
      description: "Resize an image for Instagram, YouTube, Facebook, X/Twitter, LinkedIn, and TikTok in one browser workflow.",
      ogTitle: "Resize Image for Social Media",
      ogDescription: "Generate multiple platform crops from one image.",
      overline: "Social Media Resize",
      headlinePart1: "Resize One Image ",
      headlineAccent: "For Social",
      headlinePart2: "",
      heroDescription: "Upload once, choose Western or Chinese creator preset packs, tune the crop for each size, and download a clean ZIP for publishing.",
      scenarios: [
        { icon: "Layers2", title: "Content Operations", description: "Prepare repeated launch, event, product, or announcement visuals for several networks." },
        { icon: "SlidersHorizontal", title: "Per-Size Control", description: "Keep faces, products, and text centered for each different aspect ratio." },
      ],
      faqEntries: [
        { question: "Which platforms are included?", answer: "The Western pack includes Instagram, Facebook, YouTube, X/Twitter, LinkedIn, and TikTok presets. The Chinese creator pack includes Xiaohongshu and WeChat presets." },
        { question: "Can I export JPEG or WebP?", answer: "Yes. Choose PNG, JPEG, or WebP before downloading the ZIP." },
        { question: "Can I use only one size?", answer: "Yes. Deselect every size except the one you need." },
      ],
    },
    {
      slug: "instagram-image-size",
      title: "Instagram Image Size Exporter - Feed & Story | ImgSplit",
      description: "Create Instagram feed square, feed portrait, and Story/Reel image sizes from one source image. Private browser export.",
      ogTitle: "Instagram Image Size Exporter",
      ogDescription: "Generate Instagram feed and story sizes from one image.",
      overline: "Instagram Image Size",
      headlinePart1: "Create ",
      headlineAccent: "Instagram Sizes",
      headlinePart2: "Fast",
      heroDescription: "Export 1080x1080 feed squares, 1080x1350 portrait posts, and 1080x1920 story or reel images from one upload.",
      scenarios: [
        { icon: "Instagram", title: "Feed and Stories", description: "Prepare square, portrait, and vertical Instagram assets in a single flow." },
        { icon: "MousePointer2", title: "Crop Focus", description: "Move the crop per output so people, products, and captions stay visible." },
      ],
      faqEntries: [
        { question: "What Instagram sizes are included?", answer: "The editor includes 1080x1080, 1080x1350, and 1080x1920 outputs." },
        { question: "Can I export only Instagram files?", answer: "Yes. Keep the Instagram presets selected and deselect the others." },
        { question: "Does it support reels?", answer: "The 1080x1920 vertical preset is suitable for story and reel-style image assets." },
      ],
    },
    {
      slug: "youtube-thumbnail-size",
      title: "YouTube Thumbnail Size Exporter - 1280x720 | ImgSplit",
      description: "Resize images to the 1280x720 YouTube thumbnail size and export with optional social companion sizes.",
      ogTitle: "YouTube Thumbnail Size Exporter",
      ogDescription: "Create 1280x720 YouTube thumbnails in your browser.",
      overline: "YouTube Thumbnail Size",
      headlinePart1: "Export ",
      headlineAccent: "1280x720",
      headlinePart2: "Thumbnails",
      heroDescription: "Create a 16:9 YouTube thumbnail from any image, then optionally export matching social post sizes in the same ZIP.",
      scenarios: [
        { icon: "Youtube", title: "Video Thumbnails", description: "Turn a poster, screenshot, product image, or campaign visual into a 1280x720 thumbnail." },
        { icon: "Share2", title: "Companion Posts", description: "Create YouTube plus Instagram, X, or TikTok companion assets at the same time." },
      ],
      faqEntries: [
        { question: "What is the YouTube thumbnail output size?", answer: "The preset exports 1280 x 720 pixels." },
        { question: "Can I keep the crop centered?", answer: "Yes. Use fill mode and drag the preview until the important area is centered." },
        { question: "Can I download PNG or JPEG?", answer: "Yes. Select PNG, JPEG, or WebP before exporting." },
      ],
    },
    {
      slug: "wechat-cover-size",
      title: "WeChat Cover Size Exporter - Article Cover Tool | ImgSplit",
      description: "Create a wide WeChat article cover from one image and export it with other social platform sizes in a private browser workflow.",
      ogTitle: "WeChat Cover Size Exporter",
      ogDescription: "Make WeChat article covers and companion social sizes.",
      overline: "WeChat Cover Size",
      headlinePart1: "Create ",
      headlineAccent: "WeChat Covers",
      headlinePart2: "Online",
      heroDescription: "Crop a source image into a wide WeChat article cover and export related platform sizes without uploading files.",
      scenarios: [
        { icon: "Newspaper", title: "Article Covers", description: "Prepare a wide cover image for WeChat article publishing." },
        { icon: "Globe2", title: "Cross-Channel Publishing", description: "Export WeChat, Instagram, YouTube, X, and Xiaohongshu sizes from one image." },
      ],
      faqEntries: [
        { question: "What WeChat cover size does this use?", answer: "The preset exports a 900 x 383 wide article cover." },
        { question: "Can I export WeChat only?", answer: "Yes. Select only the WeChat cover output before downloading." },
        { question: "Is this private?", answer: "Yes. The image is processed locally in your browser." },
      ],
    },
  ],
  "zh-CN": [
    {
      slug: "social-media-image-resizer",
      title: "社交媒体图片尺寸批量调整工具 | ImgSplit",
      description: "一张图生成多个社交平台尺寸，并打包下载 ZIP。免费、私密、浏览器端处理。",
      ogTitle: "社交媒体图片尺寸调整",
      ogDescription: "一张图片生成多个社媒尺寸。",
      overline: "社媒图片尺寸",
      headlinePart1: "一键生成",
      headlineAccent: "多平台尺寸",
      headlinePart2: "",
      heroDescription: "从一张源图生成 Instagram、YouTube、X、小红书、微信、TikTok 和 Facebook 等平台尺寸。",
      scenarios: [
        { icon: "Share2", title: "多平台发布", description: "同一张活动图或产品图，不用重复手动裁剪。" },
        { icon: "Package", title: "命名 ZIP", description: "按平台分组下载，每个文件名都带尺寸标签。" },
      ],
      faqEntries: [
        { question: "可以一次导出多个社媒尺寸吗？", answer: "可以。勾选需要的尺寸后，一次性下载 ZIP。" },
        { question: "每个尺寸都能单独调裁剪吗？", answer: "可以。选择输出尺寸后拖动预览，并调整填充、适配和缩放。" },
        { question: "图片会上传吗？", answer: "不会。渲染和 ZIP 生成都在浏览器本地完成。" },
      ],
    },
    {
      slug: "resize-image-for-social-media",
      title: "在线调整图片为社交媒体尺寸 | ImgSplit",
      description: "在一个浏览器工作流中，把图片调整为 Instagram、YouTube、X、小红书、微信、TikTok 和 Facebook 尺寸。",
      ogTitle: "调整图片为社媒尺寸",
      ogDescription: "一张图生成多个平台裁剪。",
      overline: "社媒尺寸调整",
      headlinePart1: "把一张图调整为",
      headlineAccent: "社媒尺寸",
      headlinePart2: "",
      heroDescription: "上传一次，选择需要的平台输出，逐个调整裁剪，然后下载干净的发布用 ZIP。",
      scenarios: [
        { icon: "Layers2", title: "内容运营", description: "批量准备发布、活动、产品和公告素材。" },
        { icon: "SlidersHorizontal", title: "单尺寸控制", description: "不同长宽比下也能保持人像、产品和文字居中。" },
      ],
      faqEntries: [
        { question: "包含哪些平台？", answer: "包含 Instagram、Facebook、YouTube、X/Twitter、TikTok、小红书和微信预设。" },
        { question: "可以导出 JPEG 或 WebP 吗？", answer: "可以，下载 ZIP 前可选择 PNG、JPEG 或 WebP。" },
        { question: "只导出一个尺寸可以吗？", answer: "可以，只保留需要的那个尺寸即可。" },
      ],
    },
    {
      slug: "instagram-image-size",
      title: "Instagram 图片尺寸导出工具 - Feed 和 Story | ImgSplit",
      description: "从一张源图生成 Instagram Feed 正方形、Feed 竖图和 Story/Reel 尺寸，浏览器端私密导出。",
      ogTitle: "Instagram 图片尺寸导出",
      ogDescription: "一张图生成 Instagram Feed 和 Story 尺寸。",
      overline: "Instagram 图片尺寸",
      headlinePart1: "快速生成",
      headlineAccent: "Instagram 尺寸",
      headlinePart2: "",
      heroDescription: "导出 1080x1080 Feed 方图、1080x1350 竖图和 1080x1920 Story/Reel 图片。",
      scenarios: [
        { icon: "Instagram", title: "Feed 和 Story", description: "一次准备正方形、竖图和竖屏素材。" },
        { icon: "MousePointer2", title: "裁剪焦点", description: "每个输出都能移动裁剪，保证人物、产品和文字可见。" },
      ],
      faqEntries: [
        { question: "包含哪些 Instagram 尺寸？", answer: "包含 1080x1080、1080x1350 和 1080x1920。" },
        { question: "可以只导出 Instagram 文件吗？", answer: "可以，只保留 Instagram 预设。" },
        { question: "适合 Reel 吗？", answer: "1080x1920 竖版预设适合 Story 和 Reel 风格图片素材。" },
      ],
    },
    {
      slug: "youtube-thumbnail-size",
      title: "YouTube 缩略图尺寸导出 - 1280x720 | ImgSplit",
      description: "把图片调整为 1280x720 YouTube 缩略图尺寸，也可同步导出其他社媒尺寸。",
      ogTitle: "YouTube 缩略图尺寸导出",
      ogDescription: "在浏览器中制作 1280x720 缩略图。",
      overline: "YouTube 缩略图尺寸",
      headlinePart1: "导出",
      headlineAccent: "1280x720",
      headlinePart2: "缩略图",
      heroDescription: "从任意图片生成 16:9 YouTube 缩略图，并可在同一个 ZIP 中导出配套社媒图片。",
      scenarios: [
        { icon: "Youtube", title: "视频缩略图", description: "把海报、截图、产品图或活动图变成 1280x720 缩略图。" },
        { icon: "Share2", title: "配套发布图", description: "同时制作 YouTube、Instagram、X 或 TikTok 配套素材。" },
      ],
      faqEntries: [
        { question: "YouTube 缩略图输出尺寸是多少？", answer: "预设会导出 1280 x 720 像素。" },
        { question: "可以保持主体居中吗？", answer: "可以，使用填充模式并拖动预览到合适位置。" },
        { question: "可以下载 PNG 或 JPEG 吗？", answer: "可以，导出前可选择 PNG、JPEG 或 WebP。" },
      ],
    },
    {
      slug: "wechat-cover-size",
      title: "微信文章封面尺寸导出工具 | ImgSplit",
      description: "从一张图片制作微信文章横版封面，并可在浏览器端同步导出其他社媒尺寸。",
      ogTitle: "微信封面尺寸导出",
      ogDescription: "制作微信文章封面和配套社媒尺寸。",
      overline: "微信封面尺寸",
      headlinePart1: "在线制作",
      headlineAccent: "微信封面",
      headlinePart2: "",
      heroDescription: "把源图裁剪为微信文章横版封面，并导出其他平台尺寸，全程无需上传。",
      scenarios: [
        { icon: "Newspaper", title: "文章封面", description: "为微信公众号文章准备横版封面图。" },
        { icon: "Globe2", title: "跨平台发布", description: "一张图同时导出微信、Instagram、YouTube、X 和小红书尺寸。" },
      ],
      faqEntries: [
        { question: "微信封面使用什么尺寸？", answer: "当前预设导出 900 x 383 横版文章封面。" },
        { question: "可以只导出微信封面吗？", answer: "可以，只勾选微信封面输出即可。" },
        { question: "是否私密？", answer: "是的，图片在浏览器本地处理。" },
      ],
    },
  ],
  ja: [
    {
      slug: "social-media-image-resizer",
      title: "SNS画像リサイズツール | ImgSplit",
      description: "1枚の画像から複数のSNSサイズを生成し、ZIPで保存。無料・プライベート・ブラウザ内処理。",
      ogTitle: "SNS画像リサイズ",
      ogDescription: "1枚の画像を複数のSNSサイズへ。",
      overline: "SNS画像リサイズ",
      headlinePart1: "",
      headlineAccent: "複数SNSサイズ",
      headlinePart2: "を一括生成",
      heroDescription: "Instagram、YouTube、X、TikTok、小紅書、WeChat、Facebook向けサイズを1枚の画像から作成します。",
      scenarios: [
        { icon: "Share2", title: "複数チャネル投稿", description: "キャンペーン画像を何度も手動トリミングせず準備。" },
        { icon: "Package", title: "名前付きZIP", description: "プラットフォーム別に整理されたファイルを保存。" },
      ],
      faqEntries: [
        { question: "複数サイズを同時に書き出せますか？", answer: "はい。必要なサイズを選び、1つのZIPで保存できます。" },
        { question: "各サイズのトリミングを調整できますか？", answer: "はい。出力を選択し、プレビューをドラッグして調整できます。" },
        { question: "画像はアップロードされますか？", answer: "いいえ。処理はブラウザ内で行われます。" },
      ],
    },
    {
      slug: "resize-image-for-social-media",
      title: "画像をSNSサイズにリサイズ - 無料オンライン | ImgSplit",
      description: "Instagram、YouTube、X、TikTok、小紅書、WeChat、Facebook向けに画像をリサイズ。",
      ogTitle: "画像をSNSサイズにリサイズ",
      ogDescription: "1枚の画像から複数のSNSトリミングを生成。",
      overline: "SNSサイズ変換",
      headlinePart1: "画像を",
      headlineAccent: "SNS向け",
      headlinePart2: "に変換",
      heroDescription: "アップロード、出力選択、トリミング調整、ZIP保存までを1つのブラウザワークフローで完了します。",
      scenarios: [
        { icon: "Layers2", title: "運用素材", description: "ローンチ、イベント、商品、告知素材を一括準備。" },
        { icon: "SlidersHorizontal", title: "個別調整", description: "異なる比率でも人物や商品、文字を見やすく配置。" },
      ],
      faqEntries: [
        { question: "どのプラットフォームに対応していますか？", answer: "Instagram、Facebook、YouTube、X/Twitter、TikTok、小紅書、WeChatです。" },
        { question: "JPEGやWebPで保存できますか？", answer: "はい。PNG、JPEG、WebPを選べます。" },
        { question: "1サイズだけでも使えますか？", answer: "はい。必要なサイズだけを選択できます。" },
      ],
    },
    {
      slug: "instagram-image-size",
      title: "Instagram画像サイズ書き出し - Feed & Story | ImgSplit",
      description: "Instagram Feed正方形、Feed縦長、Story/Reelサイズを1枚の画像から生成。",
      ogTitle: "Instagram画像サイズ書き出し",
      ogDescription: "Instagram FeedとStoryサイズを生成。",
      overline: "Instagram画像サイズ",
      headlinePart1: "",
      headlineAccent: "Instagramサイズ",
      headlinePart2: "をすばやく作成",
      heroDescription: "1080x1080、1080x1350、1080x1920のInstagram向け画像をブラウザ内で作成します。",
      scenarios: [
        { icon: "Instagram", title: "FeedとStory", description: "正方形、縦長、縦型素材を一度に準備。" },
        { icon: "MousePointer2", title: "焦点調整", description: "各出力で人物、商品、文字が見えるように調整。" },
      ],
      faqEntries: [
        { question: "含まれるInstagramサイズは？", answer: "1080x1080、1080x1350、1080x1920です。" },
        { question: "Instagramだけを書き出せますか？", answer: "はい。Instagramプリセットだけを選択できます。" },
        { question: "Reelにも使えますか？", answer: "1080x1920の縦型プリセットはStory/Reel風画像に適しています。" },
      ],
    },
    {
      slug: "youtube-thumbnail-size",
      title: "YouTubeサムネイルサイズ書き出し - 1280x720 | ImgSplit",
      description: "画像を1280x720のYouTubeサムネイルサイズにリサイズし、SNS用サイズも同時に生成できます。",
      ogTitle: "YouTubeサムネイルサイズ書き出し",
      ogDescription: "1280x720サムネイルをブラウザで作成。",
      overline: "YouTubeサムネイル",
      headlinePart1: "",
      headlineAccent: "1280x720",
      headlinePart2: "で書き出し",
      heroDescription: "任意の画像から16:9のYouTubeサムネイルを作成し、関連SNSサイズも同じZIPに保存できます。",
      scenarios: [
        { icon: "Youtube", title: "動画サムネイル", description: "ポスター、スクリーンショット、商品画像を1280x720に変換。" },
        { icon: "Share2", title: "同時投稿素材", description: "YouTubeとInstagram、X、TikTok向け素材を一緒に作成。" },
      ],
      faqEntries: [
        { question: "出力サイズは？", answer: "1280 x 720ピクセルです。" },
        { question: "中央に合わせられますか？", answer: "はい。フィルモードでドラッグして調整できます。" },
        { question: "PNGやJPEGで保存できますか？", answer: "はい。PNG、JPEG、WebPを選択できます。" },
      ],
    },
    {
      slug: "wechat-cover-size",
      title: "WeChat記事カバーサイズ書き出し | ImgSplit",
      description: "WeChat記事カバーを作成し、他SNSサイズもブラウザ内で同時に生成。",
      ogTitle: "WeChatカバーサイズ書き出し",
      ogDescription: "WeChat記事カバーとSNSサイズを作成。",
      overline: "WeChatカバーサイズ",
      headlinePart1: "",
      headlineAccent: "WeChatカバー",
      headlinePart2: "を作成",
      heroDescription: "1枚の画像をWeChat記事向け横長カバーにトリミングし、他SNSサイズも保存できます。",
      scenarios: [
        { icon: "Newspaper", title: "記事カバー", description: "WeChat記事公開用の横長カバー画像を準備。" },
        { icon: "Globe2", title: "複数チャネル", description: "WeChat、Instagram、YouTube、X、小紅書向けに同時生成。" },
      ],
      faqEntries: [
        { question: "WeChatカバーのサイズは？", answer: "900 x 383の横長カバーを出力します。" },
        { question: "WeChatだけを書き出せますか？", answer: "はい。WeChatカバーのみ選択できます。" },
        { question: "プライベートですか？", answer: "はい。画像はブラウザ内で処理されます。" },
      ],
    },
  ],
  ko: [
    {
      slug: "social-media-image-resizer",
      title: "소셜 미디어 이미지 리사이저 | ImgSplit",
      description: "이미지 한 장에서 여러 소셜 크기를 만들고 ZIP으로 다운로드하세요. 무료, 비공개, 브라우저 기반.",
      ogTitle: "소셜 미디어 이미지 리사이저",
      ogDescription: "이미지 한 장을 여러 소셜 크기로 변환하세요.",
      overline: "소셜 이미지 리사이저",
      headlinePart1: "",
      headlineAccent: "여러 플랫폼 크기",
      headlinePart2: "를 한 번에",
      heroDescription: "Instagram, YouTube, X, TikTok, Xiaohongshu, WeChat, Facebook 크기를 이미지 한 장에서 생성하세요.",
      scenarios: [
        { icon: "Share2", title: "다중 플랫폼 게시", description: "캠페인 이미지를 반복 자르기 없이 여러 채널용으로 준비하세요." },
        { icon: "Package", title: "이름 있는 ZIP", description: "플랫폼별 폴더와 크기 라벨이 있는 파일로 다운로드하세요." },
      ],
      faqEntries: [
        { question: "여러 소셜 크기를 한 번에 내보낼 수 있나요?", answer: "네. 필요한 크기를 선택하고 하나의 ZIP으로 받을 수 있습니다." },
        { question: "각 크기의 자르기를 조정할 수 있나요?", answer: "네. 출력을 선택하고 미리보기를 드래그해 조정하세요." },
        { question: "이미지가 업로드되나요?", answer: "아니요. 모든 처리는 브라우저에서 이뤄집니다." },
      ],
    },
    {
      slug: "resize-image-for-social-media",
      title: "이미지를 소셜 미디어 크기로 조정 | ImgSplit",
      description: "Instagram, YouTube, X, TikTok, Xiaohongshu, WeChat, Facebook용 크기로 이미지를 조정하세요.",
      ogTitle: "이미지를 소셜 크기로 조정",
      ogDescription: "이미지 한 장에서 여러 플랫폼 자르기를 생성하세요.",
      overline: "소셜 크기 조정",
      headlinePart1: "이미지를",
      headlineAccent: "소셜 크기",
      headlinePart2: "로 변환",
      heroDescription: "업로드, 출력 선택, 자르기 조정, ZIP 다운로드까지 하나의 브라우저 흐름으로 처리하세요.",
      scenarios: [
        { icon: "Layers2", title: "콘텐츠 운영", description: "출시, 이벤트, 제품, 공지 이미지를 여러 채널용으로 준비하세요." },
        { icon: "SlidersHorizontal", title: "크기별 제어", description: "각 비율에서 인물, 제품, 텍스트가 잘 보이도록 조정하세요." },
      ],
      faqEntries: [
        { question: "어떤 플랫폼이 포함되나요?", answer: "Instagram, Facebook, YouTube, X/Twitter, TikTok, Xiaohongshu, WeChat 프리셋이 포함됩니다." },
        { question: "JPEG나 WebP로 내보낼 수 있나요?", answer: "네. PNG, JPEG, WebP를 선택할 수 있습니다." },
        { question: "한 가지 크기만 사용할 수 있나요?", answer: "네. 필요한 크기만 선택하세요." },
      ],
    },
    {
      slug: "instagram-image-size",
      title: "Instagram 이미지 크기 내보내기 - Feed & Story | ImgSplit",
      description: "Instagram 피드 정사각형, 피드 세로형, Story/Reel 크기를 이미지 한 장에서 만드세요.",
      ogTitle: "Instagram 이미지 크기 내보내기",
      ogDescription: "Instagram Feed와 Story 크기를 생성하세요.",
      overline: "Instagram 이미지 크기",
      headlinePart1: "",
      headlineAccent: "Instagram 크기",
      headlinePart2: "빠르게 만들기",
      heroDescription: "1080x1080, 1080x1350, 1080x1920 Instagram 이미지를 브라우저에서 만드세요.",
      scenarios: [
        { icon: "Instagram", title: "Feed와 Story", description: "정사각형, 세로형, 전체 세로 이미지를 한 번에 준비하세요." },
        { icon: "MousePointer2", title: "초점 조정", description: "각 출력에서 사람, 제품, 텍스트가 보이도록 이동하세요." },
      ],
      faqEntries: [
        { question: "어떤 Instagram 크기가 포함되나요?", answer: "1080x1080, 1080x1350, 1080x1920이 포함됩니다." },
        { question: "Instagram 파일만 내보낼 수 있나요?", answer: "네. Instagram 프리셋만 선택하세요." },
        { question: "Reel에도 사용할 수 있나요?", answer: "1080x1920 세로 프리셋은 Story/Reel 스타일 이미지에 적합합니다." },
      ],
    },
    {
      slug: "youtube-thumbnail-size",
      title: "YouTube 썸네일 크기 내보내기 - 1280x720 | ImgSplit",
      description: "이미지를 1280x720 YouTube 썸네일 크기로 조정하고 다른 소셜 크기도 함께 내보내세요.",
      ogTitle: "YouTube 썸네일 크기 내보내기",
      ogDescription: "브라우저에서 1280x720 썸네일을 만드세요.",
      overline: "YouTube 썸네일",
      headlinePart1: "",
      headlineAccent: "1280x720",
      headlinePart2: "내보내기",
      heroDescription: "어떤 이미지든 16:9 YouTube 썸네일로 만들고 관련 소셜 크기도 같은 ZIP에 저장하세요.",
      scenarios: [
        { icon: "Youtube", title: "영상 썸네일", description: "포스터, 스크린샷, 제품 이미지, 캠페인 이미지를 1280x720으로 변환하세요." },
        { icon: "Share2", title: "연동 게시물", description: "YouTube와 Instagram, X, TikTok 소재를 함께 만드세요." },
      ],
      faqEntries: [
        { question: "출력 크기는 무엇인가요?", answer: "1280 x 720 픽셀로 내보냅니다." },
        { question: "가운데에 맞출 수 있나요?", answer: "네. 채우기 모드에서 미리보기를 드래그해 조정하세요." },
        { question: "PNG나 JPEG로 다운로드할 수 있나요?", answer: "네. PNG, JPEG, WebP를 선택할 수 있습니다." },
      ],
    },
    {
      slug: "wechat-cover-size",
      title: "WeChat 아티클 커버 크기 내보내기 | ImgSplit",
      description: "WeChat 아티클 커버를 만들고 다른 소셜 플랫폼 크기도 브라우저에서 함께 생성하세요.",
      ogTitle: "WeChat 커버 크기 내보내기",
      ogDescription: "WeChat 아티클 커버와 소셜 크기를 만드세요.",
      overline: "WeChat 커버 크기",
      headlinePart1: "",
      headlineAccent: "WeChat 커버",
      headlinePart2: "만들기",
      heroDescription: "이미지를 WeChat 아티클용 가로 커버로 자르고 다른 플랫폼 크기도 함께 저장하세요.",
      scenarios: [
        { icon: "Newspaper", title: "아티클 커버", description: "WeChat 아티클 게시용 가로 커버 이미지를 준비하세요." },
        { icon: "Globe2", title: "다중 채널", description: "WeChat, Instagram, YouTube, X, Xiaohongshu 크기를 함께 생성하세요." },
      ],
      faqEntries: [
        { question: "WeChat 커버 크기는 무엇인가요?", answer: "900 x 383 가로 커버를 내보냅니다." },
        { question: "WeChat만 내보낼 수 있나요?", answer: "네. WeChat 커버만 선택하세요." },
        { question: "비공개인가요?", answer: "네. 이미지는 브라우저에서 처리됩니다." },
      ],
    },
  ],
  es: [
    {
      slug: "social-media-image-resizer",
      title: "Redimensionar Imágenes para Redes Sociales | ImgSplit",
      description: "Genera varios tamaños sociales desde una imagen y descarga todo en ZIP. Gratis, privado y en el navegador.",
      ogTitle: "Redimensionar Imágenes Sociales",
      ogDescription: "Convierte una imagen en varios tamaños listos para redes.",
      overline: "Redimensionador social",
      headlinePart1: "Redimensiona para ",
      headlineAccent: "Cada Plataforma",
      headlinePart2: "",
      heroDescription: "Crea tamaños para Instagram, YouTube, X, TikTok, Xiaohongshu, WeChat, Facebook y más desde una sola imagen.",
      scenarios: [
        { icon: "Share2", title: "Publicación multi-plataforma", description: "Prepara una imagen de campaña para varios canales sin recortes repetidos." },
        { icon: "Package", title: "ZIP nombrado", description: "Descarga archivos agrupados por plataforma con etiquetas de tamaño." },
      ],
      faqEntries: [
        { question: "¿Puedo exportar varios tamaños a la vez?", answer: "Sí. Selecciona los tamaños y descarga un único ZIP." },
        { question: "¿Puedo ajustar cada recorte?", answer: "Sí. Selecciona una salida, arrastra la vista previa y ajusta escala." },
        { question: "¿Se suben las imágenes?", answer: "No. Todo ocurre en tu navegador." },
      ],
    },
    {
      slug: "resize-image-for-social-media",
      title: "Redimensionar Imagen para Redes Sociales | ImgSplit",
      description: "Ajusta una imagen para Instagram, YouTube, X, TikTok, Xiaohongshu, WeChat y Facebook en un flujo del navegador.",
      ogTitle: "Redimensionar Imagen para Redes",
      ogDescription: "Genera varios recortes de plataforma desde una imagen.",
      overline: "Tamaños sociales",
      headlinePart1: "Redimensiona una imagen ",
      headlineAccent: "Para Redes",
      headlinePart2: "",
      heroDescription: "Sube una vez, elige salidas sociales, ajusta cada recorte y descarga un ZIP limpio para publicar.",
      scenarios: [
        { icon: "Layers2", title: "Operaciones de contenido", description: "Prepara piezas de lanzamiento, evento, producto o anuncio para varias redes." },
        { icon: "SlidersHorizontal", title: "Control por tamaño", description: "Mantén rostros, productos y texto centrados en cada proporción." },
      ],
      faqEntries: [
        { question: "¿Qué plataformas incluye?", answer: "Incluye Instagram, Facebook, YouTube, X/Twitter, TikTok, Xiaohongshu y WeChat." },
        { question: "¿Puedo exportar JPEG o WebP?", answer: "Sí. Elige PNG, JPEG o WebP antes de descargar." },
        { question: "¿Puedo usar un solo tamaño?", answer: "Sí. Deja seleccionado solo el tamaño que necesitas." },
      ],
    },
    {
      slug: "instagram-image-size",
      title: "Exportador de Tamaños Instagram - Feed y Story | ImgSplit",
      description: "Crea tamaños de Instagram para feed cuadrado, feed vertical y Story/Reel desde una imagen.",
      ogTitle: "Exportador de Tamaños Instagram",
      ogDescription: "Genera tamaños de Instagram Feed y Story desde una imagen.",
      overline: "Tamaño Instagram",
      headlinePart1: "Crea ",
      headlineAccent: "Tamaños Instagram",
      headlinePart2: "Rápido",
      heroDescription: "Exporta 1080x1080, 1080x1350 y 1080x1920 desde una sola imagen en el navegador.",
      scenarios: [
        { icon: "Instagram", title: "Feed y Stories", description: "Prepara formatos cuadrados, verticales y de pantalla completa en un flujo." },
        { icon: "MousePointer2", title: "Enfoque del recorte", description: "Mueve cada recorte para mantener personas, productos y texto visibles." },
      ],
      faqEntries: [
        { question: "¿Qué tamaños incluye?", answer: "Incluye 1080x1080, 1080x1350 y 1080x1920." },
        { question: "¿Puedo exportar solo Instagram?", answer: "Sí. Mantén solo los presets de Instagram seleccionados." },
        { question: "¿Sirve para reels?", answer: "El preset vertical 1080x1920 sirve para recursos tipo Story y Reel." },
      ],
    },
    {
      slug: "youtube-thumbnail-size",
      title: "Tamaño de Miniatura YouTube - 1280x720 | ImgSplit",
      description: "Redimensiona imágenes a 1280x720 para miniaturas de YouTube y exporta tamaños sociales complementarios.",
      ogTitle: "Exportador de Miniaturas YouTube",
      ogDescription: "Crea miniaturas 1280x720 en el navegador.",
      overline: "Miniatura YouTube",
      headlinePart1: "Exporta ",
      headlineAccent: "1280x720",
      headlinePart2: "Miniaturas",
      heroDescription: "Crea una miniatura 16:9 para YouTube desde cualquier imagen y añade tamaños sociales en el mismo ZIP.",
      scenarios: [
        { icon: "Youtube", title: "Miniaturas de video", description: "Convierte posters, capturas, productos o campañas en 1280x720." },
        { icon: "Share2", title: "Posts complementarios", description: "Crea YouTube junto con Instagram, X o TikTok en una sola exportación." },
      ],
      faqEntries: [
        { question: "¿Cuál es el tamaño de salida?", answer: "El preset exporta 1280 x 720 píxeles." },
        { question: "¿Puedo centrar el recorte?", answer: "Sí. Usa modo rellenar y arrastra la vista previa." },
        { question: "¿Puedo descargar PNG o JPEG?", answer: "Sí. Elige PNG, JPEG o WebP antes de exportar." },
      ],
    },
    {
      slug: "wechat-cover-size",
      title: "Tamaño de Portada WeChat - Herramienta Online | ImgSplit",
      description: "Crea una portada ancha para artículos de WeChat y exporta otros tamaños sociales en el navegador.",
      ogTitle: "Exportador de Portadas WeChat",
      ogDescription: "Crea portadas WeChat y tamaños sociales complementarios.",
      overline: "Tamaño WeChat",
      headlinePart1: "Crea ",
      headlineAccent: "Portadas WeChat",
      headlinePart2: "Online",
      heroDescription: "Recorta una imagen como portada ancha para WeChat y exporta tamaños relacionados sin subir archivos.",
      scenarios: [
        { icon: "Newspaper", title: "Portadas de artículo", description: "Prepara una portada ancha para publicaciones de WeChat." },
        { icon: "Globe2", title: "Publicación cruzada", description: "Exporta WeChat, Instagram, YouTube, X y Xiaohongshu desde una imagen." },
      ],
      faqEntries: [
        { question: "¿Qué tamaño usa WeChat?", answer: "El preset exporta una portada ancha de 900 x 383." },
        { question: "¿Puedo exportar solo WeChat?", answer: "Sí. Selecciona solo la salida de portada WeChat." },
        { question: "¿Es privado?", answer: "Sí. La imagen se procesa localmente en el navegador." },
      ],
    },
  ],
}

seeds.en.push(
  {
    slug: "social-media-image-sizes",
    title: "Social Media Image Sizes Guide & Exporter | ImgSplit",
    description: "Create current social media image sizes for Instagram, YouTube, Facebook, X, LinkedIn, and TikTok from one browser-based editor.",
    ogTitle: "Social Media Image Sizes",
    ogDescription: "Export the platform image sizes people actually publish.",
    overline: "Social Media Image Sizes",
    headlinePart1: "Create ",
    headlineAccent: "Platform Sizes",
    headlinePart2: "Fast",
    heroDescription: "Use one source image to export Instagram posts and stories, YouTube thumbnails, Facebook covers, X headers, LinkedIn posts, and vertical TikTok assets.",
    scenarios: [
      { icon: "Ruler", title: "Size Reference", description: "Start from practical platform presets instead of rebuilding dimensions by hand." },
      { icon: "Package", title: "Batch Export", description: "Download selected formats in a single ZIP with platform folders and size labels." },
    ],
    faqEntries: [
      { question: "Which social media image sizes are included?", answer: "The editor includes Instagram feed and story, YouTube thumbnail, Facebook cover, X/Twitter header, LinkedIn post, TikTok vertical, Xiaohongshu cover, and WeChat cover presets." },
      { question: "Can I choose only Western platform sizes?", answer: "Yes. Use the Western preset pack for Instagram, YouTube, Facebook, X/Twitter, LinkedIn, and TikTok-oriented outputs." },
      { question: "Can I still export Chinese platform sizes?", answer: "Yes. Use the Chinese creator pack for Xiaohongshu, WeChat, and vertical short-form outputs." },
    ],
  },
  {
    slug: "instagram-post-size",
    title: "Instagram Post Size Exporter - 1080x1080 & 1080x1350 | ImgSplit",
    description: "Create Instagram post sizes from one image: square feed posts, portrait feed posts, and companion story crops. Private browser export.",
    ogTitle: "Instagram Post Size Exporter",
    ogDescription: "Make 1080x1080 and 1080x1350 Instagram post images.",
    overline: "Instagram Post Size",
    headlinePart1: "Export ",
    headlineAccent: "Instagram Posts",
    headlinePart2: "",
    heroDescription: "Prepare 1080x1080 square posts and 1080x1350 portrait posts from one upload, then fine-tune each crop before downloading.",
    scenarios: [
      { icon: "Instagram", title: "Feed Posts", description: "Create square and portrait feed images without repeating manual resize work." },
      { icon: "Crop", title: "Per-Ratio Crop", description: "Keep faces, products, and text inside the crop for each Instagram aspect ratio." },
    ],
    faqEntries: [
      { question: "What Instagram post sizes does this export?", answer: "The main feed presets export 1080 x 1080 square posts and 1080 x 1350 portrait posts." },
      { question: "Can I make a story from the same image?", answer: "Yes. Keep the 1080 x 1920 Story/Reel preset selected and adjust that crop separately." },
      { question: "Does ImgSplit upload my image?", answer: "No. The image is rendered and zipped locally in your browser." },
    ],
  },
  {
    slug: "instagram-story-size",
    title: "Instagram Story Size Exporter - 1080x1920 | ImgSplit",
    description: "Resize an image to the 1080x1920 Instagram Story size and export optional feed companion images from the same upload.",
    ogTitle: "Instagram Story Size Exporter",
    ogDescription: "Create 1080x1920 Instagram story images in your browser.",
    overline: "Instagram Story Size",
    headlinePart1: "Export ",
    headlineAccent: "1080x1920",
    headlinePart2: "Stories",
    heroDescription: "Turn one image into a vertical Instagram Story or Reel-style asset, then add feed, YouTube, or X companion outputs in the same ZIP.",
    scenarios: [
      { icon: "Smartphone", title: "Vertical Stories", description: "Prepare full-screen 9:16 images for mobile-first publishing." },
      { icon: "Share2", title: "Campaign Companions", description: "Export story and feed sizes together so one campaign visual stays consistent." },
    ],
    faqEntries: [
      { question: "What size is the Instagram Story preset?", answer: "The story preset exports 1080 x 1920 pixels, a 9:16 vertical image." },
      { question: "Can I reposition the image?", answer: "Yes. Select the Story output, drag the preview, and adjust fill, fit, and scale." },
      { question: "Can I export WebP?", answer: "Yes. Choose PNG, JPEG, or WebP before downloading the ZIP." },
    ],
  },
  {
    slug: "facebook-cover-photo-size",
    title: "Facebook Cover Photo Size Exporter | ImgSplit",
    description: "Create Facebook Page cover photo exports and optional group cover companions from one source image. Free private browser tool.",
    ogTitle: "Facebook Cover Photo Size",
    ogDescription: "Export Facebook cover photos with crop control.",
    overline: "Facebook Cover Photo Size",
    headlinePart1: "Create ",
    headlineAccent: "Facebook Covers",
    headlinePart2: "",
    heroDescription: "Crop one image into a Facebook Page cover and related cover-style formats, with separate crop control for each output.",
    scenarios: [
      { icon: "Image", title: "Page Covers", description: "Prepare a wide Facebook Page cover image with the subject placed deliberately." },
      { icon: "LayoutTemplate", title: "Cover Variants", description: "Export page and group-style cover crops from the same source image." },
    ],
    faqEntries: [
      { question: "What Facebook cover size is included?", answer: "The Page cover preset exports 851 x 315 pixels. The group cover-style preset exports 1640 x 856 pixels." },
      { question: "Can I keep text away from the edge?", answer: "Yes. Use the preview to drag the crop before downloading." },
      { question: "Can I export only Facebook covers?", answer: "Yes. Select only the Facebook outputs and download the ZIP." },
    ],
  },
  {
    slug: "linkedin-post-size",
    title: "LinkedIn Post Size Exporter - 1200x628 | ImgSplit",
    description: "Resize one image to the 1200x628 LinkedIn post size and export optional companion social sizes in a browser workflow.",
    ogTitle: "LinkedIn Post Size Exporter",
    ogDescription: "Create 1200x628 LinkedIn post images.",
    overline: "LinkedIn Post Size",
    headlinePart1: "Export ",
    headlineAccent: "LinkedIn Posts",
    headlinePart2: "",
    heroDescription: "Create a 1200x628 LinkedIn post image from any upload, then optionally export Instagram, YouTube, Facebook, or X companion assets.",
    scenarios: [
      { icon: "Share2", title: "Professional Posts", description: "Prepare announcement, launch, and article images for LinkedIn feeds." },
      { icon: "Layers", title: "Cross-Channel Assets", description: "Keep the same visual ready for LinkedIn and other platforms in one export." },
    ],
    faqEntries: [
      { question: "What LinkedIn post size does this export?", answer: "The LinkedIn preset exports 1200 x 628 pixels." },
      { question: "Can I change the crop?", answer: "Yes. Select the LinkedIn output and adjust fill, fit, scale, and position." },
      { question: "Does this work without uploading?", answer: "Yes. The image stays in your browser." },
    ],
  },
  {
    slug: "twitter-header-size",
    title: "Twitter Header Size Exporter - X Header 1500x500 | ImgSplit",
    description: "Create a 1500x500 Twitter/X header image from one source image with crop control and private browser export.",
    ogTitle: "Twitter Header Size Exporter",
    ogDescription: "Make 1500x500 X/Twitter header images.",
    overline: "Twitter Header Size",
    headlinePart1: "Export ",
    headlineAccent: "1500x500",
    headlinePart2: "Headers",
    heroDescription: "Crop any image into a 1500x500 X/Twitter profile header, then export related social sizes from the same source image.",
    scenarios: [
      { icon: "Maximize2", title: "Profile Headers", description: "Create a wide header crop with the subject centered and edge-safe." },
      { icon: "Package", title: "Social ZIP", description: "Add post, thumbnail, and feed formats to the same named ZIP when needed." },
    ],
    faqEntries: [
      { question: "What Twitter/X header size does this use?", answer: "The header preset exports 1500 x 500 pixels." },
      { question: "Can I export X post images too?", answer: "Yes. Keep the X landscape post preset selected or choose the All preset pack." },
      { question: "Can I use JPEG?", answer: "Yes. Choose PNG, JPEG, or WebP before exporting." },
    ],
  }
)

seeds["zh-CN"].push(
  {
    slug: "xiaohongshu-cover-size",
    title: "小红书封面尺寸导出工具 | ImgSplit",
    description: "一张图制作 1080x1440 小红书笔记封面，并可同步导出微信、抖音/TikTok 和其他社媒尺寸。",
    ogTitle: "小红书封面尺寸导出",
    ogDescription: "制作小红书笔记封面和配套社媒图。",
    overline: "小红书封面尺寸",
    headlinePart1: "快速制作",
    headlineAccent: "小红书封面",
    headlinePart2: "",
    heroDescription: "上传一张源图，裁剪为 1080x1440 小红书封面，并按需导出微信封面和竖版短视频配套图。",
    scenarios: [
      { icon: "Image", title: "笔记封面", description: "为小红书笔记、合集和产品图准备竖版封面。" },
      { icon: "Crop", title: "主体可控", description: "拖动裁剪位置，避免人物、商品和标题被截掉。" },
    ],
    faqEntries: [
      { question: "小红书封面预设是多少？", answer: "当前小红书封面预设导出 1080 x 1440 竖版图片。" },
      { question: "可以只导出小红书封面吗？", answer: "可以。选择中文创作者包，或只勾选小红书封面输出。" },
      { question: "图片会上传吗？", answer: "不会。图片处理和 ZIP 生成都在浏览器本地完成。" },
    ],
  },
  {
    slug: "wechat-official-account-cover-size",
    title: "微信公众号封面尺寸导出工具 | ImgSplit",
    description: "在线制作微信公众号文章封面图，支持 900x383 横版封面和多平台配套尺寸，浏览器端私密导出。",
    ogTitle: "微信公众号封面尺寸导出",
    ogDescription: "制作微信公众号文章封面和配套社媒尺寸。",
    overline: "微信公众号封面尺寸",
    headlinePart1: "生成",
    headlineAccent: "公众号封面",
    headlinePart2: "",
    heroDescription: "把一张图片裁剪为微信公众号文章横版封面，并可同步导出小红书、TikTok/抖音和海外社媒尺寸。",
    scenarios: [
      { icon: "FileText", title: "文章头图", description: "为公众号文章准备 900x383 横版封面。" },
      { icon: "Share2", title: "跨平台复用", description: "同一张活动图可继续导出小红书、YouTube 或 Instagram 尺寸。" },
    ],
    faqEntries: [
      { question: "微信公众号封面导出尺寸是多少？", answer: "当前微信文章封面预设导出 900 x 383 横版图片。" },
      { question: "可以调整封面裁剪吗？", answer: "可以。选择微信文章封面后拖动预览，并调整填充、适配和缩放。" },
      { question: "是否支持打包下载？", answer: "支持。勾选多个输出后会按平台文件夹生成 ZIP。" },
    ],
  }
)

function buildPage(seed: SocialExportPageSeed, locale: LocaleKey): ToolPageData {
  return {
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
  }
}

export const socialExportPagesByLocale: LocaleSocialExportPages =
  Object.fromEntries(
    Object.entries(seeds).map(([locale, localeSeeds]) => [
      locale,
      Object.fromEntries(
        localeSeeds.map((seed) => [
          seed.slug,
          buildPage(seed, locale as LocaleKey),
        ])
      ),
    ])
  ) as LocaleSocialExportPages
