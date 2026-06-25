import type { RelatedTool, ToolPageData } from "./types"

// ─── Related Tools ───

const relatedToolsByLocale: Record<string, RelatedTool[]> = {
  en: [
    { slug: "/grid", title: "Grid Splitter", description: "Split an image into a uniform grid of equal tiles." },
    { slug: "/collage", title: "Photo Collage Maker", description: "Combine multiple images into a single collage layout." },
    { slug: "/social-export", title: "Social Export", description: "Generate multiple social sizes from one source image." },
  ],
  "zh-CN": [
    { slug: "/grid", title: "网格切割", description: "将图片切割为均匀的网格。" },
    { slug: "/collage", title: "图片拼贴", description: "将多张图片合并为一个拼贴版面。" },
    { slug: "/social-export", title: "社媒导出", description: "一张图片生成多个社交平台尺寸。" },
  ],
  ja: [
    { slug: "/grid", title: "グリッド分割", description: "画像を均等なグリッドに分割します。" },
    { slug: "/collage", title: "フォトコラージュ", description: "複数の画像を1つのコラージュにまとめます。" },
    { slug: "/social-export", title: "SNS書き出し", description: "1枚の画像から複数のSNSサイズを生成。" },
  ],
  ko: [
    { slug: "/grid", title: "그리드 분할", description: "이미지를 균일한 그리드 타일로 분할하세요." },
    { slug: "/collage", title: "사진 콜라주", description: "여러 이미지를 하나의 콜라주 레이아웃으로 합치세요." },
    { slug: "/social-export", title: "소셜 내보내기", description: "이미지 한 장에서 여러 소셜 크기를 만드세요." },
  ],
  es: [
    { slug: "/grid", title: "Divisor de cuadrícula", description: "Divide una imagen en una cuadrícula uniforme de mosaicos." },
    { slug: "/collage", title: "Creador de collage", description: "Combina varias imágenes en un único diseño de collage." },
    { slug: "/social-export", title: "Exportación social", description: "Genera varios tamaños sociales desde una imagen." },
  ],
  "pt-BR": [
    { slug: "/grid", title: "Divisor de Grade", description: "Divida uma imagem em uma grade uniforme de blocos iguais." },
    { slug: "/collage", title: "Criador de Colagem", description: "Combine várias imagens em um único layout de colagem." },
    { slug: "/social-export", title: "Exportação Social", description: "Gere múltiplos tamanhos para redes sociais a partir de uma imagem." },
  ],
}

// ─── How-To Steps ───

