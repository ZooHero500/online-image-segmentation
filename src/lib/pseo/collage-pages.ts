import type { RelatedTool, ToolPageData } from "./types"

type LocaleKey = "en" | "zh-CN" | "ja" | "ko" | "es"
type LocaleCollagePages = Record<LocaleKey, Record<string, ToolPageData>>

interface CollagePageSeed {
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
    { slug: "/collage", title: "Photo Collage Maker", description: "Combine multiple photos into one private browser-based collage." },
    { slug: "/resize", title: "Image Resizer", description: "Crop and resize images before adding them to a collage." },
    { slug: "/watermark", title: "Watermark Tool", description: "Add text or logo marks to finished collage exports." },
  ],
  "zh-CN": [
    { slug: "/collage", title: "照片拼图工具", description: "在浏览器中把多张照片组合成一张拼贴图。" },
    { slug: "/resize", title: "调整图片尺寸", description: "拼图前先裁剪或调整图片尺寸。" },
    { slug: "/watermark", title: "水印工具", description: "给完成的拼图添加文字或 Logo 水印。" },
  ],
  ja: [
    { slug: "/collage", title: "写真コラージュ作成", description: "複数の写真をブラウザ内で1枚のコラージュにまとめます。" },
    { slug: "/resize", title: "画像リサイズ", description: "コラージュ前に画像を切り抜き・リサイズ。" },
    { slug: "/watermark", title: "ウォーターマーク", description: "完成したコラージュにテキストやロゴを追加。" },
  ],
  ko: [
    { slug: "/collage", title: "사진 콜라주 만들기", description: "여러 사진을 브라우저에서 하나의 콜라주로 합치세요." },
    { slug: "/resize", title: "이미지 크기 조정", description: "콜라주 전에 이미지를 자르거나 크기를 조정하세요." },
    { slug: "/watermark", title: "워터마크 도구", description: "완성된 콜라주에 텍스트나 로고를 추가하세요." },
  ],
  es: [
    { slug: "/collage", title: "Creador de Collages", description: "Combina varias fotos en un collage privado desde el navegador." },
    { slug: "/resize", title: "Redimensionar Imagen", description: "Recorta o redimensiona imágenes antes de usarlas en un collage." },
    { slug: "/watermark", title: "Marca de Agua", description: "Añade texto o logo al collage exportado." },
  ],
}

const howToSteps: Record<LocaleKey, ToolPageData["howToSteps"]> = {
  en: [
    { stepNumber: 1, title: "Upload Photos", description: "Add PNG, JPEG, or WebP images. Files stay in your browser." },
    { stepNumber: 2, title: "Choose a Layout", description: "Pick a collage template, then assign, drag, scale, rotate, or fit each photo." },
    { stepNumber: 3, title: "Export", description: "Set spacing, margin, radius, background, and download PNG, JPEG, or WebP." },
  ],
  "zh-CN": [
    { stepNumber: 1, title: "上传照片", description: "添加 PNG、JPEG 或 WebP 图片，文件保留在浏览器本地。" },
    { stepNumber: 2, title: "选择布局", description: "选择拼图模板，然后为每个格子分配、拖动、缩放、旋转或适配照片。" },
    { stepNumber: 3, title: "导出", description: "设置间距、边距、圆角和背景，下载 PNG、JPEG 或 WebP。" },
  ],
  ja: [
    { stepNumber: 1, title: "写真をアップロード", description: "PNG、JPEG、WebP画像を追加。ファイルはブラウザ内に留まります。" },
    { stepNumber: 2, title: "レイアウトを選択", description: "テンプレートを選び、各写真を割り当て、ドラッグ、拡大、回転、フィットします。" },
    { stepNumber: 3, title: "書き出し", description: "間隔、余白、角丸、背景を調整し、PNG、JPEG、WebPで保存します。" },
  ],
  ko: [
    { stepNumber: 1, title: "사진 업로드", description: "PNG, JPEG, WebP 이미지를 추가하세요. 파일은 브라우저에 머뭅니다." },
    { stepNumber: 2, title: "레이아웃 선택", description: "템플릿을 고르고 각 사진을 배치, 드래그, 확대, 회전 또는 맞춤 처리하세요." },
    { stepNumber: 3, title: "내보내기", description: "간격, 여백, 둥근 모서리, 배경을 설정하고 PNG, JPEG, WebP로 저장하세요." },
  ],
  es: [
    { stepNumber: 1, title: "Sube fotos", description: "Añade PNG, JPEG o WebP. Los archivos permanecen en tu navegador." },
    { stepNumber: 2, title: "Elige un diseño", description: "Selecciona una plantilla y ajusta cada foto con arrastre, escala, rotación o ajuste." },
    { stepNumber: 3, title: "Exporta", description: "Configura espacios, margen, bordes, fondo y descarga PNG, JPEG o WebP." },
  ],
}

