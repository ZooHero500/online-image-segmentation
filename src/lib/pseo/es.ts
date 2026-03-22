import type { ToolPageData } from "./types"

const data: Record<string, ToolPageData> = {
  "split-in-half": {
    slug: "split-in-half",
    category: "direction",
    seo: {
      title: "Dividir Imagen por la Mitad Online — Divisor 50/50 Gratis | ImgSplit",
      description: "Divide cualquier imagen por la mitad al instante — horizontal o verticalmente. Herramienta online gratuita con precisión de píxeles, 100% en el navegador.",
      ogTitle: "Dividir Imagen por la Mitad — Herramienta Online Gratis",
      ogDescription: "Divide cualquier foto en dos mitades iguales con un clic. Sin subir archivos, funciona en tu navegador.",
    },
    hero: {
      overline: "Herramienta de División de Imágenes",
      headlinePart1: "Divide tu Imagen",
      headlineAccent: "por la Mitad",
      headlinePart2: "— Al Instante",
      description: "Divide cualquier imagen en dos partes iguales — horizontal o verticalmente. Precisión de píxeles sin pérdida de calidad, completamente en tu navegador.",
    },
    scenarios: [
      {
        icon: "Columns2",
        title: "Comparaciones antes y después",
        description: "Divide imágenes comparativas en archivos separados para presentaciones lado a lado, demos de productos o documentación de pruebas A/B.",
      },
      {
        icon: "Smartphone",
        title: "Portadas divididas para redes sociales",
        description: "Divide una imagen panorámica en dos mitades para publicaciones dobles en redes sociales que crean un efecto panorámico continuo.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Sube tu imagen", description: "Arrastra y suelta o haz clic para subir la imagen que deseas dividir por la mitad." },
      { stepNumber: 2, title: "Coloca la línea de corte", description: "Añade una línea de corte horizontal o vertical en el centro para dividir la imagen en dos partes iguales." },
      { stepNumber: 3, title: "Descarga ambas mitades", description: "Previsualiza las dos mitades y descárgalas individualmente o como archivo ZIP." },
    ],
    faqEntries: [
      { question: "¿Puedo dividir una imagen en dos partes desiguales?", answer: "Sí. Aunque la herramienta coloca la línea en el centro por defecto, puedes arrastrarla a cualquier posición para crear mitades desiguales — por ejemplo, una división 30/70." },
      { question: "¿Dividir por la mitad reduce la calidad de la imagen?", answer: "No. Cada mitad conserva la resolución y los datos de píxeles originales. No se aplica compresión ni remuestreo." },
      { question: "¿Puedo dividir horizontal y verticalmente al mismo tiempo?", answer: "Por supuesto. Añade una línea horizontal y una vertical para dividir la imagen en cuatro cuadrantes en lugar de dos mitades." },
    ],
    relatedTools: [
      { slug: "/split-horizontally", title: "Dividir Horizontalmente", description: "Divide imágenes con líneas horizontales en secciones superior e inferior." },
      { slug: "/split-vertically", title: "Dividir Verticalmente", description: "Divide imágenes con líneas verticales en secciones izquierda y derecha." },
      { slug: "/split-into-equal-parts", title: "Divisor en Partes Iguales", description: "Divide imágenes en múltiples segmentos iguales en cualquier dirección." },
      { slug: "/", title: "Divisor de Imágenes", description: "Herramienta completa de división de imágenes con líneas arrastrables." },
    ],
  },

  "split-horizontally": {
    slug: "split-horizontally",
    category: "direction",
    seo: {
      title: "Dividir Imagen Horizontalmente Online Gratis | ImgSplit",
      description: "Divide imágenes horizontalmente en secciones superior e inferior. Añade múltiples líneas horizontales para cortes precisos por filas. Gratis, en el navegador, sin subir archivos.",
      ogTitle: "Dividir Imagen Horizontalmente — Cortador Online Gratis",
      ogDescription: "Añade líneas de corte horizontales para dividir imágenes en filas. Gratis y en el navegador.",
    },
    hero: {
      overline: "División Horizontal",
      headlinePart1: "Divide Imágenes",
      headlineAccent: "Horizontalmente",
      headlinePart2: "— Fila por Fila",
      description: "Añade líneas de corte horizontales para dividir cualquier imagen en secciones superior e inferior, tiras o filas. Perfecto para cortar imágenes altas o crear segmentos horizontales.",
    },
    scenarios: [
      {
        icon: "LayoutList",
        title: "Segmentar imágenes altas de productos",
        description: "Divide imágenes altas de productos de tiendas online en secciones horizontales manejables para optimizar la carga y organizar la visualización.",
      },
      {
        icon: "FileText",
        title: "Segmentar documentos escaneados",
        description: "Divide documentos escaneados con múltiples secciones — recibos, facturas o formularios — en tiras horizontales individuales para archivarlos por separado.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Sube tu imagen", description: "Arrastra o selecciona cualquier imagen — PNG, JPG o WebP de hasta 20 MB." },
      { stepNumber: 2, title: "Añade líneas horizontales", description: "Haz clic en 'Añadir línea horizontal' para colocar una o más líneas de corte. Arrastra cada línea a la posición exacta." },
      { stepNumber: 3, title: "Descarga las filas", description: "Previsualiza cada tira horizontal y descarga todas a la vez como ZIP o selecciona filas específicas." },
    ],
    faqEntries: [
      { question: "¿Cuántas líneas horizontales puedo añadir?", answer: "Puedes añadir hasta 20 líneas de corte horizontales, creando hasta 21 tiras horizontales a partir de una sola imagen." },
      { question: "¿Puedo combinar líneas horizontales y verticales?", answer: "Sí. Añadir ambas crea una cuadrícula — para tiras puramente horizontales, solo añade líneas horizontales." },
      { question: "¿Hay una función de ajuste a cuadrícula para una colocación precisa?", answer: "Sí. Las líneas de corte se ajustan automáticamente a los bordes cercanos y a la línea central, ayudándote a colocarlas con precisión de píxeles." },
    ],
    relatedTools: [
      { slug: "/split-in-half", title: "Dividir por la Mitad", description: "Divide una imagen en dos partes iguales con una sola línea." },
      { slug: "/split-vertically", title: "Dividir Verticalmente", description: "Corta imágenes con líneas verticales en columnas izquierda y derecha." },
      { slug: "/split-long-screenshot", title: "Divisor de Capturas Largas", description: "Divide capturas de pantalla largas en segmentos legibles del tamaño de una página." },
      { slug: "/grid", title: "Divisor en Cuadrícula", description: "Divide imágenes en cuadrículas de 3×3, 1×3 o 2×2." },
    ],
  },

  "split-vertically": {
    slug: "split-vertically",
    category: "direction",
    seo: {
      title: "Dividir Imagen Verticalmente Online Gratis | ImgSplit",
      description: "Divide imágenes verticalmente en columnas izquierda y derecha. Añade múltiples líneas verticales para cortes por columnas. Gratis, privado, funciona en tu navegador.",
      ogTitle: "Dividir Imagen Verticalmente — Cortador de Columnas Gratis",
      ogDescription: "Añade líneas de corte verticales para dividir imágenes en columnas. En el navegador y privado.",
    },
    hero: {
      overline: "División Vertical",
      headlinePart1: "Divide Imágenes",
      headlineAccent: "Verticalmente",
      headlinePart2: "— Columna por Columna",
      description: "Coloca líneas de corte verticales para dividir cualquier imagen en secciones izquierda y derecha, columnas o tiras verticales. Ideal para imágenes panorámicas y diseños multicolumna.",
    },
    scenarios: [
      {
        icon: "Columns3",
        title: "Tiras cómicas multipanel",
        description: "Separa los paneles de tiras cómicas o cuadros de storyboard dispuestos uno al lado del otro en paneles verticales individuales.",
      },
      {
        icon: "LayoutDashboard",
        title: "Columnas de capturas de dashboards",
        description: "Extrae columnas específicas de capturas de dashboards o hojas de cálculo anchas para informes y presentaciones enfocados.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Sube tu imagen", description: "Sube la imagen panorámica o ancha que deseas dividir en columnas verticales." },
      { stepNumber: 2, title: "Añade líneas verticales", description: "Coloca una o más líneas de corte verticales y arrástralas para definir los límites de las columnas." },
      { stepNumber: 3, title: "Descarga las columnas", description: "Revisa cada segmento de columna y descárgalos individualmente o expórtalos todos como archivo ZIP." },
    ],
    faqEntries: [
      { question: "¿Cuál es el número máximo de cortes verticales?", answer: "Hasta 20 líneas verticales, produciendo un máximo de 21 columnas a partir de una sola imagen." },
      { question: "¿Dividir una panorámica perderá píxeles en los bordes?", answer: "No. La herramienta utiliza límites exactos de píxeles — no se pierden ni se difuminan píxeles en los bordes de corte." },
      { question: "¿Puedo dividir verticalmente una imagen en formato retrato?", answer: "Sí, aunque los cortes verticales funcionan mejor en imágenes horizontales o anchas. Las imágenes en retrato producirán tiras verticales estrechas." },
    ],
    relatedTools: [
      { slug: "/split-in-half", title: "Dividir por la Mitad", description: "Una línea, dos partes iguales — la forma más simple de dividir una imagen." },
      { slug: "/split-horizontally", title: "Dividir Horizontalmente", description: "Corta imágenes en filas y tiras horizontales." },
      { slug: "/split-for-instagram", title: "Divisor para Instagram", description: "Divide imágenes anchas en mosaicos para publicaciones en carrusel de Instagram." },
      { slug: "/grid", title: "Divisor en Cuadrícula", description: "Crea mosaicos de cuadrícula 3×3 o personalizados a partir de cualquier imagen." },
    ],
  },

  "split-into-equal-parts": {
    slug: "split-into-equal-parts",
    category: "direction",
    seo: {
      title: "Dividir Imagen en Partes Iguales Online Gratis | ImgSplit",
      description: "Divide cualquier imagen en partes iguales — 2, 3, 4 o más segmentos iguales. Herramienta online gratuita con alineación automática para divisiones uniformes. Sin subir archivos.",
      ogTitle: "Dividir Imagen en Partes Iguales — Herramienta Gratis",
      ogDescription: "Divide imágenes en segmentos perfectamente iguales con líneas de corte alineadas automáticamente.",
    },
    hero: {
      overline: "Divisor en Partes Iguales",
      headlinePart1: "Dividir en",
      headlineAccent: "Partes Iguales",
      headlinePart2: "— Uniforme y Preciso",
      description: "Divide cualquier imagen en 2, 3, 4 o más segmentos perfectamente iguales. La alineación automática garantiza divisiones uniformes con precisión de píxeles.",
    },
    scenarios: [
      {
        icon: "Grid2X2",
        title: "Preparación de puzzles y collages",
        description: "Divide una imagen en mosaicos iguales para crear puzzles tipo rompecabezas, materiales educativos o piezas listas para collage.",
      },
      {
        icon: "Printer",
        title: "Mosaicos de impresión uniformes",
        description: "Divide una imagen grande en mosaicos de impresión del mismo tamaño para que cada pieza se ajuste a tamaños de papel estándar y permita un ensamblaje perfecto.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Sube tu imagen", description: "Selecciona la imagen que deseas dividir en secciones iguales." },
      { stepNumber: 2, title: "Añade líneas equidistantes", description: "Añade líneas horizontales o verticales. Usa la alineación automática para distribuirlas uniformemente en la imagen." },
      { stepNumber: 3, title: "Descarga los segmentos iguales", description: "Verifica que todas las partes sean iguales y luego descarga cada segmento o el conjunto completo como ZIP." },
    ],
    faqEntries: [
      { question: "¿Cómo me aseguro de que las partes sean perfectamente iguales?", answer: "Usa la función de alineación automática — las líneas se ajustan automáticamente a posiciones equidistantes. Para una división en 3 partes, coloca 2 líneas y se alinearán en las marcas de 1/3 y 2/3." },
      { question: "¿Puedo crear una cuadrícula de rectángulos iguales?", answer: "Sí. Añade líneas horizontales y verticales equidistantes para crear una cuadrícula de rectángulos de tamaño idéntico — perfecto para flujos de trabajo basados en mosaicos." },
      { question: "¿Qué pasa si las dimensiones de la imagen no son divisibles exactamente?", answer: "El último segmento puede diferir en un píxel. La herramienta distribuye los píxeles de la manera más uniforme posible para minimizar cualquier diferencia de tamaño." },
    ],
    relatedTools: [
      { slug: "/split-in-half", title: "Dividir por la Mitad", description: "La división igual más simple — divide una imagen exactamente en dos mitades." },
      { slug: "/split-for-print", title: "Divisor para Impresión", description: "Divide imágenes grandes en mosaicos del tamaño de papel estándar para imprimir." },
      { slug: "/no-photoshop-slicer", title: "Cortar sin Photoshop", description: "Una alternativa gratuita a la herramienta de corte de Photoshop para dividir imágenes rápidamente." },
      { slug: "/grid", title: "Divisor en Cuadrícula", description: "Diseños de cuadrícula predefinidos: 3×3, 1×3 y 2×2." },
    ],
  },

  "split-long-screenshot": {
    slug: "split-long-screenshot",
    category: "use-case",
    seo: {
      title: "Dividir Capturas Largas en Páginas — Gratis Online | ImgSplit",
      description: "Divide capturas de pantalla largas en segmentos del tamaño de una página para compartir y leer fácilmente. Herramienta gratuita en el navegador — sin subir archivos, funciona con cualquier imagen alta.",
      ogTitle: "Dividir Capturas Largas — Divisor de Páginas Gratis",
      ogDescription: "Divide capturas de pantalla largas en piezas legibles del tamaño de una página. Sin necesidad de subir archivos.",
    },
    hero: {
      overline: "Divisor de Imágenes Largas",
      headlinePart1: "Divide Capturas",
      headlineAccent: "Largas",
      headlinePart2: "en Páginas",
      description: "Divide capturas de pantalla con desplazamiento largo en segmentos del tamaño de una página para compartir, leer y archivar fácilmente. Funciona con cualquier imagen alta.",
    },
    scenarios: [
      {
        icon: "MessageSquare",
        title: "Archivo de historial de chat",
        description: "Divide capturas completas de conversaciones de aplicaciones de mensajería en imágenes individuales del tamaño de pantalla para almacenamiento organizado y uso compartido selectivo.",
      },
      {
        icon: "FileSearch",
        title: "Documentación de páginas web",
        description: "Divide capturas largas de páginas web en secciones manejables para informes de errores, revisiones de diseño o documentación de cumplimiento.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Sube la captura larga", description: "Sube tu captura de pantalla con desplazamiento — la herramienta maneja imágenes de cualquier altura." },
      { stepNumber: 2, title: "Coloca los cortes horizontales", description: "Añade líneas de corte horizontales donde desees los saltos de página. Usa la alineación automática para un espaciado uniforme." },
      { stepNumber: 3, title: "Descarga los segmentos", description: "Previsualiza cada segmento y descarga todas las páginas como ZIP para compartir fácilmente." },
    ],
    faqEntries: [
      { question: "¿Hay una altura máxima para las capturas de pantalla largas?", answer: "La herramienta puede manejar imágenes de hasta 20 MB de tamaño. Las imágenes muy altas (más de 10.000 px) pueden procesarse más lentamente, pero son totalmente compatibles." },
      { question: "¿Puedo dividir una captura en segmentos de igual longitud?", answer: "Sí. Añade múltiples líneas horizontales y usa la alineación automática para espaciarlas uniformemente, creando segmentos de altura uniforme." },
      { question: "¿El texto de mi captura seguirá siendo nítido después de dividirla?", answer: "Por supuesto. La herramienta recorta a la resolución original sin ningún remuestreo, por lo que el texto se mantiene nítido y legible." },
    ],
    relatedTools: [
      { slug: "/split-horizontally", title: "Divisor Horizontal", description: "Añade líneas horizontales para dividir cualquier imagen en filas." },
      { slug: "/split-for-instagram", title: "Divisor para Instagram", description: "Divide imágenes en publicaciones de carrusel con múltiples diapositivas." },
      { slug: "/split-for-wechat", title: "Divisor para Redes Sociales", description: "Prepara imágenes en cuadrícula para publicaciones en redes sociales." },
      { slug: "/", title: "Divisor de Imágenes", description: "Herramienta completa de división con líneas arrastrables." },
    ],
  },

  "split-for-instagram": {
    slug: "split-for-instagram",
    category: "use-case",
    seo: {
      title: "Dividir Imágenes para Instagram — Carrusel y Cuadrícula Gratis | ImgSplit",
      description: "Divide imágenes para publicaciones en carrusel y cuadrícula del perfil de Instagram. Optimizado para 1080×1080px. Gratis, en el navegador, sin marcas de agua.",
      ogTitle: "Divisor de Imágenes para Instagram — Herramienta Gratis de Carrusel y Cuadrícula",
      ogDescription: "Divide imágenes en mosaicos listos para Instagram. Optimizado para publicaciones de 1080×1080px.",
    },
    hero: {
      overline: "Divisor para Instagram",
      headlinePart1: "Divide para",
      headlineAccent: "Instagram",
      headlinePart2: "— Carrusel y Cuadrícula",
      description: "Crea impresionantes diapositivas de carrusel y diseños de cuadrícula para tu perfil de Instagram dividiendo tus imágenes en mosaicos perfectamente dimensionados. Optimizado para las dimensiones nativas de Instagram.",
    },
    platformInfo: "Tamaño recomendado de publicación en Instagram: 1080 × 1080 px (1:1 cuadrado). El carrusel admite hasta 10 diapositivas.",
    scenarios: [
      {
        icon: "LayoutGrid",
        title: "Cuadrícula de perfil continua",
        description: "Divide una imagen ancha en 3, 6 o 9 mosaicos que crean un efecto panorámico continuo en la cuadrícula de tu perfil de Instagram.",
      },
      {
        icon: "GalleryHorizontal",
        title: "Diapositivas de publicación en carrusel",
        description: "Divide una foto panorámica o infografía en diapositivas de carrusel deslizables que cuentan una historia visual a través de múltiples fotogramas.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Sube tu imagen", description: "Sube la imagen o panorámica que deseas dividir para Instagram." },
      { stepNumber: 2, title: "Configura tu cuadrícula", description: "Añade líneas verticales para diapositivas de carrusel, o crea una cuadrícula para el diseño del perfil. Usa la alineación automática para un espaciado uniforme." },
      { stepNumber: 3, title: "Descarga los mosaicos para Instagram", description: "Descarga todos los mosaicos como ZIP. Súbelos a Instagram en orden para un resultado perfecto." },
    ],
    faqEntries: [
      { question: "¿Qué tamaño debe tener cada mosaico de Instagram?", answer: "Instagram muestra las publicaciones a 1080×1080px (cuadrado). Para publicaciones en carrusel, cada diapositiva debe tener 1080px de ancho. La herramienta te permite dividir en cualquier límite." },
      { question: "¿Cuántas diapositivas puede tener un carrusel de Instagram?", answer: "Instagram permite hasta 10 diapositivas por publicación en carrusel. Divide tu imagen en 2 a 10 segmentos verticales para crear una panorámica deslizable." },
      { question: "¿Los mosaicos estarán en el orden correcto para publicar?", answer: "Sí. Los mosaicos se numeran de izquierda a derecha (para cortes verticales) o de arriba a abajo (para cortes horizontales), coincidiendo con el orden de subida de Instagram." },
    ],
    relatedTools: [
      { slug: "/split-into-equal-parts", title: "Divisor en Partes Iguales", description: "Divide imágenes en segmentos perfectamente iguales para cualquier plataforma." },
      { slug: "/split-long-screenshot", title: "Divisor de Capturas Largas", description: "Divide imágenes altas en segmentos compartibles del tamaño de una página." },
      { slug: "/split-for-wechat", title: "Divisor para Redes Sociales", description: "Divide imágenes en cuadrícula para publicaciones en redes sociales." },
      { slug: "/grid", title: "Divisor en Cuadrícula", description: "Divisiones rápidas en cuadrícula 3×3 optimizadas para redes sociales." },
    ],
  },

  "split-for-wechat": {
    slug: "split-for-wechat",
    category: "use-case",
    seo: {
      title: "Divisor de Imágenes en Cuadrícula Online Gratis — Divide Fotos al Instante | ImgSplit",
      description: "Divisor de imágenes online gratis con líneas de corte arrastrables. Corta fotos en cualquier cuadrícula o segmentos personalizados. En el navegador, privado, sin subir archivos.",
      ogTitle: "Divisor de Imágenes Gratis — Divide Fotos Online",
      ogDescription: "Divide imágenes en cuadrículas o segmentos personalizados. Gratis y en el navegador.",
    },
    hero: {
      overline: "Divisor de Imágenes en Cuadrícula",
      headlinePart1: "Divide Imágenes",
      headlineAccent: "en Cuadrícula",
      headlinePart2: "— Para Redes Sociales",
      description: "Divide imágenes en mosaicos de cuadrícula para publicaciones en redes sociales. Arrastra las líneas de corte para crear cuadrículas personalizadas o usa el espaciado uniforme para mosaicos regulares.",
    },
    scenarios: [
      {
        icon: "Share2",
        title: "Publicaciones en cuadrícula para redes sociales",
        description: "Crea publicaciones en cuadrícula llamativas dividiendo una imagen en múltiples mosaicos que forman un conjunto visual coherente al verse en tu perfil.",
      },
      {
        icon: "Maximize2",
        title: "Segmentación de imágenes grandes",
        description: "Divide imágenes de gran tamaño en mosaicos de cuadrícula manejables para plataformas con límites de tamaño o dimensiones de subida.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Sube tu imagen", description: "Sube la foto que deseas dividir en mosaicos de cuadrícula." },
      { stepNumber: 2, title: "Crea tu cuadrícula", description: "Añade líneas horizontales y verticales para definir tu diseño de cuadrícula. La alineación automática ayuda a crear un espaciado uniforme." },
      { stepNumber: 3, title: "Descarga los mosaicos", description: "Descarga todas las piezas de la cuadrícula como archivo ZIP, listas para publicar en orden en tu plataforma social." },
    ],
    faqEntries: [
    ],
    relatedTools: [
      { slug: "/split-for-instagram", title: "Divisor para Instagram", description: "Divide imágenes específicamente para publicaciones en carrusel y cuadrícula de Instagram." },
      { slug: "/split-long-screenshot", title: "Divisor de Capturas Largas", description: "Divide capturas de pantalla altas en segmentos del tamaño de una página." },
      { slug: "/", title: "Divisor de Imágenes", description: "Herramienta completa de división de imágenes con líneas de corte personalizables." },
      { slug: "/grid", title: "Divisor en Cuadrícula", description: "Divisiones rápidas en cuadrícula predefinida: 3×3, 1×3, 2×2." },
    ],
  },

  "split-for-print": {
    slug: "split-for-print",
    category: "use-case",
    seo: {
      title: "Dividir Imagen para Imprimir en Mosaicos — Gratis Online | ImgSplit",
      description: "Divide imágenes grandes en mosaicos imprimibles que se ajustan a tamaños de papel estándar. Imprime y ensambla pósters, banners y arte de gran formato. Herramienta gratuita en el navegador.",
      ogTitle: "Dividir Imagen para Imprimir — Herramienta de Mosaicos Gratis",
      ogDescription: "Divide imágenes grandes en mosaicos del tamaño de una página para imprimir y ensamblar.",
    },
    hero: {
      overline: "Divisor para Impresión",
      headlinePart1: "Divide para",
      headlineAccent: "Imprimir",
      headlinePart2: "— Mosaicos y Ensamblaje",
      description: "Divide imágenes grandes en mosaicos del tamaño de una página que puedes imprimir en papel estándar y ensamblar en pósters, banners o arte mural.",
    },
    scenarios: [
      {
        icon: "Image",
        title: "Impresión de pósters DIY",
        description: "Convierte cualquier imagen de alta resolución en un póster de varias páginas — divídela en mosaicos A4 o Carta, imprímelos en casa y pégalos para un resultado de gran formato.",
      },
      {
        icon: "Ruler",
        title: "Planos arquitectónicos y diseños técnicos",
        description: "Divide planos técnicos o diseños de planta de gran tamaño en secciones imprimibles para que cada página muestre una porción manejable del diseño.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Sube la imagen grande", description: "Sube la imagen de alta resolución, póster o plano que deseas imprimir en mosaicos." },
      { stepNumber: 2, title: "Define los límites de los mosaicos", description: "Añade líneas de corte equidistantes para crear mosaicos que coincidan con el tamaño de tu papel. Usa la alineación automática para un espaciado uniforme." },
      { stepNumber: 3, title: "Imprime y ensambla", description: "Descarga todos los mosaicos, imprime cada uno en una página separada y organízalos para reconstruir la imagen completa." },
    ],
    faqEntries: [
      { question: "¿Qué tamaño de papel debo usar para los mosaicos?", answer: "Para impresoras domésticas, A4 (210×297mm) o Carta US (8.5×11 pulgadas) son los estándares. Calcula el número de mosaicos según la proporción de tu imagen y el tamaño final deseado." },
      { question: "¿La herramienta añade márgenes de superposición para el ensamblaje?", answer: "La herramienta divide en los límites exactos de píxeles. Para márgenes de superposición, aumenta ligeramente el número de mosaicos para que las piezas adyacentes compartan una franja delgada para la alineación." },
      { question: "¿Puedo dividir una imagen de muy alta resolución (por ejemplo, 8000×6000)?", answer: "Sí. La herramienta maneja imágenes grandes de hasta 20 MB. Para archivos de resolución extremadamente alta, considera usar el formato WebP para un tamaño de archivo menor." },
    ],
    relatedTools: [
      { slug: "/split-into-equal-parts", title: "Divisor en Partes Iguales", description: "Divide imágenes en segmentos perfectamente iguales para mosaicos uniformes." },
      { slug: "/split-horizontally", title: "Divisor Horizontal", description: "Divide imágenes en filas para impresión en tiras." },
      { slug: "/no-photoshop-slicer", title: "Cortar sin Photoshop", description: "Una alternativa online gratuita al flujo de trabajo de corte y exportación de Photoshop." },
      { slug: "/", title: "Divisor de Imágenes", description: "Herramienta completa de división de imágenes con líneas personalizables." },
    ],
  },

  "no-photoshop-slicer": {
    slug: "no-photoshop-slicer",
    category: "use-case",
    seo: {
      title: "Cortador de Imágenes Online Gratis — Sin Necesidad de Photoshop | ImgSplit",
      description: "Una alternativa gratuita a la herramienta de corte de Photoshop. Divide imágenes en regiones sin instalar nada. En el navegador, privado e instantáneo.",
      ogTitle: "Cortador de Imágenes sin Photoshop — Herramienta Online Gratis",
      ogDescription: "Olvídate de Photoshop. Corta imágenes en regiones al instante en tu navegador.",
    },
    hero: {
      overline: "Cortador sin Photoshop",
      headlinePart1: "Cortador de Imágenes",
      headlineAccent: "Sin Photoshop",
      headlinePart2: "Necesario",
      description: "Olvídate de las costosas suscripciones de software. Divide y corta imágenes en cualquier diseño usando líneas arrastrables — completamente gratis, completamente en tu navegador.",
    },
    scenarios: [
      {
        icon: "DollarSign",
        title: "Ahorra la suscripción",
        description: "Obtén cortes de imagen con calidad de Photoshop sin la suscripción mensual de Creative Cloud — gratis y accesible para todos.",
      },
      {
        icon: "GraduationCap",
        title: "Flujo de trabajo para principiantes",
        description: "Sin capas, sin barras de herramientas, sin curva de aprendizaje. Solo arrastra las líneas donde quieras cortar y descarga las piezas — cualquiera puede hacerlo en segundos.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Sube tu imagen", description: "Arrastra y suelta o haz clic para subir. Sin necesidad de cuenta ni software que instalar." },
      { stepNumber: 2, title: "Arrastra las líneas de corte", description: "Añade líneas horizontales y verticales para definir las regiones de corte. La alineación automática garantiza la precisión." },
      { stepNumber: 3, title: "Exporta tus cortes", description: "Descarga todas las regiones cortadas como ZIP — listas para web, redes sociales o cualquier otro uso." },
    ],
    faqEntries: [
      { question: "¿Es realmente tan preciso como la herramienta de corte de Photoshop?", answer: "Sí. La herramienta divide en los límites exactos de píxeles con alineación automática — obtienes la misma precisión de píxeles sin la complejidad." },
      { question: "¿Puedo cortar imágenes para plantillas de correo electrónico HTML?", answer: "Por supuesto. Corta tu diseño de correo electrónico en secciones, exporta cada región y referéncialas en tu plantilla HTML para diseños de correo con precisión de píxeles." },
      { question: "¿Necesito crear una cuenta?", answer: "No. La herramienta es completamente gratuita y no requiere registro. Abre la página, sube, corta y descarga — eso es todo." },
    ],
    relatedTools: [
      { slug: "/split-in-half", title: "Dividir por la Mitad", description: "La división más simple — divide cualquier imagen en dos partes iguales." },
      { slug: "/split-for-print", title: "Divisor para Impresión", description: "Divide imágenes grandes en mosaicos imprimibles del tamaño de una página." },
      { slug: "/split-for-instagram", title: "Divisor para Instagram", description: "Divide imágenes para publicaciones en carrusel y cuadrícula de Instagram." },
      { slug: "/", title: "Divisor de Imágenes", description: "Herramienta completa de división de imágenes con líneas arrastrables." },
    ],
  },

}

export default data