const howToStepsByLocale: Record<string, ToolPageData["howToSteps"]> = {
  en: [
    { stepNumber: 1, title: "Upload Your Image", description: "Add a PNG, JPEG, or WebP image. Everything stays in your browser." },
    { stepNumber: 2, title: "Set Carousel Slices", description: "Choose how many panels to split your image into for the carousel." },
    { stepNumber: 3, title: "Download Panels", description: "Export all slices as a ZIP, ready to upload one by one as carousel slides." },
  ],
  "zh-CN": [
    { stepNumber: 1, title: "上传图片", description: "添加 PNG、JPEG 或 WebP，图片保留在浏览器本地。" },
    { stepNumber: 2, title: "设置轮播切割数", description: "选择将图片切分为多少个轮播面板。" },
    { stepNumber: 3, title: "下载面板", description: "以 ZIP 形式导出所有切片，逐一上传为轮播幻灯片。" },
  ],
  ja: [
    { stepNumber: 1, title: "画像をアップロード", description: "PNG、JPEG、WebPを追加。画像はブラウザ内に留まります。" },
    { stepNumber: 2, title: "カルーセルスライス数を設定", description: "画像を何枚のカルーセルパネルに分割するかを選択します。" },
    { stepNumber: 3, title: "パネルをダウンロード", description: "すべてのスライスをZIPで書き出し、カルーセルスライドとして順番にアップロードします。" },
  ],
  ko: [
    { stepNumber: 1, title: "이미지 업로드", description: "PNG, JPEG, WebP 이미지를 추가하세요. 파일은 브라우저에 머뭅니다." },
    { stepNumber: 2, title: "캐러셀 분할 수 설정", description: "이미지를 몇 개의 캐러셀 패널로 나눌지 선택하세요." },
    { stepNumber: 3, title: "패널 다운로드", description: "모든 슬라이스를 ZIP으로 내보내고 캐러셀 슬라이드로 하나씩 업로드하세요." },
  ],
  es: [
    { stepNumber: 1, title: "Sube tu imagen", description: "Añade PNG, JPEG o WebP. El archivo permanece en tu navegador." },
    { stepNumber: 2, title: "Elige el número de paneles", description: "Selecciona en cuántos paneles dividir la imagen para el carrusel." },
    { stepNumber: 3, title: "Descarga los paneles", description: "Exporta todas las secciones en un ZIP listas para subirse como diapositivas del carrusel." },
  ],
  "pt-BR": [
    { stepNumber: 1, title: "Envie sua imagem", description: "Adicione um arquivo PNG, JPEG ou WebP. Tudo fica no seu navegador, sem upload." },
    { stepNumber: 2, title: "Defina os cortes do carrossel", description: "Escolha em quantos painéis a imagem será dividida para o carrossel." },
    { stepNumber: 3, title: "Baixe os painéis", description: "Exporte todos os recortes em um ZIP prontos para publicar, um a um, como slides do carrossel." },
  ],
}

// ─── Pages ───

