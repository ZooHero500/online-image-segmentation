import type { RelatedTool, ToolPageData } from "./types"

type LocaleMosaicPages = Record<string, Record<string, ToolPageData>>

interface MosaicPageSeed {
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

const relatedTools: Record<string, RelatedTool[]> = {
  en: [
    { slug: "/mosaic", title: "Privacy Mask", description: "Hide sensitive image regions with mosaic, blur, or solid cover." },
    { slug: "/watermark", title: "Watermark Tool", description: "Add ownership marks after preparing private previews." },
    { slug: "/compress-image", title: "Compress Image", description: "Reduce the file size of the masked result." },
  ],
  "zh-CN": [
    { slug: "/mosaic", title: "隐私打码", description: "用马赛克、模糊或纯色遮挡隐藏敏感区域。" },
    { slug: "/watermark", title: "水印工具", description: "处理隐私后再添加版权或品牌标记。" },
    { slug: "/compress-image", title: "压缩图片", description: "压缩打码后的成品图片。" },
  ],
  ja: [
    { slug: "/mosaic", title: "プライバシーマスク", description: "モザイク、ぼかし、塗りつぶしで機密部分を隠します。" },
    { slug: "/watermark", title: "ウォーターマーク", description: "非公開プレビューに所有者表示を追加。" },
    { slug: "/compress-image", title: "画像圧縮", description: "マスク済み画像を軽量化。" },
  ],
  ko: [
    { slug: "/mosaic", title: "개인정보 마스크", description: "모자이크, 흐림, 단색 덮기로 민감한 영역을 숨기세요." },
    { slug: "/watermark", title: "워터마크 도구", description: "비공개 미리보기 후 소유자 표시를 추가하세요." },
    { slug: "/compress-image", title: "이미지 압축", description: "마스크된 결과 파일 크기를 줄이세요." },
  ],
  es: [
    { slug: "/mosaic", title: "Máscara privada", description: "Oculta zonas sensibles con mosaico, desenfoque o cobertura sólida." },
    { slug: "/watermark", title: "Marca de agua", description: "Añade marcas de propiedad después de preparar vistas privadas." },
    { slug: "/compress-image", title: "Comprimir imagen", description: "Reduce el tamaño del resultado enmascarado." },
  ],
}

const howToSteps: Record<string, ToolPageData["howToSteps"]> = {
  en: [
    { stepNumber: 1, title: "Upload an Image", description: "Choose a PNG, JPEG, or WebP image. The file stays in your browser." },
    { stepNumber: 2, title: "Mark Private Areas", description: "Draw rectangles over faces, addresses, plates, text, or screenshot details." },
    { stepNumber: 3, title: "Download", description: "Pick mosaic, blur, or solid cover, then export the redacted image." },
  ],
  "zh-CN": [
    { stepNumber: 1, title: "上传图片", description: "选择 PNG、JPEG 或 WebP 图片，文件保留在浏览器本地。" },
    { stepNumber: 2, title: "标记敏感区域", description: "在人脸、地址、车牌、文字或截图细节上框选区域。" },
    { stepNumber: 3, title: "下载", description: "选择马赛克、模糊或纯色遮挡，然后导出打码图片。" },
  ],
  ja: [
    { stepNumber: 1, title: "画像をアップロード", description: "PNG、JPEG、WebP画像を選択。ファイルはブラウザ内に留まります。" },
    { stepNumber: 2, title: "隠す領域を指定", description: "顔、住所、ナンバー、テキスト、スクリーンショットの詳細を矩形で囲みます。" },
    { stepNumber: 3, title: "ダウンロード", description: "モザイク、ぼかし、塗りつぶしを選び、編集済み画像を書き出します。" },
  ],
  ko: [
    { stepNumber: 1, title: "이미지 업로드", description: "PNG, JPEG, WebP 이미지를 선택하세요. 파일은 브라우저에 머뭅니다." },
    { stepNumber: 2, title: "민감한 영역 표시", description: "얼굴, 주소, 번호판, 텍스트, 스크린샷 세부 영역을 사각형으로 표시하세요." },
    { stepNumber: 3, title: "다운로드", description: "모자이크, 흐림, 단색 덮기를 선택하고 편집된 이미지를 내보내세요." },
  ],
  es: [
    { stepNumber: 1, title: "Sube una imagen", description: "Elige PNG, JPEG o WebP. El archivo permanece en tu navegador." },
    { stepNumber: 2, title: "Marca zonas privadas", description: "Dibuja rectángulos sobre rostros, direcciones, matrículas, texto o capturas." },
    { stepNumber: 3, title: "Descarga", description: "Elige mosaico, desenfoque o cobertura sólida y exporta la imagen editada." },
  ],
}

const seeds: Record<string, MosaicPageSeed[]> = {
  en: [
    {
      slug: "blur-face",
      title: "Blur Face Online - Free Private Photo Tool | ImgSplit",
      description: "Blur faces online in photos and screenshots without uploading your image. Use brush, mosaic, blur, or solid cover masks in your browser.",
      ogTitle: "Blur Face Online",
      ogDescription: "Blur or mask faces privately in your browser.",
      overline: "Blur Face Online",
      headlinePart1: "Blur ",
      headlineAccent: "Faces",
      headlinePart2: "Privately",
      heroDescription: "Hide faces in photos, screenshots, and public previews with local browser editing, adjustable blur, mosaic blocks, and brush masks.",
      scenarios: [
        { icon: "Camera", title: "People in Photos", description: "Hide faces in group shots, event photos, school pictures, or public previews before posting." },
        { icon: "Paintbrush", title: "Brush Masking", description: "Paint over irregular face shapes or erase part of a mask when a rectangle is too broad." },
      ],
      faqEntries: [
        { question: "Can I blur faces without uploading?", answer: "Yes. The image is loaded, edited, and exported locally in your browser." },
        { question: "Can I use something stronger than blur?", answer: "Yes. Use mosaic blocks or solid cover when you need stronger privacy than soft blur." },
      ],
    },
    {
      slug: "blur-face-in-photo",
      title: "Blur Face in Photo Online - Free Private Tool | ImgSplit",
      description: "Blur faces in photos online without uploading your image. Use browser-based blur, mosaic, or solid cover regions for private sharing and posts.",
      ogTitle: "Blur Face in Photo Online",
      ogDescription: "Hide faces in photos privately in your browser.",
      overline: "Face Blur Tool",
      headlinePart1: "Blur Faces ",
      headlineAccent: "in Photos",
      headlinePart2: "Online",
      heroDescription: "Mask faces before sharing team photos, event pictures, review screenshots, or public posts. Everything runs locally in your browser.",
      scenarios: [
        { icon: "Camera", title: "People in Photos", description: "Hide faces in group shots, event photos, or public previews before posting." },
        { icon: "Shield", title: "Private Sharing", description: "Prepare images for tickets, reports, and messages without exposing identities." },
      ],
      faqEntries: [
        { question: "Does this tool upload my photo?", answer: "No. The image is rendered and exported in your browser." },
        { question: "Is blur always enough for privacy?", answer: "For high-risk content, use mosaic or solid cover because they are harder to reverse than soft blur." },
      ],
    },
    {
      slug: "pixelate-image",
      title: "Pixelate Image - Free Online Mosaic Tool | ImgSplit",
      description: "Pixelate an image online with adjustable mosaic blocks, brush masks, and image overlays. Hide sensitive areas locally in your browser before sharing.",
      ogTitle: "Pixelate Image Online",
      ogDescription: "Pixelate image areas with adjustable mosaic blocks.",
      overline: "Pixelate Image",
      headlinePart1: "Pixelate ",
      headlineAccent: "Images",
      headlinePart2: "Online",
      heroDescription: "Add adjustable pixel blocks to faces, license plates, text, screenshots, and private details while keeping the rest of the image clear.",
      scenarios: [
        { icon: "FileSearch", title: "Screenshot Redaction", description: "Pixelate names, emails, account details, dashboards, or internal data before sharing." },
        { icon: "Shield", title: "Private Photo Sharing", description: "Use larger blocks to hide faces, plates, addresses, and identifying image details." },
      ],
      faqEntries: [
        { question: "Can I pixelate only part of an image?", answer: "Yes. Draw rectangles or paint brush masks over the specific areas you want to pixelate." },
        { question: "Does pixelating remove metadata?", answer: "The exported image is re-encoded from canvas, so typical embedded metadata is not carried over." },
      ],
    },
    {
      slug: "pixelate-image-online",
      title: "Pixelate Image Online - Free Mosaic Tool | ImgSplit",
      description: "Pixelate parts of an image online with adjustable mosaic blocks. Hide private details in photos and screenshots in your browser without upload.",
      ogTitle: "Pixelate Image Online",
      ogDescription: "Add adjustable mosaic blocks to sensitive image regions.",
      overline: "Pixelate Image",
      headlinePart1: "Pixelate ",
      headlineAccent: "Image Areas",
      headlinePart2: "Fast",
      heroDescription: "Use adjustable mosaic blocks to hide text, faces, plates, addresses, and screenshot details while keeping the rest of the image readable.",
      scenarios: [
        { icon: "FileSearch", title: "Screenshot Cleanup", description: "Pixelate names, account numbers, emails, or message content before sharing." },
        { icon: "Shield", title: "Irreversible Masking", description: "Use larger blocks for stronger privacy on sensitive details." },
      ],
      faqEntries: [
        { question: "Can I control the pixel size?", answer: "Yes. The mosaic size slider controls how large each pixel block appears." },
        { question: "Can I pixelate multiple areas?", answer: "Yes. Draw multiple regions and adjust each one independently." },
      ],
    },
    {
      slug: "censor-image-online",
      title: "Censor Image Online - Free Privacy Mask Tool | ImgSplit",
      description: "Censor image areas online with mosaic, blur, solid cover, brush masks, or custom overlays. Free browser-based privacy editing with no upload.",
      ogTitle: "Censor Image Online",
      ogDescription: "Censor sensitive image areas privately in your browser.",
      overline: "Censor Image Online",
      headlinePart1: "Censor ",
      headlineAccent: "Image Areas",
      headlinePart2: "Fast",
      heroDescription: "Cover faces, usernames, documents, license plates, and screenshots with flexible masks before posting or sending an image.",
      scenarios: [
        { icon: "MessageSquare", title: "Social and Chat Screenshots", description: "Censor names, avatars, messages, handles, phone numbers, and private replies." },
        { icon: "Image", title: "Public Photo Prep", description: "Hide bystanders, addresses, school names, plates, and other identifying details." },
      ],
      faqEntries: [
        { question: "Can I censor with a custom image?", answer: "Yes. Add an image mask layer, then drag, scale, rotate, and adjust opacity." },
        { question: "Can I erase part of a censor mask?", answer: "Yes. Switch to the eraser tool and paint over the mask areas you want to remove." },
      ],
    },
    {
      slug: "mosaic-tool",
      title: "Mosaic Tool Online - Hide Private Image Details | ImgSplit",
      description: "Use a free online mosaic tool to cover sensitive image details. Browser-based masking with mosaic, blur, and solid cover modes, no upload.",
      ogTitle: "Online Mosaic Tool",
      ogDescription: "Cover sensitive image details with browser-based mosaic masking.",
      overline: "Online Mosaic Tool",
      headlinePart1: "Add ",
      headlineAccent: "Mosaic Masks",
      headlinePart2: "Privately",
      heroDescription: "Create clean mosaic masks for faces, documents, license plates, and screenshots without sending the original file to a server.",
      scenarios: [
        { icon: "Image", title: "Photo Privacy", description: "Mask faces, signs, addresses, and identifying details in photos." },
        { icon: "LayoutDashboard", title: "Work Screenshots", description: "Hide dashboards, names, metrics, and internal data before publishing." },
      ],
      faqEntries: [
        { question: "What formats are supported?", answer: "PNG, JPEG, and WebP images are supported." },
        { question: "Does export keep EXIF metadata?", answer: "Canvas export creates a new image file, so typical embedded metadata is not carried over." },
      ],
    },
    {
      slug: "redact-image",
      title: "Redact Image - Free Photo and Screenshot Privacy Tool | ImgSplit",
      description: "Redact image details with solid cover, mosaic, blur, brush masks, or custom image overlays. Hide private content in your browser before sharing.",
      ogTitle: "Redact Image",
      ogDescription: "Redact sensitive photo and screenshot details locally.",
      overline: "Image Redaction",
      headlinePart1: "Redact ",
      headlineAccent: "Images",
      headlinePart2: "Privately",
      heroDescription: "Mask private text, faces, addresses, IDs, dashboards, and screenshots with browser-only editing and clean export formats.",
      scenarios: [
        { icon: "FileSearch", title: "Documents and Receipts", description: "Cover addresses, IDs, order numbers, billing details, and confidential notes." },
        { icon: "LayoutDashboard", title: "Work Screenshots", description: "Hide customer names, metrics, dashboards, and internal tools before publishing." },
      ],
      faqEntries: [
        { question: "Which redaction mode is safest?", answer: "Solid cover is safest because it replaces the selected pixels with a flat color." },
        { question: "Can I redact irregular areas?", answer: "Yes. Use the brush tool for freeform areas and the eraser to refine the mask." },
      ],
    },
    {
      slug: "redact-image-online",
      title: "Redact Image Online - Free Screenshot Privacy Tool | ImgSplit",
      description: "Redact image areas online with solid cover, mosaic, or blur. Hide names, addresses, faces, license plates, and screenshots in your browser.",
      ogTitle: "Redact Image Online",
      ogDescription: "Hide sensitive image areas before sharing screenshots or photos.",
      overline: "Image Redaction",
      headlinePart1: "Redact ",
      headlineAccent: "Image Details",
      headlinePart2: "Online",
      heroDescription: "Cover sensitive information before sharing screenshots, receipts, forms, chats, documents, or photos with clients and teammates.",
      scenarios: [
        { icon: "MessageSquare", title: "Chat Screenshots", description: "Cover names, avatars, messages, phone numbers, and account details." },
        { icon: "FileSearch", title: "Documents and Receipts", description: "Hide addresses, IDs, order numbers, and billing details before sharing." },
      ],
      faqEntries: [
        { question: "Which mode is strongest for redaction?", answer: "Solid cover is the strongest option because it replaces the selected pixels with a flat color." },
        { question: "Can I export as JPEG?", answer: "Yes. You can export PNG, JPEG, or WebP and adjust quality for non-PNG formats." },
      ],
    },
  ],
}

seeds["zh-CN"] = localizeSeeds("zh-CN", [
  ["blur-face", "在线模糊人脸 - 免费照片隐私工具 | ImgSplit", "在线模糊照片或截图里的人脸，支持画笔、马赛克、模糊和纯色遮挡，图片无需上传。", "在线模糊人脸", "在浏览器中私密模糊或遮挡人脸。", "在线模糊人脸", "私密", "模糊人脸", "处理", "用本地浏览器编辑、可调模糊、马赛克块和画笔遮罩隐藏照片、截图和公开预览中的人脸。"],
  ["blur-face-in-photo", "在线模糊照片人脸 - 免费隐私工具 | ImgSplit", "在浏览器中模糊照片里的人脸，也可使用马赛克或纯色遮挡，图片无需上传。", "在线模糊照片人脸", "在浏览器中私密隐藏照片人脸。", "人脸模糊工具", "在线", "模糊人脸", "照片", "分享团队照、活动照或截图前，先隐藏人脸和身份信息。"],
  ["pixelate-image", "图片像素化 - 免费在线马赛克工具 | ImgSplit", "在线像素化图片，支持可调马赛克块、画笔遮罩和图片遮罩图层，在浏览器中隐藏敏感区域。", "在线图片像素化", "用可调马赛克像素化图片区域。", "图片像素化", "在线", "像素化图片", "处理", "给人脸、车牌、文字、截图和隐私细节添加可调像素块，同时保留其他区域清晰。"],
  ["pixelate-image-online", "在线图片像素化 - 免费马赛克工具 | ImgSplit", "在线像素化图片局部区域，用可调马赛克隐藏照片和截图中的敏感细节。", "在线图片像素化", "为敏感区域添加可调马赛克。", "图片像素化", "快速", "像素化图片", "区域", "用可调马赛克隐藏文字、人脸、车牌、地址和截图细节。"],
  ["censor-image-online", "在线图片遮挡 - 免费隐私打码工具 | ImgSplit", "在线遮挡图片敏感区域，支持马赛克、模糊、纯色遮挡、画笔和自定义图片遮罩。", "在线图片遮挡", "在浏览器中私密遮挡图片敏感区域。", "在线图片遮挡", "快速", "遮挡图片", "区域", "发布或发送图片前，用灵活遮罩覆盖人脸、用户名、文档、车牌和截图。"],
  ["mosaic-tool", "在线马赛克工具 - 隐藏图片隐私细节 | ImgSplit", "免费在线马赛克工具，支持马赛克、模糊和纯色遮挡，浏览器端处理。", "在线马赛克工具", "用浏览器端马赛克遮挡敏感图片细节。", "在线马赛克工具", "私密添加", "马赛克", "遮挡", "为人脸、文档、车牌和截图创建干净的马赛克遮挡。"],
  ["redact-image", "图片打码 - 免费照片和截图隐私工具 | ImgSplit", "用纯色遮挡、马赛克、模糊、画笔或自定义图片遮罩给图片打码，分享前隐藏隐私内容。", "图片打码", "在本地给照片和截图敏感细节打码。", "图片打码", "私密", "给图片", "打码", "用浏览器端编辑和干净导出格式遮挡隐私文字、人脸、地址、证件、看板和截图。"],
  ["redact-image-online", "在线图片打码 - 免费截图隐私工具 | ImgSplit", "在线用纯色遮挡、马赛克或模糊给图片打码，隐藏姓名、地址、人脸、车牌和截图隐私。", "在线图片打码", "分享截图或照片前隐藏敏感区域。", "图片打码", "在线", "隐藏图片", "细节", "分享截图、收据、表单、聊天记录或照片前遮挡敏感信息。"],
])

seeds.ja = localizeSeeds("ja", [
  ["blur-face", "顔をオンラインでぼかす - 無料写真プライバシーツール | ImgSplit", "写真やスクリーンショットの顔をアップロードなしでぼかし、ブラシ、モザイク、塗りつぶしでも隠せます。", "顔をオンラインでぼかす", "ブラウザ内で顔をぼかし、隠します。", "顔ぼかしオンライン", "プライベートに", "顔をぼかす", "できます", "ローカル編集、調整可能なぼかし、モザイク、ブラシマスクで顔を隠します。"],
  ["blur-face-in-photo", "写真の顔をオンラインでぼかす - 無料プライバシーツール | ImgSplit", "写真の顔をアップロードなしでぼかし、モザイクや塗りつぶしでも隠せます。", "写真の顔をオンラインでぼかす", "ブラウザ内で顔を隠します。", "顔ぼかしツール", "写真の", "顔をぼかす", "オンライン", "共有前にチーム写真、イベント写真、スクリーンショット内の顔を隠します。"],
  ["pixelate-image", "画像をピクセル化 - 無料オンラインモザイクツール | ImgSplit", "調整可能なモザイク、ブラシマスク、画像レイヤーで画像の機密部分をブラウザ内で隠します。", "画像をオンラインでピクセル化", "調整可能なモザイクで画像領域をピクセル化。", "画像ピクセル化", "オンラインで", "画像をピクセル化", "できます", "顔、ナンバー、文字、スクリーンショット、個人情報に調整可能なピクセルブロックを追加します。"],
  ["pixelate-image-online", "画像をオンラインでピクセル化 - 無料モザイクツール | ImgSplit", "調整可能なモザイクで画像の一部をピクセル化し、機密情報を隠します。", "画像をオンラインでピクセル化", "機密部分にモザイクを追加。", "画像ピクセル化", "画像の", "領域をピクセル化", "高速", "テキスト、顔、ナンバー、住所、スクリーンショット詳細をモザイクで隠します。"],
  ["censor-image-online", "画像をオンラインで隠す - 無料プライバシーマスク | ImgSplit", "モザイク、ぼかし、塗りつぶし、ブラシ、カスタム画像マスクで機密部分を隠します。", "画像をオンラインで隠す", "ブラウザ内で画像の機密部分を隠します。", "画像マスクオンライン", "すばやく", "画像領域を隠す", "ツール", "投稿や送信前に顔、ユーザー名、文書、ナンバー、スクリーンショットを隠します。"],
  ["mosaic-tool", "オンラインモザイクツール - 画像のプライバシーを保護 | ImgSplit", "無料オンラインモザイクツール。モザイク、ぼかし、塗りつぶしで機密部分を隠します。", "オンラインモザイクツール", "ブラウザで機密部分をモザイク処理。", "オンラインモザイク", "プライベートに", "モザイクを追加", "できます", "顔、文書、ナンバー、スクリーンショットにきれいなモザイクを作成します。"],
  ["redact-image", "画像を墨消し - 無料写真・スクリーンショット保護 | ImgSplit", "塗りつぶし、モザイク、ぼかし、ブラシ、カスタム画像マスクで共有前に機密部分を隠します。", "画像を墨消し", "写真やスクリーンショットの詳細をローカルで隠します。", "画像墨消し", "プライベートに", "画像を墨消し", "できます", "文字、顔、住所、ID、ダッシュボード、スクリーンショットをブラウザ内で隠します。"],
  ["redact-image-online", "画像をオンラインで墨消し - 無料スクリーンショット保護 | ImgSplit", "塗りつぶし、モザイク、ぼかしで名前、住所、顔、ナンバー、スクリーンショットを隠します。", "画像をオンラインで墨消し", "共有前に機密部分を隠します。", "画像墨消し", "画像の", "詳細を隠す", "オンライン", "スクリーンショット、領収書、フォーム、チャット、写真の機密情報を隠します。"],
])

seeds.ko = localizeSeeds("ko", [
  ["blur-face", "온라인 얼굴 흐리게 하기 - 무료 사진 개인정보 도구 | ImgSplit", "사진과 스크린샷의 얼굴을 업로드 없이 흐리게 처리하고 브러시, 모자이크, 단색 덮기도 사용하세요.", "온라인 얼굴 흐리게 하기", "브라우저에서 얼굴을 흐리게 하거나 숨기세요.", "얼굴 흐림 온라인", "비공개로", "얼굴 흐림", "처리", "로컬 편집, 조절 가능한 흐림, 모자이크 블록, 브러시 마스크로 얼굴을 숨기세요."],
  ["blur-face-in-photo", "사진 얼굴 흐리게 하기 - 무료 개인정보 도구 | ImgSplit", "업로드 없이 사진 속 얼굴을 흐리게 처리하고 모자이크나 단색 덮기도 사용할 수 있습니다.", "사진 얼굴 흐리게 하기", "브라우저에서 얼굴을 비공개로 숨기세요.", "얼굴 흐림 도구", "온라인으로", "얼굴 흐림", "처리", "공유 전 팀 사진, 행사 사진, 스크린샷의 얼굴을 숨기세요."],
  ["pixelate-image", "이미지 픽셀화 - 무료 온라인 모자이크 도구 | ImgSplit", "조절 가능한 모자이크 블록, 브러시 마스크, 이미지 오버레이로 민감한 영역을 브라우저에서 숨기세요.", "온라인 이미지 픽셀화", "조절 가능한 모자이크로 이미지 영역을 픽셀화하세요.", "이미지 픽셀화", "온라인으로", "이미지", "픽셀화", "얼굴, 번호판, 텍스트, 스크린샷, 개인 정보에 조절 가능한 픽셀 블록을 추가하세요."],
  ["pixelate-image-online", "온라인 이미지 픽셀화 - 무료 모자이크 도구 | ImgSplit", "조절 가능한 모자이크 블록으로 이미지 일부를 픽셀화하고 민감한 정보를 숨기세요.", "온라인 이미지 픽셀화", "민감한 영역에 조절 가능한 모자이크를 추가하세요.", "이미지 픽셀화", "빠르게", "이미지 영역", "픽셀화", "텍스트, 얼굴, 번호판, 주소, 스크린샷 세부 정보를 모자이크로 숨기세요."],
  ["censor-image-online", "온라인 이미지 가리기 - 무료 개인정보 마스크 도구 | ImgSplit", "모자이크, 흐림, 단색 덮기, 브러시, 사용자 이미지 마스크로 민감한 이미지 영역을 가리세요.", "온라인 이미지 가리기", "브라우저에서 민감한 이미지 영역을 비공개로 가리세요.", "온라인 이미지 가리기", "빠르게", "이미지 영역", "가리기", "게시하거나 보내기 전 얼굴, 사용자명, 문서, 번호판, 스크린샷을 유연한 마스크로 덮으세요."],
  ["mosaic-tool", "온라인 모자이크 도구 - 이미지 개인정보 숨기기 | ImgSplit", "무료 온라인 모자이크 도구로 민감한 이미지 세부 정보를 숨기세요.", "온라인 모자이크 도구", "브라우저에서 민감한 이미지 세부 정보를 모자이크 처리하세요.", "온라인 모자이크", "비공개로", "모자이크 마스크", "추가", "얼굴, 문서, 번호판, 스크린샷에 깔끔한 모자이크 마스크를 만드세요."],
  ["redact-image", "이미지 가리기 - 무료 사진 및 스크린샷 개인정보 도구 | ImgSplit", "단색 덮기, 모자이크, 흐림, 브러시, 사용자 이미지 마스크로 공유 전 민감한 내용을 숨기세요.", "이미지 가리기", "사진과 스크린샷 세부 정보를 로컬에서 가리세요.", "이미지 가리기", "비공개로", "이미지", "가리기", "브라우저 전용 편집과 깔끔한 내보내기로 텍스트, 얼굴, 주소, ID, 대시보드, 스크린샷을 가리세요."],
  ["redact-image-online", "온라인 이미지 가리기 - 무료 스크린샷 개인정보 도구 | ImgSplit", "단색 덮기, 모자이크, 흐림으로 이름, 주소, 얼굴, 번호판, 개인 스크린샷을 숨기세요.", "온라인 이미지 가리기", "스크린샷이나 사진 공유 전 민감한 영역을 숨기세요.", "이미지 가리기", "온라인으로", "이미지 세부 정보", "숨기기", "스크린샷, 영수증, 양식, 채팅, 사진의 민감한 정보를 덮으세요."],
])

seeds.es = localizeSeeds("es", [
  ["blur-face", "Desenfocar Rostros Online - Herramienta Privada Gratis | ImgSplit", "Desenfoca rostros en fotos y capturas sin subir la imagen. Usa pincel, mosaico, desenfoque o cobertura sólida en el navegador.", "Desenfocar rostros online", "Desenfoca u oculta rostros en tu navegador.", "Desenfocar rostros", "Desenfoca ", "rostros", "en privado", "Oculta rostros en fotos, capturas y vistas públicas con edición local, desenfoque ajustable, mosaico y pincel."],
  ["blur-face-in-photo", "Desenfocar Rostros en Fotos Online - Gratis | ImgSplit", "Desenfoca rostros en fotos sin subir la imagen. Usa desenfoque, mosaico o cobertura sólida en el navegador.", "Desenfocar rostros online", "Oculta rostros en fotos de forma privada.", "Desenfoque de rostros", "Desenfoca ", "rostros", "online", "Oculta rostros antes de compartir fotos de equipo, eventos, capturas o publicaciones."],
  ["pixelate-image", "Pixelar Imagen - Herramienta de Mosaico Online Gratis | ImgSplit", "Pixela una imagen online con mosaico ajustable, pincel y superposiciones de imagen para ocultar zonas sensibles en el navegador.", "Pixelar imagen online", "Pixela zonas de imagen con mosaico ajustable.", "Pixelar imagen", "Pixela ", "imágenes", "online", "Añade bloques de píxel a rostros, matrículas, texto, capturas y detalles privados sin afectar el resto de la imagen."],
  ["pixelate-image-online", "Pixelar Imagen Online - Herramienta de Mosaico Gratis | ImgSplit", "Pixela partes de una imagen online con bloques de mosaico ajustables para ocultar detalles privados.", "Pixelar imagen online", "Añade mosaico ajustable a regiones sensibles.", "Pixelar imagen", "Pixela ", "zonas de imagen", "rápido", "Usa mosaico para ocultar texto, rostros, matrículas, direcciones y detalles de capturas."],
  ["censor-image-online", "Censurar Imagen Online - Herramienta Privada Gratis | ImgSplit", "Censura zonas de imagen con mosaico, desenfoque, cobertura sólida, pincel o máscaras de imagen personalizadas.", "Censurar imagen online", "Censura zonas sensibles en tu navegador.", "Censurar imagen", "Censura ", "zonas de imagen", "rápido", "Cubre rostros, usuarios, documentos, matrículas y capturas antes de publicar o enviar una imagen."],
  ["mosaic-tool", "Herramienta de Mosaico Online - Oculta Detalles Privados | ImgSplit", "Herramienta gratuita de mosaico para cubrir detalles sensibles con mosaico, desenfoque o cobertura sólida.", "Herramienta de mosaico online", "Cubre detalles sensibles con mosaico en el navegador.", "Mosaico online", "Añade ", "máscaras de mosaico", "privadas", "Crea máscaras limpias para rostros, documentos, matrículas y capturas sin subir el archivo."],
  ["redact-image", "Redactar Imagen - Herramienta Privada Gratis | ImgSplit", "Redacta detalles de imagen con cobertura sólida, mosaico, desenfoque, pincel o máscaras de imagen antes de compartir.", "Redactar imagen", "Redacta detalles de fotos y capturas localmente.", "Redactar imagen", "Redacta ", "imágenes", "en privado", "Oculta texto privado, rostros, direcciones, documentos, paneles y capturas con edición solo en el navegador."],
  ["redact-image-online", "Redactar Imagen Online - Herramienta Privada Gratis | ImgSplit", "Redacta áreas de imagen con cobertura sólida, mosaico o desenfoque. Oculta nombres, direcciones, rostros y capturas.", "Redactar imagen online", "Oculta áreas sensibles antes de compartir.", "Redacción de imagen", "Redacta ", "detalles de imagen", "online", "Cubre información sensible antes de compartir capturas, recibos, formularios, chats o fotos."],
])

function localizeSeeds(
  locale: string,
  rows: Array<[string, string, string, string, string, string, string, string, string, string]>
): MosaicPageSeed[] {
  return rows.map(
    ([
      slug,
      title,
      description,
      ogTitle,
      ogDescription,
      overline,
      headlinePart1,
      headlineAccent,
      headlinePart2,
      heroDescription,
    ]) => ({
      slug,
      title,
      description,
      ogTitle,
      ogDescription,
      overline,
      headlinePart1,
      headlineAccent,
      headlinePart2,
      heroDescription,
      scenarios: [
        localizedScenario(locale, "privacy"),
        localizedScenario(locale, "screenshots"),
      ],
      faqEntries: localizedFaq(locale),
    })
  )
}

function localizedScenario(locale: string, type: "privacy" | "screenshots") {
  const text = {
    en: {
      privacy: { icon: "Shield", title: "Private Sharing", description: "Hide identifying details before posting, sending, or publishing images." },
      screenshots: { icon: "FileSearch", title: "Screenshot Cleanup", description: "Cover names, messages, accounts, addresses, and internal data." },
    },
    "zh-CN": {
      privacy: { icon: "Shield", title: "私密分享", description: "发布、发送或公开图片前隐藏身份和隐私细节。" },
      screenshots: { icon: "FileSearch", title: "截图清理", description: "遮挡姓名、消息、账号、地址和内部数据。" },
    },
    ja: {
      privacy: { icon: "Shield", title: "プライベート共有", description: "投稿、送信、公開前に識別情報を隠します。" },
      screenshots: { icon: "FileSearch", title: "スクリーンショット整理", description: "名前、メッセージ、アカウント、住所、内部データを隠します。" },
    },
    ko: {
      privacy: { icon: "Shield", title: "비공개 공유", description: "게시, 전송, 공개 전 식별 가능한 세부 정보를 숨기세요." },
      screenshots: { icon: "FileSearch", title: "스크린샷 정리", description: "이름, 메시지, 계정, 주소, 내부 데이터를 덮으세요." },
    },
    es: {
      privacy: { icon: "Shield", title: "Compartir en privado", description: "Oculta detalles identificables antes de publicar o enviar imágenes." },
      screenshots: { icon: "FileSearch", title: "Limpiar capturas", description: "Cubre nombres, mensajes, cuentas, direcciones y datos internos." },
    },
  }
  return text[locale as keyof typeof text][type]
}

function localizedFaq(locale: string): ToolPageData["faqEntries"] {
  const text = {
    en: [
      { question: "Does the image get uploaded?", answer: "No. The editor renders and exports the image locally in your browser." },
      { question: "Which masking mode is strongest?", answer: "Solid cover is strongest because it replaces the selected pixels with a flat color." },
    ],
    "zh-CN": [
      { question: "图片会上传吗？", answer: "不会。编辑和导出都在浏览器本地完成。" },
      { question: "哪种打码方式最强？", answer: "纯色遮挡最强，因为它会把选区像素替换成纯色。" },
    ],
    ja: [
      { question: "画像はアップロードされますか？", answer: "いいえ。編集と書き出しはブラウザ内で行われます。" },
      { question: "最も強い隠し方は？", answer: "塗りつぶしは選択部分のピクセルを単色に置き換えるため最も強力です。" },
    ],
    ko: [
      { question: "이미지가 업로드되나요?", answer: "아니요. 편집과 내보내기는 브라우저에서 로컬로 처리됩니다." },
      { question: "가장 강한 마스킹 방식은 무엇인가요?", answer: "단색 덮기는 선택한 픽셀을 평면 색상으로 대체하므로 가장 강합니다." },
    ],
    es: [
      { question: "¿Se sube la imagen?", answer: "No. El editor renderiza y exporta la imagen localmente en tu navegador." },
      { question: "¿Qué modo es más fuerte?", answer: "La cobertura sólida es la más fuerte porque reemplaza los píxeles seleccionados por un color plano." },
    ],
  }
  return text[locale as keyof typeof text]
}

function buildPage(locale: string, seed: MosaicPageSeed): ToolPageData {
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

export const mosaicPagesByLocale: LocaleMosaicPages = Object.fromEntries(
  Object.entries(seeds).map(([locale, localeSeeds]) => [
    locale,
    Object.fromEntries(
      localeSeeds.map((seed) => [seed.slug, buildPage(locale, seed)])
    ),
  ])
)