const seeds: Record<LocaleKey, CollagePageSeed[]> = {
  en: [
    {
      slug: "photo-collage-maker",
      title: "Photo Collage Maker Online - Free & Private | ImgSplit",
      description: "Create photo collages online with templates, spacing, backgrounds, and browser-based export. Free, private, no upload required.",
      ogTitle: "Photo Collage Maker Online",
      ogDescription: "Combine multiple photos into one clean collage in your browser.",
      overline: "Photo Collage Maker",
      headlinePart1: "Make ",
      headlineAccent: "Photo Collages",
      headlinePart2: "Online",
      heroDescription: "Combine travel shots, product images, event photos, or social posts into a polished collage with templates, spacing, backgrounds, and private browser export.",
      scenarios: [
        { icon: "Images", title: "Memory Sets", description: "Combine family, travel, event, and celebration photos into one balanced image." },
        { icon: "LayoutTemplate", title: "Fast Template Layouts", description: "Start from two-photo, grid, mosaic, and story templates instead of arranging from scratch." },
      ],
      faqEntries: [
        { question: "Is this collage maker private?", answer: "Yes. Images are loaded, arranged, and exported locally in your browser." },
        { question: "Can I adjust each photo inside its frame?", answer: "Yes. Select a frame to drag, fit, fill, scale, or rotate the assigned photo." },
        { question: "What formats can I export?", answer: "You can export the collage as PNG, JPEG, or WebP." },
      ],
    },
    {
      slug: "photo-grid-maker",
      title: "Photo Grid Maker Online - Free Browser Tool | ImgSplit",
      description: "Make a photo grid online with 2, 3, 4, 5, or 6-image layouts. Adjust spacing, margins, backgrounds, and export privately.",
      ogTitle: "Photo Grid Maker Online",
      ogDescription: "Create clean photo grids with browser-based templates.",
      overline: "Photo Grid Maker",
      headlinePart1: "Build ",
      headlineAccent: "Photo Grids",
      headlinePart2: "Fast",
      heroDescription: "Create structured photo grids for portfolios, product sets, moodboards, and social posts. Tune spacing, margins, corners, and background color.",
      scenarios: [
        { icon: "Grid3X3", title: "Product or Portfolio Sets", description: "Show multiple images in a clean grid with consistent spacing and export size." },
        { icon: "Palette", title: "Moodboards", description: "Collect colors, textures, references, and image studies into one shareable grid." },
      ],
      faqEntries: [
        { question: "Can I make a 2x2 photo grid?", answer: "Yes. Use the four-grid template and drop one image into each frame." },
        { question: "Can I change the grid border spacing?", answer: "Yes. Use the spacing and margin sliders to control inner gaps and outer padding." },
        { question: "Can I export a square grid?", answer: "Yes. The default artboard is 1080 x 1080, and you can choose other sizes." },
      ],
    },
    {
      slug: "instagram-story-collage",
      title: "Instagram Story Collage Maker - 1080x1920 | ImgSplit",
      description: "Create a 1080x1920 Instagram Story collage online. Use story templates, spacing, backgrounds, and private browser export.",
      ogTitle: "Instagram Story Collage Maker",
      ogDescription: "Make vertical story collages at 1080x1920.",
      overline: "Instagram Story Collage",
      headlinePart1: "Create ",
      headlineAccent: "Story Collages",
      headlinePart2: "Online",
      heroDescription: "Arrange photos into a vertical 1080x1920 story collage with a hero frame, supporting images, clean spacing, and export-ready dimensions.",
      scenarios: [
        { icon: "Smartphone", title: "Story Recaps", description: "Combine event, travel, food, outfit, or product shots into one vertical story image." },
        { icon: "Share2", title: "Social Posting", description: "Export a finished portrait collage ready for Instagram Stories and similar vertical formats." },
      ],
      faqEntries: [
        { question: "What size is the story collage?", answer: "The story preset uses 1080 x 1920 pixels, a common 9:16 vertical format." },
        { question: "Can I use a square collage instead?", answer: "Yes. Switch the output size to the square artboard or choose another template." },
        { question: "Will my photos upload to a server?", answer: "No. The collage is rendered in your browser." },
      ],
    },
  ],
  "zh-CN": [
    {
      slug: "photo-collage-maker",
      title: "在线照片拼图工具 - 免费私密 | ImgSplit",
      description: "使用模板、间距、背景和浏览器端导出创建照片拼图。免费、私密、无需上传。",
      ogTitle: "在线照片拼图工具",
      ogDescription: "在浏览器中把多张照片组合成干净的拼贴图。",
      overline: "照片拼图工具",
      headlinePart1: "在线制作",
      headlineAccent: "照片拼图",
      headlinePart2: "",
      heroDescription: "把旅行照、产品图、活动照片或社媒素材组合成精致拼图，支持模板、间距、背景和本地导出。",
      scenarios: [
        { icon: "Images", title: "回忆合集", description: "把家庭、旅行、活动和庆祝照片组合成一张平衡的图片。" },
        { icon: "LayoutTemplate", title: "快速模板布局", description: "从双图、网格、马赛克和 Story 模板开始，无需从零排版。" },
      ],
      faqEntries: [
        { question: "这个拼图工具私密吗？", answer: "是的。图片在浏览器中加载、排版和导出。" },
        { question: "可以调整每张照片的位置吗？", answer: "可以。选中格子后可拖动、适配、填充、缩放或旋转照片。" },
        { question: "支持导出什么格式？", answer: "支持导出 PNG、JPEG 或 WebP。" },
      ],
    },
    {
      slug: "photo-grid-maker",
      title: "在线照片网格工具 - 免费浏览器端 | ImgSplit",
      description: "在线制作 2、3、4、5 或 6 图照片网格，可调整间距、边距、背景并私密导出。",
      ogTitle: "在线照片网格工具",
      ogDescription: "用浏览器端模板创建干净照片网格。",
      overline: "照片网格工具",
      headlinePart1: "快速制作",
      headlineAccent: "照片网格",
      headlinePart2: "",
      heroDescription: "为作品集、产品图、情绪板和社媒帖子创建结构化照片网格，并控制间距、边距、圆角和背景色。",
      scenarios: [
        { icon: "Grid3X3", title: "产品或作品集", description: "用一致的间距和导出尺寸展示多张图片。" },
        { icon: "Palette", title: "情绪板", description: "把颜色、纹理、参考图和视觉研究整理成一张可分享网格。" },
      ],
      faqEntries: [
        { question: "可以制作 2x2 照片网格吗？", answer: "可以。选择四宫格模板，为每个格子放入一张图片。" },
        { question: "可以调整网格间距吗？", answer: "可以。使用间距和边距滑块控制内部空隙和外部留白。" },
        { question: "可以导出正方形网格吗？", answer: "可以。默认画布是 1080 x 1080，也可以选择其他尺寸。" },
      ],
    },
    {
      slug: "instagram-story-collage",
      title: "Instagram Story 拼图工具 - 1080x1920 | ImgSplit",
      description: "在线创建 1080x1920 Instagram Story 拼图，支持 Story 模板、间距、背景和浏览器端导出。",
      ogTitle: "Instagram Story 拼图工具",
      ogDescription: "制作 1080x1920 竖版 Story 拼图。",
      overline: "Instagram Story 拼图",
      headlinePart1: "创建",
      headlineAccent: "Story 拼图",
      headlinePart2: "",
      heroDescription: "用主视觉和辅助图片组合成 1080x1920 竖版 Story 拼图，尺寸适合直接导出发布。",
      scenarios: [
        { icon: "Smartphone", title: "Story 回顾", description: "把活动、旅行、美食、穿搭或产品照片组合成一张竖版 Story。" },
        { icon: "Share2", title: "社媒发布", description: "导出适合 Instagram Stories 及类似竖版格式的成品拼图。" },
      ],
      faqEntries: [
        { question: "Story 拼图尺寸是多少？", answer: "Story 预设使用 1080 x 1920 像素，也就是常见 9:16 竖版格式。" },
        { question: "可以改成正方形拼图吗？", answer: "可以。切换输出尺寸为正方形画布，或选择其他模板。" },
        { question: "照片会上传到服务器吗？", answer: "不会。拼图在浏览器中渲染完成。" },
      ],
    },
  ],
  ja: [
    {
      slug: "photo-collage-maker",
      title: "オンライン写真コラージュ作成 - 無料・プライベート | ImgSplit",
      description: "テンプレート、間隔、背景、ブラウザ内書き出しで写真コラージュを作成。無料でアップロード不要。",
      ogTitle: "オンライン写真コラージュ作成",
      ogDescription: "複数の写真をブラウザで1枚のコラージュに。",
      overline: "写真コラージュ",
      headlinePart1: "写真",
      headlineAccent: "コラージュ",
      headlinePart2: "を作成",
      heroDescription: "旅行、商品、イベント、SNS用の写真をテンプレート、間隔、背景つきの美しいコラージュにまとめます。",
      scenarios: [
        { icon: "Images", title: "思い出のセット", description: "家族、旅行、イベント、記念日の写真を1枚にまとめます。" },
        { icon: "LayoutTemplate", title: "高速テンプレート", description: "2枚、グリッド、モザイク、Storyテンプレートからすぐに開始できます。" },
      ],
      faqEntries: [
        { question: "このツールはプライベートですか？", answer: "はい。画像の読み込み、配置、書き出しはブラウザ内で行われます。" },
        { question: "各写真を調整できますか？", answer: "はい。フレームを選択してドラッグ、フィット、フィル、拡大、回転できます。" },
        { question: "書き出し形式は？", answer: "PNG、JPEG、WebPで書き出せます。" },
      ],
    },
    {
      slug: "photo-grid-maker",
      title: "オンライン写真グリッド作成 - 無料ブラウザツール | ImgSplit",
      description: "2、3、4、5、6枚の写真グリッドを作成。間隔、余白、背景を調整し、プライベートに書き出し。",
      ogTitle: "オンライン写真グリッド作成",
      ogDescription: "テンプレートで整った写真グリッドを作成。",
      overline: "写真グリッド",
      headlinePart1: "写真",
      headlineAccent: "グリッド",
      headlinePart2: "を作成",
      heroDescription: "ポートフォリオ、商品セット、ムードボード、SNS投稿向けに、整った写真グリッドを素早く作れます。",
      scenarios: [
        { icon: "Grid3X3", title: "商品・作品セット", description: "複数画像を一貫した間隔とサイズで見せられます。" },
        { icon: "Palette", title: "ムードボード", description: "色、質感、参考画像、ビジュアル研究を1枚のグリッドに。" },
      ],
      faqEntries: [
        { question: "2x2グリッドは作れますか？", answer: "はい。4グリッドテンプレートを使って各枠に画像を入れます。" },
        { question: "グリッド間隔は変えられますか？", answer: "はい。間隔と余白スライダーで内側と外側のスペースを調整できます。" },
        { question: "正方形で書き出せますか？", answer: "はい。標準は1080 x 1080で、他のサイズも選べます。" },
      ],
    },
    {
      slug: "instagram-story-collage",
      title: "Instagram Story コラージュ作成 - 1080x1920 | ImgSplit",
      description: "1080x1920のInstagram Storyコラージュをオンライン作成。Storyテンプレート、背景、ブラウザ書き出し対応。",
      ogTitle: "Instagram Story コラージュ",
      ogDescription: "1080x1920の縦型Storyコラージュを作成。",
      overline: "Instagram Story コラージュ",
      headlinePart1: "Story",
      headlineAccent: "コラージュ",
      headlinePart2: "を作成",
      heroDescription: "メイン写真とサブ写真を1080x1920の縦型Storyコラージュに配置し、そのまま投稿用に書き出せます。",
      scenarios: [
        { icon: "Smartphone", title: "Storyまとめ", description: "イベント、旅行、食事、コーデ、商品写真を縦型画像にまとめます。" },
        { icon: "Share2", title: "SNS投稿", description: "Instagram Storiesなどの縦型フォーマットに適した画像を書き出します。" },
      ],
      faqEntries: [
        { question: "Storyサイズはいくつですか？", answer: "Storyプリセットは一般的な9:16形式の1080 x 1920ピクセルです。" },
        { question: "正方形にもできますか？", answer: "はい。出力サイズを正方形に切り替えるか、別テンプレートを選べます。" },
        { question: "写真はアップロードされますか？", answer: "いいえ。コラージュはブラウザ内でレンダリングされます。" },
      ],
    },
  ],
  ko: [
    {
      slug: "photo-collage-maker",
      title: "온라인 사진 콜라주 만들기 - 무료 비공개 | ImgSplit",
      description: "템플릿, 간격, 배경, 브라우저 내보내기로 사진 콜라주를 만드세요. 무료이며 업로드가 필요 없습니다.",
      ogTitle: "온라인 사진 콜라주 만들기",
      ogDescription: "여러 사진을 브라우저에서 깔끔한 콜라주로 합치세요.",
      overline: "사진 콜라주 만들기",
      headlinePart1: "사진",
      headlineAccent: "콜라주",
      headlinePart2: " 만들기",
      heroDescription: "여행, 제품, 행사, 소셜 사진을 템플릿, 간격, 배경과 함께 완성도 높은 콜라주로 합치세요.",
      scenarios: [
        { icon: "Images", title: "추억 모음", description: "가족, 여행, 행사, 기념일 사진을 균형 잡힌 한 장으로 만드세요." },
        { icon: "LayoutTemplate", title: "빠른 템플릿", description: "2장, 그리드, 모자이크, Story 템플릿으로 바로 시작하세요." },
      ],
      faqEntries: [
        { question: "이 콜라주 도구는 비공개인가요?", answer: "네. 이미지는 브라우저에서 불러오고 배치하고 내보냅니다." },
        { question: "각 사진을 조정할 수 있나요?", answer: "네. 프레임을 선택해 드래그, 맞춤, 채우기, 확대, 회전할 수 있습니다." },
        { question: "어떤 형식으로 내보낼 수 있나요?", answer: "PNG, JPEG, WebP로 내보낼 수 있습니다." },
      ],
    },
    {
      slug: "photo-grid-maker",
      title: "온라인 사진 그리드 만들기 - 무료 브라우저 도구 | ImgSplit",
      description: "2, 3, 4, 5, 6장 사진 그리드를 만들고 간격, 여백, 배경을 조정해 비공개로 내보내세요.",
      ogTitle: "온라인 사진 그리드 만들기",
      ogDescription: "브라우저 템플릿으로 깔끔한 사진 그리드를 만드세요.",
      overline: "사진 그리드 만들기",
      headlinePart1: "사진",
      headlineAccent: "그리드",
      headlinePart2: " 만들기",
      heroDescription: "포트폴리오, 제품 세트, 무드보드, 소셜 게시물용 구조적인 사진 그리드를 빠르게 만드세요.",
      scenarios: [
        { icon: "Grid3X3", title: "제품 또는 포트폴리오", description: "여러 이미지를 일관된 간격과 크기로 보여주세요." },
        { icon: "Palette", title: "무드보드", description: "색상, 질감, 참고 이미지, 비주얼 리서치를 하나의 그리드로 정리하세요." },
      ],
      faqEntries: [
        { question: "2x2 사진 그리드를 만들 수 있나요?", answer: "네. 4그리드 템플릿을 사용해 각 프레임에 이미지를 넣으면 됩니다." },
        { question: "그리드 간격을 바꿀 수 있나요?", answer: "네. 간격과 여백 슬라이더로 내부 간격과 외부 여백을 조정하세요." },
        { question: "정사각형 그리드로 내보낼 수 있나요?", answer: "네. 기본 아트보드는 1080 x 1080이며 다른 크기도 선택할 수 있습니다." },
      ],
    },
    {
      slug: "instagram-story-collage",
      title: "Instagram Story 콜라주 만들기 - 1080x1920 | ImgSplit",
      description: "1080x1920 Instagram Story 콜라주를 온라인에서 만드세요. Story 템플릿, 배경, 브라우저 내보내기 지원.",
      ogTitle: "Instagram Story 콜라주 만들기",
      ogDescription: "1080x1920 세로 Story 콜라주를 만드세요.",
      overline: "Instagram Story 콜라주",
      headlinePart1: "Story",
      headlineAccent: "콜라주",
      headlinePart2: " 만들기",
      heroDescription: "메인 프레임과 보조 사진을 1080x1920 세로 Story 콜라주로 배치해 바로 내보내세요.",
      scenarios: [
        { icon: "Smartphone", title: "Story 요약", description: "행사, 여행, 음식, 스타일, 제품 사진을 하나의 세로 이미지로 합치세요." },
        { icon: "Share2", title: "소셜 게시", description: "Instagram Stories와 비슷한 세로 형식에 맞는 완성 이미지를 내보내세요." },
      ],
      faqEntries: [
        { question: "Story 콜라주 크기는 얼마인가요?", answer: "Story 프리셋은 일반적인 9:16 형식인 1080 x 1920 픽셀입니다." },
        { question: "정사각형 콜라주로 바꿀 수 있나요?", answer: "네. 출력 크기를 정사각형으로 바꾸거나 다른 템플릿을 선택하세요." },
        { question: "사진이 서버에 업로드되나요?", answer: "아니요. 콜라주는 브라우저에서 렌더링됩니다." },
      ],
    },
  ],
  es: [
    {
      slug: "photo-collage-maker",
      title: "Creador de Collages Online - Gratis y Privado | ImgSplit",
      description: "Crea collages de fotos online con plantillas, espacios, fondos y exportación en el navegador. Gratis, privado y sin subir archivos.",
      ogTitle: "Creador de Collages Online",
      ogDescription: "Combina varias fotos en un collage limpio desde el navegador.",
      overline: "Creador de Collages",
      headlinePart1: "Crea ",
      headlineAccent: "Collages",
      headlinePart2: "Online",
      heroDescription: "Combina fotos de viajes, productos, eventos o redes sociales en un collage pulido con plantillas, espacios, fondos y exportación privada.",
      scenarios: [
        { icon: "Images", title: "Colecciones de recuerdos", description: "Une fotos familiares, viajes, eventos y celebraciones en una imagen equilibrada." },
        { icon: "LayoutTemplate", title: "Plantillas rápidas", description: "Empieza con diseños de dos fotos, cuadrícula, mosaico o Story sin maquetar desde cero." },
      ],
      faqEntries: [
        { question: "¿Este creador de collages es privado?", answer: "Sí. Las imágenes se cargan, organizan y exportan localmente en tu navegador." },
        { question: "¿Puedo ajustar cada foto dentro del marco?", answer: "Sí. Selecciona un marco para arrastrar, ajustar, rellenar, escalar o rotar la foto." },
        { question: "¿Qué formatos puedo exportar?", answer: "Puedes exportar el collage como PNG, JPEG o WebP." },
      ],
    },
    {
      slug: "photo-grid-maker",
      title: "Creador de Cuadrículas de Fotos Online | ImgSplit",
      description: "Haz una cuadrícula de fotos online con diseños de 2, 3, 4, 5 o 6 imágenes. Ajusta espacios, márgenes, fondos y exporta en privado.",
      ogTitle: "Creador de Cuadrículas de Fotos",
      ogDescription: "Crea cuadrículas limpias con plantillas en el navegador.",
      overline: "Cuadrícula de Fotos",
      headlinePart1: "Crea ",
      headlineAccent: "Cuadrículas",
      headlinePart2: "Rápido",
      heroDescription: "Crea cuadrículas estructuradas para portafolios, productos, moodboards y publicaciones sociales con control de espacios, bordes y fondo.",
      scenarios: [
        { icon: "Grid3X3", title: "Productos o portafolio", description: "Muestra varias imágenes con espacios consistentes y tamaño de exportación definido." },
        { icon: "Palette", title: "Moodboards", description: "Agrupa colores, texturas, referencias y estudios visuales en una cuadrícula compartible." },
      ],
      faqEntries: [
        { question: "¿Puedo hacer una cuadrícula 2x2?", answer: "Sí. Usa la plantilla de cuatro cuadros y coloca una imagen en cada marco." },
        { question: "¿Puedo cambiar el espacio entre fotos?", answer: "Sí. Usa los controles de espacio y margen para ajustar separación interior y exterior." },
        { question: "¿Puedo exportar una cuadrícula cuadrada?", answer: "Sí. El lienzo predeterminado es 1080 x 1080 y puedes elegir otros tamaños." },
      ],
    },
    {
      slug: "instagram-story-collage",
      title: "Creador de Collages para Instagram Story - 1080x1920 | ImgSplit",
      description: "Crea un collage vertical 1080x1920 para Instagram Story con plantillas, fondos, espacios y exportación privada en navegador.",
      ogTitle: "Collage para Instagram Story",
      ogDescription: "Crea collages verticales 1080x1920 para Stories.",
      overline: "Instagram Story Collage",
      headlinePart1: "Crea ",
      headlineAccent: "Stories",
      headlinePart2: "en Collage",
      heroDescription: "Organiza fotos en un collage vertical 1080x1920 con marco principal, imágenes de apoyo, espacios limpios y tamaño listo para exportar.",
      scenarios: [
        { icon: "Smartphone", title: "Recaps de Story", description: "Combina eventos, viajes, comida, outfits o productos en una imagen vertical." },
        { icon: "Share2", title: "Publicación social", description: "Exporta un collage terminado para Instagram Stories y formatos verticales similares." },
      ],
      faqEntries: [
        { question: "¿Qué tamaño tiene el collage Story?", answer: "El preset Story usa 1080 x 1920 píxeles, un formato vertical 9:16 común." },
        { question: "¿Puedo usar un collage cuadrado?", answer: "Sí. Cambia el tamaño de salida a cuadrado o elige otra plantilla." },
        { question: "¿Mis fotos se suben a un servidor?", answer: "No. El collage se renderiza en tu navegador." },
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

export const collagePagesByLocale: LocaleCollagePages = {
  en: createPages("en"),
  "zh-CN": createPages("zh-CN"),
  ja: createPages("ja"),
  ko: createPages("ko"),
  es: createPages("es"),
}