export const carouselPagesByLocale: Record<string, Record<string, ToolPageData>> = {
  en: {
    "carousel-splitter": {
      slug: "carousel-splitter",
      category: "use-case",
      seo: {
        title: "Carousel Splitter - Split Image for Carousel Posts | ImgSplit",
        description: "Split one wide image into equal panels for Instagram, LinkedIn, or TikTok carousel posts. Free browser-based tool — no upload, no signup required.",
        ogTitle: "Carousel Splitter",
        ogDescription: "Split any image into carousel-ready panels in seconds.",
      },
      hero: {
        overline: "Carousel Image Splitter",
        headlinePart1: "Split Images Into ",
        headlineAccent: "Carousel Panels",
        headlinePart2: "",
        description: "Turn one wide or tall image into multiple equal-width panels perfect for Instagram, LinkedIn, and TikTok carousel posts. All processing stays in your browser.",
      },
      scenarios: [
        { icon: "Columns", title: "Instagram Carousel", description: "Slice a panoramic image into 3–10 swipeable Instagram panels that align seamlessly." },
        { icon: "Share2", title: "LinkedIn Carousels", description: "Split infographics and slide decks into carousel-ready images for LinkedIn engagement." },
        { icon: "Smartphone", title: "TikTok Slideshows", description: "Create vertical panel sets from portrait images for TikTok photo carousel posts." },
        { icon: "Package", title: "Batch ZIP Export", description: "Download all panels numbered in order, ready to upload as carousel slides." },
      ],
      howToSteps: howToStepsByLocale.en,
      faqEntries: [
        { question: "What is a carousel splitter?", answer: "A carousel splitter cuts a single wide image into multiple equal panels that you upload one by one as slides in a carousel post on Instagram, LinkedIn, or TikTok." },
        { question: "How many panels can I split my image into?", answer: "You can split into 2 to 10 panels depending on your carousel length." },
        { question: "Does my image get uploaded to a server?", answer: "No. The image is processed entirely in your browser and never sent to any server." },
        { question: "Which image formats are supported?", answer: "PNG, JPEG, and WebP are all supported as input and output formats." },
      ],
      relatedTools: relatedToolsByLocale.en,
    },
    "canva-image-splitter": {
      slug: "canva-image-splitter",
      category: "use-case",
      seo: {
        title: "Canva Image Splitter - Split Canva Designs for Carousel | ImgSplit",
        description: "Export your Canva design as a PNG or JPEG, then split it into carousel panels directly in your browser. Free, private, and no signup required.",
        ogTitle: "Canva Image Splitter",
        ogDescription: "Split Canva exports into carousel panels instantly.",
      },
      hero: {
        overline: "Canva Carousel Splitter",
        headlinePart1: "Split Canva Designs Into ",
        headlineAccent: "Carousel Panels",
        headlinePart2: "",
        description: "Export your Canva design as a flat image, drop it here, and split it into perfectly aligned carousel panels for Instagram, LinkedIn, or TikTok. No plugins needed.",
      },
      scenarios: [
        { icon: "Layers2", title: "Canva Carousel Workflow", description: "Export a long Canva canvas as one image, then slice it into numbered carousel slides." },
        { icon: "Columns", title: "Seamless Panel Alignment", description: "Each panel edge lines up perfectly so your carousel looks like one continuous image." },
        { icon: "Download", title: "Numbered ZIP Export", description: "Receive panels numbered in order — just upload them in sequence as carousel slides." },
      ],
      howToSteps: [
        { stepNumber: 1, title: "Export from Canva", description: "In Canva, download your design as PNG or JPEG at full size." },
        { stepNumber: 2, title: "Upload and Set Panels", description: "Drop the exported image here and choose how many panels to split into." },
        { stepNumber: 3, title: "Download and Post", description: "Export the numbered panel ZIP and upload slides to your carousel in order." },
      ],
      faqEntries: [
        { question: "How do I export a Canva design for carousel splitting?", answer: "In Canva, go to Share → Download and choose PNG or JPEG. Then upload that file here to split into carousel panels." },
        { question: "Does this work with Canva's multi-page designs?", answer: "This tool splits a single flat image. For multi-page Canva designs, export each page individually or merge pages into one long image first." },
        { question: "Will the panels align perfectly for a seamless carousel?", answer: "Yes. The splitter cuts at exact pixel boundaries so adjacent panels share a clean edge." },
        { question: "Do I need a Canva account to use this?", answer: "No. This tool is independent. You only need a PNG or JPEG file — from Canva or anywhere else." },
      ],
      relatedTools: relatedToolsByLocale.en,
    },
  },
  "zh-CN": {
    "carousel-splitter": {
      slug: "carousel-splitter",
      category: "use-case",
      seo: {
        title: "轮播图切割工具 - 一键分割图片为轮播面板 | ImgSplit",
        description: "将一张宽图或长图切割为等宽面板，完美适配 Instagram、小红书、LinkedIn 轮播贴文。免费、浏览器端处理，无需上传。",
        ogTitle: "轮播图切割工具",
        ogDescription: "几秒内将任意图片切割为轮播就绪的面板。",
      },
      hero: {
        overline: "轮播图片切割",
        headlinePart1: "将图片切割为",
        headlineAccent: "轮播面板",
        headlinePart2: "",
        description: "把一张宽图或长图切割为多个等宽面板，完美用于 Instagram、LinkedIn 和小红书轮播贴文，全程在浏览器本地处理。",
      },
      scenarios: [
        { icon: "Columns", title: "Instagram 轮播", description: "将全景图切割为 3–10 张无缝拼接的 Instagram 滑动面板。" },
        { icon: "Share2", title: "小红书多图", description: "把长图信息图切割为适合小红书多图笔记的等宽面板。" },
        { icon: "Smartphone", title: "TikTok 幻灯片", description: "从竖版图片生成适合 TikTok 图集帖子的竖向面板组。" },
        { icon: "Package", title: "编号 ZIP 导出", description: "按顺序编号下载所有面板，直接上传为轮播幻灯片。" },
      ],
      howToSteps: howToStepsByLocale["zh-CN"],
      faqEntries: [
        { question: "什么是轮播图切割工具？", answer: "轮播图切割工具将一张宽图切割为多个等宽面板，你可以逐一上传到 Instagram、小红书或 LinkedIn 作为轮播幻灯片。" },
        { question: "可以切割成几个面板？", answer: "可以切割为 2 到 10 个面板，具体取决于你的轮播长度需求。" },
        { question: "图片会上传吗？", answer: "不会。图片在浏览器本地处理，不会发送到任何服务器。" },
        { question: "支持哪些图片格式？", answer: "支持 PNG、JPEG 和 WebP 作为输入和输出格式。" },
      ],
      relatedTools: relatedToolsByLocale["zh-CN"],
    },
  },
  ja: {
    "carousel-splitter": {
      slug: "carousel-splitter",
      category: "use-case",
      seo: {
        title: "カルーセル画像分割ツール | ImgSplit",
        description: "1枚の横長・縦長画像を等幅パネルに分割し、Instagram・LinkedIn・TikTokのカルーセル投稿に最適化。ブラウザ内処理で無料・プライベート。",
        ogTitle: "カルーセル画像分割ツール",
        ogDescription: "画像をカルーセル用パネルに素早く分割します。",
      },
      hero: {
        overline: "カルーセル分割",
        headlinePart1: "画像を",
        headlineAccent: "カルーセルパネル",
        headlinePart2: "に分割",
        description: "横長または縦長の画像を複数の等幅パネルに分割し、Instagram・LinkedIn・TikTokのカルーセル投稿に使えます。処理はブラウザ内で完結します。",
      },
      scenarios: [
        { icon: "Columns", title: "Instagramカルーセル", description: "パノラマ画像を3〜10枚のシームレスなInstagramスワイプパネルに分割。" },
        { icon: "Share2", title: "LinkedInカルーセル", description: "インフォグラフィックをLinkedIn向けカルーセル画像に分割してエンゲージメントを高めます。" },
        { icon: "Smartphone", title: "TikTokスライドショー", description: "縦型画像からTikTokフォトカルーセル用の縦パネルセットを作成。" },
        { icon: "Package", title: "番号付きZIP書き出し", description: "順番に番号付きで全パネルをダウンロード。スライドとして順番にアップロードできます。" },
      ],
      howToSteps: howToStepsByLocale.ja,
      faqEntries: [
        { question: "カルーセル分割ツールとは？", answer: "1枚の横長画像を複数の等幅パネルに分割し、Instagram・LinkedIn・TikTokのカルーセル投稿スライドとして順番にアップロードできます。" },
        { question: "何枚に分割できますか？", answer: "2〜10枚のパネルに分割できます。" },
        { question: "画像はアップロードされますか？", answer: "いいえ。画像はブラウザ内で処理され、サーバーに送信されません。" },
        { question: "どの画像形式に対応していますか？", answer: "PNG、JPEG、WebPに対応しています。" },
      ],
      relatedTools: relatedToolsByLocale.ja,
    },
  },
  ko: {
    "carousel-splitter": {
      slug: "carousel-splitter",
      category: "use-case",
      seo: {
        title: "캐러셀 이미지 분할기 | ImgSplit",
        description: "하나의 넓은 이미지를 Instagram, LinkedIn, TikTok 캐러셀 게시물용 동일 크기 패널로 분할하세요. 무료, 브라우저 기반, 업로드 없음.",
        ogTitle: "캐러셀 이미지 분할기",
        ogDescription: "이미지를 캐러셀용 패널로 즉시 분할하세요.",
      },
      hero: {
        overline: "캐러셀 이미지 분할",
        headlinePart1: "이미지를",
        headlineAccent: "캐러셀 패널",
        headlinePart2: "로 분할",
        description: "넓거나 긴 이미지 한 장을 여러 동일 너비 패널로 분할하여 Instagram, LinkedIn, TikTok 캐러셀 게시물에 사용하세요. 모든 처리가 브라우저에서 이루어집니다.",
      },
      scenarios: [
        { icon: "Columns", title: "Instagram 캐러셀", description: "파노라마 이미지를 3~10장의 매끄러운 Instagram 스와이프 패널로 분할하세요." },
        { icon: "Share2", title: "LinkedIn 캐러셀", description: "인포그래픽을 LinkedIn 캐러셀 이미지로 분할해 참여도를 높이세요." },
        { icon: "Smartphone", title: "TikTok 슬라이드쇼", description: "세로형 이미지에서 TikTok 사진 캐러셀용 세로 패널 세트를 만드세요." },
        { icon: "Package", title: "번호 ZIP 내보내기", description: "순서대로 번호가 매겨진 모든 패널을 다운로드하고 캐러셀 슬라이드로 업로드하세요." },
      ],
      howToSteps: howToStepsByLocale.ko,
      faqEntries: [
        { question: "캐러셀 분할기란 무엇인가요?", answer: "하나의 넓은 이미지를 여러 동일 너비 패널로 잘라 Instagram, LinkedIn, TikTok의 캐러셀 슬라이드로 하나씩 업로드할 수 있게 해줍니다." },
        { question: "몇 개의 패널로 분할할 수 있나요?", answer: "2~10개 패널로 분할할 수 있습니다." },
        { question: "이미지가 서버에 업로드되나요?", answer: "아니요. 이미지는 브라우저에서 처리되며 어떤 서버에도 전송되지 않습니다." },
        { question: "어떤 이미지 형식을 지원하나요?", answer: "PNG, JPEG, WebP를 입력과 출력 형식으로 지원합니다." },
      ],
      relatedTools: relatedToolsByLocale.ko,
    },
  },
  es: {
    "carousel-splitter": {
      slug: "carousel-splitter",
      category: "use-case",
      seo: {
        title: "Divisor de Carrusel - Divide Imágenes para Carrusel | ImgSplit",
        description: "Divide una imagen ancha en paneles iguales para publicaciones de carrusel en Instagram, LinkedIn o TikTok. Gratis, en el navegador, sin subir archivos.",
        ogTitle: "Divisor de Carrusel",
        ogDescription: "Divide cualquier imagen en paneles listos para carrusel.",
      },
      hero: {
        overline: "Divisor de imágenes para carrusel",
        headlinePart1: "Divide imágenes en ",
        headlineAccent: "Paneles de Carrusel",
        headlinePart2: "",
        description: "Convierte una imagen ancha o alta en múltiples paneles de igual ancho, perfectos para publicaciones de carrusel en Instagram, LinkedIn y TikTok. Todo ocurre en tu navegador.",
      },
      scenarios: [
        { icon: "Columns", title: "Carrusel de Instagram", description: "Divide una imagen panorámica en 3–10 paneles deslizables de Instagram con bordes perfectos." },
        { icon: "Share2", title: "Carruseles de LinkedIn", description: "Divide infografías en imágenes listas para carrusel de LinkedIn y aumenta el engagement." },
        { icon: "Smartphone", title: "Presentaciones de TikTok", description: "Crea series de paneles verticales desde imágenes tipo retrato para carruseles de TikTok." },
        { icon: "Package", title: "ZIP numerado", description: "Descarga todos los paneles numerados en orden, listos para subir como diapositivas de carrusel." },
      ],
      howToSteps: howToStepsByLocale.es,
      faqEntries: [
        { question: "¿Qué es un divisor de carrusel?", answer: "Un divisor de carrusel corta una imagen ancha en varios paneles iguales que puedes subir uno a uno como diapositivas de un carrusel en Instagram, LinkedIn o TikTok." },
        { question: "¿En cuántos paneles puedo dividir la imagen?", answer: "Puedes dividir en 2 a 10 paneles según la longitud de tu carrusel." },
        { question: "¿Se sube la imagen a algún servidor?", answer: "No. La imagen se procesa completamente en tu navegador y nunca se envía a ningún servidor." },
        { question: "¿Qué formatos de imagen admite?", answer: "PNG, JPEG y WebP son compatibles como formatos de entrada y salida." },
      ],
      relatedTools: relatedToolsByLocale.es,
    },
  },
  "pt-BR": {
    "cortar-carrossel": {
      slug: "cortar-carrossel",
      category: "use-case",
      seo: {
        title: "Cortar Carrossel - Divida Imagem para Carrossel Online | ImgSplit",
        description: "Corte uma imagem em partes iguais para publicar como carrossel no Instagram, LinkedIn ou TikTok. Gratuito, direto no navegador, sem instalar nada.",
        ogTitle: "Cortar Carrossel Online",
        ogDescription: "Divida qualquer imagem em partes prontas para carrossel em segundos.",
      },
      hero: {
        overline: "Divisor de Carrossel",
        headlinePart1: "Corte sua imagem em ",
        headlineAccent: "Partes de Carrossel",
        headlinePart2: "",
        description: "Transforme uma imagem larga ou alta em múltiplos painéis de largura igual, perfeitos para carrosséis no Instagram, LinkedIn e TikTok. Tudo no seu navegador, sem upload.",
      },
      scenarios: [
        { icon: "Columns", title: "Carrossel do Instagram", description: "Divida uma imagem panorâmica em 3 a 10 painéis deslizáveis com bordas perfeitas." },
        { icon: "Share2", title: "Carrossel do LinkedIn", description: "Corte infográficos em imagens prontas para carrossel do LinkedIn e aumente o engajamento." },
        { icon: "Smartphone", title: "Slides do TikTok", description: "Crie conjuntos de painéis verticais para carrosséis de fotos no TikTok." },
        { icon: "Package", title: "Download em ZIP numerado", description: "Baixe todos os painéis numerados em ordem, prontos para publicar como slides." },
      ],
      howToSteps: howToStepsByLocale["pt-BR"],
      faqEntries: [
        { question: "Como recortar um carrossel?", answer: "Envie sua imagem aqui, escolha o número de painéis e clique em exportar. O divisor corta a imagem em partes iguais que você publica uma a uma como slides do carrossel." },
        { question: "Como posso cortar um carrossel em partes?", answer: "Selecione de 2 a 10 partes, ajuste a orientação (horizontal ou vertical) e baixe o ZIP com os painéis já numerados na ordem correta." },
        { question: "Qual app cortar carrossel?", answer: "O ImgSplit é uma ferramenta online gratuita que divide imagens para carrossel diretamente no navegador, sem precisar baixar nenhum aplicativo." },
        { question: "Preciso instalar algo para cortar o carrossel?", answer: "Não. O ImgSplit funciona 100% no navegador. Basta acessar o site, enviar sua imagem e baixar as partes do carrossel — sem instalação, sem cadastro." },
      ],
      relatedTools: relatedToolsByLocale["pt-BR"],
    },
    "cortar-imagens-carrossel": {
      slug: "cortar-imagens-carrossel",
      category: "use-case",
      seo: {
        title: "Cortar Imagens para Carrossel Online Grátis | ImgSplit",
        description: "Recorte imagens em partes iguais para posts de carrossel no Instagram, LinkedIn e TikTok. Ferramenta gratuita no navegador, sem upload e sem cadastro.",
        ogTitle: "Cortar Imagens para Carrossel",
        ogDescription: "Recorte imagens em painéis de carrossel de forma rápida e gratuita.",
      },
      hero: {
        overline: "Recortar Imagens para Carrossel",
        headlinePart1: "Recorte Imagens em ",
        headlineAccent: "Painéis de Carrossel",
        headlinePart2: "",
        description: "Envie uma imagem, escolha quantas partes precisa e baixe os painéis numerados para o seu carrossel. Funciona no navegador, sem instalar nada.",
      },
      scenarios: [
        { icon: "Columns", title: "Posts de carrossel", description: "Corte uma imagem larga em partes iguais para publicar slide a slide no Instagram ou LinkedIn." },
        { icon: "Image", title: "Imagens para slides", description: "Prepare imagens de apresentação, infográficos e banners para o formato de carrossel." },
        { icon: "Download", title: "ZIP com painéis ordenados", description: "Baixe todos os painéis numerados em ordem e faça o upload direto na sua rede social preferida." },
      ],
      howToSteps: howToStepsByLocale["pt-BR"],
      faqEntries: [
        { question: "Como recortar imagens para carrossel?", answer: "Carregue a imagem, defina o número de painéis desejado e exporte o ZIP com os recortes numerados." },
        { question: "Quantas partes posso cortar a imagem?", answer: "Você pode cortar entre 2 e 10 partes, de acordo com o tamanho do seu carrossel." },
        { question: "As imagens ficam salvas no servidor?", answer: "Não. Todo o processamento acontece no seu navegador. Nenhuma imagem é enviada para um servidor." },
        { question: "Posso usar no celular?", answer: "Sim. A ferramenta funciona em qualquer dispositivo com navegador moderno, incluindo smartphones." },
      ],
      relatedTools: relatedToolsByLocale["pt-BR"],
    },
    "cortar-carrossel-infinito": {
      slug: "cortar-carrossel-infinito",
      category: "use-case",
      seo: {
        title: "Cortar Carrossel Infinito - Efeito Panorama no Instagram | ImgSplit",
        description: "Crie o efeito de carrossel infinito cortando uma imagem panorâmica em painéis que se encaixam perfeitamente. Gratuito, no navegador, sem instalar nada.",
        ogTitle: "Carrossel Infinito Online",
        ogDescription: "Crie o efeito de carrossel infinito com bordas que se encaixam.",
      },
      hero: {
        overline: "Efeito Carrossel Infinito",
        headlinePart1: "Crie o Efeito de ",
        headlineAccent: "Carrossel Infinito",
        headlinePart2: "",
        description: "Corte uma imagem panorâmica em painéis com bordas perfeitamente alinhadas para criar o famoso efeito de carrossel infinito no Instagram. Sem upload, sem instalação.",
      },
      scenarios: [
        { icon: "Infinity", title: "Efeito panorama infinito", description: "Cada painel se conecta ao próximo sem emendas visíveis, criando uma imagem contínua." },
        { icon: "Columns", title: "Carrossel de até 10 slides", description: "Divida sua imagem em até 10 painéis para criar narrativas visuais longas no Instagram." },
        { icon: "Smartphone", title: "Pronto para postar", description: "Baixe os painéis numerados e publique-os na ordem certa para o efeito perfeito." },
      ],
      howToSteps: howToStepsByLocale["pt-BR"],
      faqEntries: [
        { question: "O que é carrossel infinito no Instagram?", answer: "O carrossel infinito é um efeito em que a imagem continua de um slide para o outro sem interrupção, dando a sensação de uma imagem panorâmica ao deslizar os painéis." },
        { question: "Como criar um carrossel infinito?", answer: "Prepare uma imagem panorâmica larga, carregue aqui, defina o número de slides e baixe os painéis. As bordas são cortadas com precisão de pixel para o efeito ficar perfeito." },
        { question: "Qual a largura ideal da imagem para carrossel infinito?", answer: "Multiplique a largura de um slide pelo número de painéis. Por exemplo, para 5 slides no Instagram (1080 px cada), use uma imagem de pelo menos 5400 px de largura." },
        { question: "Preciso de aplicativo para fazer carrossel infinito?", answer: "Não. O ImgSplit funciona no navegador, sem instalação de aplicativo. Basta acessar, enviar a imagem e baixar os painéis." },
      ],
      relatedTools: relatedToolsByLocale["pt-BR"],
    },
  },
}
