import type { ToolPageData } from "./types"

const data: Record<string, ToolPageData> = {
  "split-in-half": {
    slug: "split-in-half",
    category: "direction",
    seo: {
      title: "이미지 반으로 자르기 — 무료 온라인 이미지 분할 도구 | ImgSplit",
      description: "이미지를 가로 또는 세로로 즉시 반으로 분할하세요. 픽셀 단위 정밀도를 갖춘 무료 온라인 도구, 서버 업로드 없이 100% 브라우저에서 처리됩니다.",
      ogTitle: "이미지 반으로 자르기 — 무료 온라인 도구",
      ogDescription: "클릭 한 번으로 사진을 두 개의 동일한 반쪽으로 나눠보세요. 업로드 불필요, 브라우저에서 바로 작동합니다.",
    },
    hero: {
      overline: "이미지 분할 도구",
      headlinePart1: "이미지를",
      headlineAccent: "반으로 자르기",
      headlinePart2: "— 즉시 완료",
      description: "이미지를 가로 또는 세로로 두 개의 동일한 부분으로 나누세요. 픽셀 단위 정밀도로 화질 손실 없이 브라우저에서 모든 작업이 이루어집니다.",
    },
    scenarios: [
      {
        icon: "Columns2",
        title: "비포 & 애프터 비교",
        description: "비교 이미지를 별도 파일로 분할하여 프레젠테이션, 제품 데모 또는 A/B 테스트 문서에 활용하세요.",
      },
      {
        icon: "Smartphone",
        title: "소셜 미디어 커버 분할",
        description: "넓은 배너 이미지를 두 부분으로 나눠 이중 포스트 레이아웃으로 파노라마 효과를 연출하세요.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "이미지 업로드", description: "반으로 자를 이미지를 드래그 앤 드롭하거나 클릭하여 업로드하세요." },
      { stepNumber: 2, title: "분할선 배치", description: "이미지 중앙에 가로 또는 세로 분할선을 추가하여 두 개의 동일한 부분으로 나누세요." },
      { stepNumber: 3, title: "양쪽 다운로드", description: "두 부분을 미리보기한 후 개별적으로 또는 ZIP 파일로 다운로드하세요." },
    ],
    faqEntries: [
      { question: "이미지를 불균등하게 나눌 수 있나요?", answer: "네. 분할선은 기본적으로 중앙에 배치되지만, 원하는 위치로 드래그하여 30/70과 같은 불균등 분할이 가능합니다." },
      { question: "반으로 자르면 이미지 품질이 저하되나요?", answer: "아닙니다. 각 반쪽은 원본 해상도와 픽셀 데이터를 그대로 유지합니다. 압축이나 리샘플링이 전혀 없습니다." },
      { question: "가로와 세로를 동시에 자를 수 있나요?", answer: "물론입니다. 가로선과 세로선을 하나씩 추가하면 이미지를 두 부분이 아닌 네 개의 사분면으로 나눌 수 있습니다." },
    ],
    relatedTools: [
      { slug: "/split-horizontally", title: "가로 분할", description: "가로 분할선으로 이미지를 상단과 하단 영역으로 나누세요." },
      { slug: "/split-vertically", title: "세로 분할", description: "세로 분할선으로 이미지를 좌측과 우측 영역으로 나누세요." },
      { slug: "/split-into-equal-parts", title: "균등 분할", description: "이미지를 원하는 방향으로 여러 개의 동일한 크기로 나누세요." },
      { slug: "/", title: "이미지 분할 도구", description: "드래그 앤 드롭 분할선을 지원하는 다기능 이미지 분할 도구." },
    ],
  },

  "split-horizontally": {
    slug: "split-horizontally",
    category: "direction",
    seo: {
      title: "이미지 가로 자르기 — 무료 온라인 수평 분할 도구 | ImgSplit",
      description: "이미지를 가로로 분할하여 상단과 하단으로 나누세요. 여러 개의 수평선을 추가하여 정밀하게 행 단위로 자를 수 있습니다. 무료, 브라우저 기반, 업로드 불필요.",
      ogTitle: "이미지 가로 자르기 — 무료 온라인 도구",
      ogDescription: "수평 분할선을 추가하여 이미지를 행 단위로 나누세요. 무료, 브라우저 기반.",
    },
    hero: {
      overline: "수평 분할",
      headlinePart1: "이미지",
      headlineAccent: "가로 자르기",
      headlinePart2: "— 행 단위로",
      description: "수평 분할선을 추가하여 이미지를 상단과 하단 영역, 스트립 또는 행으로 나누세요. 긴 이미지 분할이나 수평 세그먼트 제작에 최적입니다.",
    },
    scenarios: [
      {
        icon: "LayoutList",
        title: "긴 제품 이미지 분할",
        description: "쇼핑몰의 긴 제품 상세 이미지를 관리 가능한 수평 섹션으로 분할하여 페이지 로딩을 최적화하고 정리된 형태로 표시하세요.",
      },
      {
        icon: "FileText",
        title: "스캔 문서 분할",
        description: "영수증, 인보이스, 양식 등 여러 섹션이 포함된 스캔 문서를 개별 수평 스트립으로 나눠 별도로 정리하세요.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "이미지 업로드", description: "PNG, JPG, WebP 등 최대 20MB의 이미지를 드롭하거나 선택하세요." },
      { stepNumber: 2, title: "수평선 추가", description: "'가로 분할선 추가'를 클릭하여 하나 이상의 수평 분할선을 배치하고, 원하는 위치로 드래그하세요." },
      { stepNumber: 3, title: "각 행 다운로드", description: "각 수평 스트립을 미리보기한 후 ZIP으로 일괄 다운로드하거나 원하는 행만 선택하여 다운로드하세요." },
    ],
    faqEntries: [
      { question: "수평 분할선을 최대 몇 개까지 추가할 수 있나요?", answer: "최대 20개의 수평 분할선을 추가할 수 있으며, 하나의 이미지에서 최대 21개의 수평 스트립을 만들 수 있습니다." },
      { question: "수평선과 수직선을 함께 사용할 수 있나요?", answer: "네. 둘 다 추가하면 격자(그리드) 형태로 잘립니다. 수평 스트립만 원하시면 수평선만 추가하세요." },
      { question: "정밀 배치를 위한 스냅 기능이 있나요?", answer: "네. 분할선이 가장자리와 중심선에 자동으로 스냅되어 픽셀 수준의 정확한 배치를 도와줍니다." },
    ],
    relatedTools: [
      { slug: "/split-in-half", title: "반으로 자르기", description: "하나의 선으로 이미지를 두 개의 동일한 부분으로 나누세요." },
      { slug: "/split-vertically", title: "세로 자르기", description: "세로선으로 이미지를 좌우 열로 나누세요." },
      { slug: "/split-long-screenshot", title: "긴 스크린샷 분할", description: "긴 스크린샷을 읽기 좋은 페이지 크기로 나누세요." },
      { slug: "/grid", title: "그리드 분할", description: "이미지를 3×3, 1×3 또는 2×2 그리드 타일로 나누세요." },
    ],
  },

  "split-vertically": {
    slug: "split-vertically",
    category: "direction",
    seo: {
      title: "이미지 세로 자르기 — 무료 온라인 수직 분할 도구 | ImgSplit",
      description: "이미지를 세로로 분할하여 좌우 열로 나누세요. 여러 개의 수직선을 추가하여 열 단위로 정밀하게 자를 수 있습니다. 무료, 개인정보 보호, 브라우저에서 처리.",
      ogTitle: "이미지 세로 자르기 — 무료 열 분할 도구",
      ogDescription: "수직 분할선을 추가하여 이미지를 열로 나누세요. 브라우저 기반, 개인정보 보호.",
    },
    hero: {
      overline: "수직 분할",
      headlinePart1: "이미지",
      headlineAccent: "세로 자르기",
      headlinePart2: "— 열 단위로",
      description: "수직 분할선을 배치하여 이미지를 좌우 영역, 열 또는 수직 스트립으로 나누세요. 넓은 이미지나 다중 열 레이아웃 분할에 최적입니다.",
    },
    scenarios: [
      {
        icon: "Columns3",
        title: "만화 패널 분리",
        description: "가로로 나열된 만화 칸이나 스토리보드 프레임을 개별 세로 패널로 분리하세요.",
      },
      {
        icon: "LayoutDashboard",
        title: "대시보드 스크린샷 열 추출",
        description: "넓은 대시보드나 스프레드시트 스크린샷에서 특정 열을 추출하여 보고서와 프레젠테이션에 활용하세요.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "이미지 업로드", description: "세로 열로 분할하려는 넓은 이미지 또는 파노라마를 업로드하세요." },
      { stepNumber: 2, title: "수직선 추가", description: "하나 이상의 수직 분할선을 배치하고 드래그하여 열 경계를 정하세요." },
      { stepNumber: 3, title: "각 열 다운로드", description: "각 열 세그먼트를 확인한 후 개별 다운로드하거나 ZIP 파일로 내보내세요." },
    ],
    faqEntries: [
      { question: "수직 분할선은 최대 몇 개까지 가능한가요?", answer: "최대 20개의 수직선을 추가할 수 있으며, 하나의 이미지에서 최대 21개의 열을 만들 수 있습니다." },
      { question: "파노라마를 분할하면 가장자리 픽셀이 손실되나요?", answer: "아닙니다. 픽셀 단위로 정확한 경계에서 분할하므로 분할 가장자리에서 픽셀이 손실되거나 흐려지지 않습니다." },
      { question: "세로 방향 이미지도 수직으로 자를 수 있나요?", answer: "네, 가능합니다. 다만 수직 분할은 가로 방향이나 넓은 이미지에 더 적합합니다. 세로 이미지를 수직 분할하면 좁은 세로 스트립이 생성됩니다." },
    ],
    relatedTools: [
      { slug: "/split-in-half", title: "반으로 자르기", description: "하나의 선, 두 개의 동일한 부분 — 가장 간단한 이미지 분할 방법." },
      { slug: "/split-horizontally", title: "가로 자르기", description: "이미지를 수평 행과 스트립으로 분할하세요." },
      { slug: "/split-for-instagram", title: "Instagram 분할", description: "넓은 이미지를 Instagram 캐러셀 게시물용 타일로 분할하세요." },
      { slug: "/grid", title: "그리드 분할", description: "이미지에서 3×3 또는 커스텀 그리드 타일을 만드세요." },
    ],
  },

  "split-into-equal-parts": {
    slug: "split-into-equal-parts",
    category: "direction",
    seo: {
      title: "이미지 균등 분할 — 무료 온라인 그리드 분할기 | ImgSplit",
      description: "이미지를 2, 3, 4등분 이상으로 균등하게 나누세요. 스냅 정렬로 균일한 간격의 분할을 지원하는 무료 온라인 도구. 업로드 불필요.",
      ogTitle: "이미지 균등 분할 — 무료 도구",
      ogDescription: "스냅 정렬 분할선으로 이미지를 완벽하게 균등한 세그먼트로 나누세요.",
    },
    hero: {
      overline: "균등 분할기",
      headlinePart1: "이미지를",
      headlineAccent: "균등하게 분할",
      headlinePart2: "— 정확하고 균일하게",
      description: "이미지를 2, 3, 4등분 이상의 완벽하게 동일한 세그먼트로 나누세요. 스냅 정렬로 균일한 간격과 픽셀 수준의 정밀도를 보장합니다.",
    },
    scenarios: [
      {
        icon: "Grid2X2",
        title: "퍼즐 및 콜라주 제작",
        description: "이미지를 균등한 타일로 분할하여 직소 퍼즐, 교육 자료 또는 콜라주용 조각을 만드세요.",
      },
      {
        icon: "Printer",
        title: "균일 인쇄 타일",
        description: "큰 이미지를 동일한 크기의 인쇄 타일로 나눠 표준 용지에 맞게 출력하고 이음새 없이 조합하세요.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "이미지 업로드", description: "균등하게 분할하려는 이미지를 선택하세요." },
      { stepNumber: 2, title: "균등 간격 선 추가", description: "가로 또는 세로 분할선을 추가하고, 스냅 정렬을 사용하여 이미지 전체에 균등하게 배분하세요." },
      { stepNumber: 3, title: "균등 세그먼트 다운로드", description: "모든 부분이 동일한지 확인한 후 각 세그먼트를 개별적으로 또는 ZIP으로 다운로드하세요." },
    ],
    faqEntries: [
      { question: "모든 부분이 완벽하게 동일하도록 하려면 어떻게 하나요?", answer: "스냅 정렬 기능을 사용하세요 — 분할선이 자동으로 균등 간격 위치에 스냅됩니다. 3등분의 경우, 2개의 선을 배치하면 1/3과 2/3 지점에 자동 정렬됩니다." },
      { question: "동일한 크기의 사각형 그리드를 만들 수 있나요?", answer: "네. 균등한 수평선과 수직선을 함께 추가하면 동일한 크기의 사각형 그리드가 생성됩니다 — 타일 기반 작업에 완벽합니다." },
      { question: "이미지 크기가 정확히 나누어지지 않으면 어떻게 되나요?", answer: "마지막 세그먼트가 1픽셀 정도 차이날 수 있습니다. 도구가 크기 차이를 최소화하도록 픽셀을 최대한 균등하게 배분합니다." },
    ],
    relatedTools: [
      { slug: "/split-in-half", title: "반으로 자르기", description: "가장 단순한 균등 분할 — 이미지를 정확히 두 반쪽으로 나누세요." },
      { slug: "/split-for-print", title: "인쇄용 분할", description: "큰 이미지를 표준 용지 크기에 맞는 타일로 분할하세요." },
      { slug: "/no-photoshop-slicer", title: "Photoshop 없이 자르기", description: "Photoshop의 슬라이스 도구를 대체하는 무료 온라인 도구." },
      { slug: "/grid", title: "그리드 분할", description: "프리셋 그리드 레이아웃: 3×3, 1×3, 2×2." },
    ],
  },

  "split-long-screenshot": {
    slug: "split-long-screenshot",
    category: "use-case",
    seo: {
      title: "긴 스크린샷 페이지 분할 — 무료 온라인 도구 | ImgSplit",
      description: "긴 스크린샷을 페이지 크기의 세그먼트로 분할하여 쉽게 공유하고 읽을 수 있습니다. 무료 브라우저 기반 도구 — 업로드 없이 모든 긴 이미지에 작동합니다.",
      ogTitle: "긴 스크린샷 분할 — 무료 페이지 분할기",
      ogDescription: "긴 스크린샷을 읽기 좋은 페이지 크기로 분할하세요. 업로드 불필요.",
    },
    hero: {
      overline: "긴 이미지 분할",
      headlinePart1: "긴 스크린샷을",
      headlineAccent: "페이지별로",
      headlinePart2: "분할",
      description: "긴 스크롤 스크린샷을 페이지 크기의 세그먼트로 분할하여 쉽게 공유, 읽기, 보관하세요. 모든 길이의 이미지를 지원합니다.",
    },
    scenarios: [
      {
        icon: "MessageSquare",
        title: "채팅 기록 정리",
        description: "메신저 앱의 전체 채팅 스크린샷을 화면 크기의 개별 이미지로 분할하여 체계적으로 저장하고 선택적으로 공유하세요.",
      },
      {
        icon: "FileSearch",
        title: "웹 페이지 문서화",
        description: "긴 웹페이지 캡처를 보기 편한 섹션으로 나눠 버그 리포트, 디자인 리뷰 또는 규정 준수 문서에 활용하세요.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "긴 스크린샷 업로드", description: "긴 스크롤 스크린샷을 업로드하세요 — 도구가 모든 높이의 이미지를 처리합니다." },
      { stepNumber: 2, title: "수평 구분선 배치", description: "페이지 나눔이 필요한 위치에 수평 분할선을 추가하세요. 스냅 정렬로 균일한 간격을 설정할 수 있습니다." },
      { stepNumber: 3, title: "페이지 세그먼트 다운로드", description: "각 세그먼트를 미리보기한 후 모든 페이지를 ZIP으로 다운로드하여 편리하게 공유하세요." },
    ],
    faqEntries: [
      { question: "긴 스크린샷의 최대 높이 제한이 있나요?", answer: "파일 크기 최대 20MB까지 처리할 수 있습니다. 매우 긴 이미지(10,000px 이상)는 처리 속도가 약간 느릴 수 있지만 완전히 지원됩니다." },
      { question: "스크린샷을 동일한 페이지 길이로 분할할 수 있나요?", answer: "네. 여러 수평선을 추가하고 스냅 정렬로 균일하게 배치하면 동일한 페이지 높이의 세그먼트를 만들 수 있습니다." },
      { question: "분할 후 스크린샷의 텍스트가 선명하게 유지되나요?", answer: "물론입니다. 원본 해상도로 잘라내며 리샘플링을 하지 않으므로 텍스트가 선명하고 읽기 좋게 유지됩니다." },
    ],
    relatedTools: [
      { slug: "/split-horizontally", title: "가로 분할", description: "수평선을 추가하여 이미지를 행으로 나누세요." },
      { slug: "/split-for-instagram", title: "Instagram 분할", description: "이미지를 멀티 슬라이드 캐러셀 게시물로 분할하세요." },
      { slug: "/split-for-wechat", title: "소셜 미디어 그리드 분할", description: "소셜 미디어 그리드 게시물용 이미지를 준비하세요." },
      { slug: "/", title: "이미지 분할 도구", description: "드래그 앤 드롭 분할선을 지원하는 다기능 분할 도구." },
    ],
  },

  "split-for-instagram": {
    slug: "split-for-instagram",
    category: "use-case",
    seo: {
      title: "Instagram 캐러셀 및 그리드용 이미지 분할 — 무료 온라인 도구 | ImgSplit",
      description: "Instagram 캐러셀 게시물과 프로필 그리드 레이아웃에 맞게 이미지를 분할하세요. 1080×1080px 최적화. 무료, 브라우저 기반, 워터마크 없음.",
      ogTitle: "Instagram 이미지 분할 — 무료 캐러셀 & 그리드 도구",
      ogDescription: "이미지를 Instagram에 최적화된 타일로 분할하세요. 1080×1080px 게시물 최적화.",
    },
    hero: {
      overline: "Instagram 분할",
      headlinePart1: "이미지를",
      headlineAccent: "Instagram",
      headlinePart2: "캐러셀 & 그리드로",
      description: "이미지를 완벽한 크기의 타일로 분할하여 멋진 Instagram 캐러셀 슬라이드와 프로필 그리드 레이아웃을 만드세요. Instagram 기본 크기에 최적화되어 있습니다.",
    },
    platformInfo: "Instagram 권장 게시물 크기: 1080 × 1080 px (1:1 정사각형). 캐러셀은 최대 10장 슬라이드 지원.",
    scenarios: [
      {
        icon: "LayoutGrid",
        title: "프로필 그리드 꾸미기",
        description: "넓은 이미지 하나를 3, 6 또는 9개의 타일로 분할하여 Instagram 프로필 그리드에서 자연스럽게 이어지는 파노라마 효과를 연출하세요.",
      },
      {
        icon: "GalleryHorizontal",
        title: "캐러셀 게시물 슬라이드",
        description: "파노라마 사진이나 인포그래픽을 스와이프 가능한 캐러셀 슬라이드로 분할하여 여러 프레임에 걸친 시각적 스토리를 전달하세요.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "이미지 업로드", description: "Instagram용으로 분할할 이미지 또는 파노라마를 업로드하세요." },
      { stepNumber: 2, title: "그리드 설정", description: "캐러셀 슬라이드를 위한 수직선을 추가하거나 프로필 레이아웃용 그리드를 만드세요. 스냅 정렬로 균등 간격을 맞추세요." },
      { stepNumber: 3, title: "Instagram 최적화 타일 다운로드", description: "모든 타일을 ZIP으로 다운로드하세요. 순서대로 Instagram에 업로드하면 완벽하게 연결되는 결과를 얻을 수 있습니다." },
    ],
    faqEntries: [
      { question: "Instagram 타일의 권장 크기는 얼마인가요?", answer: "Instagram은 1080×1080px(정사각형)으로 게시물을 표시합니다. 캐러셀 게시물의 각 슬라이드 너비는 1080px이어야 합니다. 이 도구로 원하는 위치에서 분할할 수 있습니다." },
      { question: "Instagram 캐러셀에 최대 몇 장의 슬라이드를 넣을 수 있나요?", answer: "Instagram은 캐러셀 게시물당 최대 10장의 슬라이드를 허용합니다. 이미지를 2~10개의 세로 세그먼트로 분할하여 스와이프 가능한 파노라마를 만드세요." },
      { question: "타일의 게시 순서가 올바른가요?", answer: "네. 타일은 왼쪽에서 오른쪽(세로 분할) 또는 위에서 아래(가로 분할) 순으로 번호가 매겨져 Instagram의 업로드 순서와 일치합니다." },
    ],
    relatedTools: [
      { slug: "/split-into-equal-parts", title: "균등 분할", description: "모든 플랫폼에 맞게 이미지를 완벽한 균등 세그먼트로 분할하세요." },
      { slug: "/split-long-screenshot", title: "긴 스크린샷 분할", description: "긴 이미지를 공유하기 좋은 페이지 크기로 분할하세요." },
      { slug: "/split-for-wechat", title: "소셜 미디어 그리드 분할", description: "소셜 미디어 그리드 게시물용 이미지를 분할하세요." },
      { slug: "/grid", title: "그리드 분할", description: "소셜 미디어에 최적화된 빠른 3×3 그리드 분할." },
    ],
  },

  "split-for-wechat": {
    slug: "split-for-wechat",
    category: "use-case",
    seo: {
      title: "소셜 미디어 그리드 이미지 분할 — 무료 온라인 도구 | ImgSplit",
      description: "무료 온라인 이미지 분할 도구로 사진을 그리드 또는 커스텀 세그먼트로 잘라보세요. 카카오스토리, Instagram 등 소셜 미디어에 최적화. 브라우저 기반, 업로드 불필요.",
      ogTitle: "소셜 미디어 그리드 분할 — 무료 온라인 도구",
      ogDescription: "이미지를 그리드 또는 커스텀 세그먼트로 분할하세요. 무료, 브라우저 기반.",
    },
    hero: {
      overline: "소셜 미디어 그리드",
      headlinePart1: "이미지를",
      headlineAccent: "그리드로 분할",
      headlinePart2: "— 소셜 미디어 게시용",
      description: "소셜 미디어 게시물을 위해 이미지를 그리드 타일로 분할하세요. 드래그 분할선으로 커스텀 그리드를 만들거나 균등 간격으로 균일한 타일을 생성하세요.",
    },
    scenarios: [
      {
        icon: "Share2",
        title: "소셜 미디어 그리드 게시물",
        description: "하나의 이미지를 여러 타일로 분할하여 프로필에서 볼 때 일체감 있는 시각적 효과를 만드는 눈길 끄는 그리드 게시물을 제작하세요.",
      },
      {
        icon: "Maximize2",
        title: "대형 이미지 분할",
        description: "업로드 크기나 해상도 제한이 있는 플랫폼을 위해 대용량 이미지를 관리 가능한 그리드 타일로 분할하세요.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "이미지 업로드", description: "그리드 타일로 분할할 사진을 업로드하세요." },
      { stepNumber: 2, title: "그리드 만들기", description: "가로선과 세로선을 추가하여 그리드 레이아웃을 정의하세요. 스냅 정렬이 균등 간격을 잡아줍니다." },
      { stepNumber: 3, title: "그리드 타일 다운로드", description: "모든 그리드 조각을 ZIP 파일로 다운로드하여 소셜 플랫폼에 순서대로 게시하세요." },
    ],
    faqEntries: [
      { question: "어떤 소셜 미디어에서 그리드 게시물을 만들 수 있나요?", answer: "Instagram, 카카오스토리, 네이버 블로그 등 다양한 소셜 미디어 플랫폼에서 그리드 게시물을 만들 수 있습니다. 3×3 그리드가 가장 인기 있는 형식입니다." },
      { question: "그리드 타일의 게시 순서가 올바른가요?", answer: "네. 이미지는 왼쪽에서 오른쪽, 위에서 아래 순서로 번호가 매겨져 올바른 순서로 게시할 수 있습니다." },
      { question: "3×3 외에 다른 레이아웃도 지원하나요?", answer: "물론입니다. 클래식 3×3 그리드 외에도 1×3 세로 연작, 2×2 네 칸 등 원하는 커스텀 레이아웃을 자유롭게 만들 수 있습니다." },
      { question: "분할 후 이미지 품질이 저하되나요?", answer: "아닙니다. 원본 해상도로 잘라내며 압축 처리를 하지 않으므로 원본과 동일한 화질을 유지합니다." },
    ],
    relatedTools: [
      { slug: "/split-for-instagram", title: "Instagram 분할", description: "Instagram 캐러셀 게시물과 프로필 그리드용으로 이미지를 분할하세요." },
      { slug: "/split-long-screenshot", title: "긴 스크린샷 분할", description: "긴 스크린샷을 읽기 좋은 세그먼트로 분할하세요." },
      { slug: "/", title: "이미지 분할 도구", description: "커스텀 분할선을 지원하는 다기능 이미지 분할 도구." },
      { slug: "/grid", title: "그리드 분할", description: "빠른 프리셋 그리드 분할: 3×3, 1×3, 2×2." },
    ],
  },

  "split-for-print": {
    slug: "split-for-print",
    category: "use-case",
    seo: {
      title: "대형 이미지 인쇄용 분할 — 무료 타일 인쇄 도구 | ImgSplit",
      description: "큰 이미지를 표준 용지 크기에 맞는 인쇄 가능한 타일로 분할하세요. 포스터, 배너, 대형 아트를 인쇄하고 조립하세요. 무료 브라우저 도구.",
      ogTitle: "인쇄용 이미지 분할 — 무료 타일 도구",
      ogDescription: "큰 이미지를 페이지 크기 타일로 나눠 인쇄 후 조립하세요.",
    },
    hero: {
      overline: "인쇄용 분할",
      headlinePart1: "이미지를",
      headlineAccent: "인쇄용으로",
      headlinePart2: "분할 & 조립",
      description: "큰 이미지를 표준 용지 크기의 타일로 나눠 인쇄한 후 포스터, 배너 또는 벽면 아트로 조립하세요.",
    },
    scenarios: [
      {
        icon: "Image",
        title: "DIY 포스터 인쇄",
        description: "고해상도 이미지를 A4 타일로 분할하여 가정용 프린터로 출력하고 테이프로 이어 붙여 대형 포스터를 완성하세요.",
      },
      {
        icon: "Ruler",
        title: "건축 도면 및 청사진",
        description: "대형 기술 도면이나 평면도를 인쇄 가능한 섹션으로 분할하여 각 페이지에 관리 가능한 영역을 표시하세요.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "대형 이미지 업로드", description: "타일 인쇄할 고해상도 이미지, 포스터 또는 도면을 업로드하세요." },
      { stepNumber: 2, title: "타일 경계 설정", description: "균등 간격의 분할선을 추가하여 용지 크기에 맞는 타일을 만드세요. 스냅 정렬로 균일한 간격을 맞추세요." },
      { stepNumber: 3, title: "인쇄 & 조립", description: "모든 타일을 다운로드하고, 각각 별도의 용지에 인쇄한 후, 배열하여 전체 이미지를 재구성하세요." },
    ],
    faqEntries: [
      { question: "타일에 적합한 용지 크기는 무엇인가요?", answer: "가정용 프린터의 경우 A4(210×297mm)가 표준입니다. 이미지 비율과 원하는 최종 크기에 따라 필요한 타일 수를 계산하세요." },
      { question: "조립을 위한 겹침 여백이 추가되나요?", answer: "도구는 정확한 픽셀 경계에서 분할합니다. 겹침 여백이 필요하면 타일 수를 약간 늘려 인접 조각들이 정렬을 위한 얇은 공유 영역을 갖도록 하세요." },
      { question: "초고해상도 이미지(예: 8000×6000)도 분할할 수 있나요?", answer: "네. 최대 20MB의 대용량 이미지를 처리할 수 있습니다. 초고해상도 파일의 경우 파일 크기를 줄이기 위해 WebP 형식을 사용하는 것을 권장합니다." },
    ],
    relatedTools: [
      { slug: "/split-into-equal-parts", title: "균등 분할", description: "이미지를 균일한 타일로 완벽하게 균등 분할하세요." },
      { slug: "/split-horizontally", title: "가로 분할", description: "이미지를 행으로 분할하여 스트립 형태로 인쇄하세요." },
      { slug: "/no-photoshop-slicer", title: "Photoshop 없이 자르기", description: "Photoshop의 슬라이스 및 내보내기 워크플로를 대체하는 무료 온라인 도구." },
      { slug: "/", title: "이미지 분할 도구", description: "커스텀 분할선을 지원하는 다기능 이미지 분할 도구." },
    ],
  },

  "no-photoshop-slicer": {
    slug: "no-photoshop-slicer",
    category: "use-case",
    seo: {
      title: "무료 온라인 이미지 슬라이서 — Photoshop 없이 자르기 | ImgSplit",
      description: "Photoshop 슬라이스 도구의 무료 대안. 소프트웨어 설치 없이 이미지를 영역별로 분할하세요. 브라우저 기반, 개인정보 보호, 즉시 처리.",
      ogTitle: "Photoshop 없이 이미지 자르기 — 무료 온라인 도구",
      ogDescription: "Photoshop 없이 브라우저에서 즉시 이미지를 영역별로 분할하세요.",
    },
    hero: {
      overline: "Photoshop 없이 자르기",
      headlinePart1: "이미지 슬라이서",
      headlineAccent: "Photoshop 불필요",
      headlinePart2: "",
      description: "비싼 소프트웨어 구독은 그만. 드래그 앤 드롭 분할선으로 이미지를 원하는 레이아웃으로 분할하세요 — 완전 무료, 완전 브라우저 기반.",
    },
    scenarios: [
      {
        icon: "DollarSign",
        title: "구독료 절약",
        description: "월 $22의 Creative Cloud 구독 없이도 Photoshop 수준의 이미지 슬라이싱을 이용하세요 — 무료로 누구나 사용 가능합니다.",
      },
      {
        icon: "GraduationCap",
        title: "초보자 친화적 워크플로",
        description: "레이어도, 도구 모음도, 학습 곡선도 없습니다. 자르고 싶은 곳에 선을 드래그하고 결과물을 다운로드하세요 — 누구나 몇 초 만에 완료할 수 있습니다.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "이미지 업로드", description: "드래그 앤 드롭하거나 클릭하여 업로드하세요. 계정 등록도, 소프트웨어 설치도 필요 없습니다." },
      { stepNumber: 2, title: "분할선 드래그", description: "가로선과 세로선을 추가하여 슬라이스 영역을 정의하세요. 스냅 정렬이 정밀도를 보장합니다." },
      { stepNumber: 3, title: "슬라이스 내보내기", description: "분할된 모든 영역을 ZIP으로 다운로드하세요 — 웹, 소셜 미디어 또는 기타 용도로 바로 사용 가능합니다." },
    ],
    faqEntries: [
      { question: "정말로 Photoshop의 슬라이스 도구만큼 정밀한가요?", answer: "네. 스냅 정렬을 통해 정확한 픽셀 경계에서 분할하므로 복잡한 조작 없이 동일한 픽셀 단위 정밀도를 얻을 수 있습니다." },
      { question: "HTML 이메일 템플릿용 이미지를 분할할 수 있나요?", answer: "물론입니다. 이메일 디자인을 섹션별로 분할하고 각 영역을 내보내어 HTML 템플릿에서 참조하면 픽셀 단위로 정밀한 이메일 레이아웃을 만들 수 있습니다." },
      { question: "계정을 만들어야 하나요?", answer: "아닙니다. 이 도구는 완전 무료이며 회원가입이 필요 없습니다. 페이지를 열고, 업로드하고, 분할하고, 다운로드하면 됩니다." },
    ],
    relatedTools: [
      { slug: "/split-in-half", title: "반으로 자르기", description: "가장 간단한 분할 — 이미지를 두 개의 동일한 부분으로 나누세요." },
      { slug: "/split-for-print", title: "인쇄용 분할", description: "큰 이미지를 인쇄 가능한 페이지 크기 타일로 분할하세요." },
      { slug: "/split-for-instagram", title: "Instagram 분할", description: "Instagram 캐러셀 및 그리드 게시물용으로 이미지를 분할하세요." },
      { slug: "/", title: "이미지 분할 도구", description: "드래그 앤 드롭 방식의 다기능 이미지 분할 도구." },
    ],
  },

  "photo-splitter": {
    slug: "photo-splitter",
    category: "use-case",
    seo: {
      title: "온라인 사진 분할기 — 무료 이미지 분할 도구 | ImgSplit",
      description: "무료 온라인 사진 분할 도구 — 드래그 앤 드롭으로 사진을 정밀하게 여러 조각으로 분할. 서버 업로드 불필요, 100% 브라우저 처리.",
      ogTitle: "사진 분할기 — 무료 온라인 도구",
      ogDescription: "사진을 여러 조각으로 즉시 분할. 무료, 안전, 브라우저 기반.",
    },
    hero: {
      overline: "사진 분할 도구",
      headlinePart1: "사진",
      headlineAccent: "분할기",
      headlinePart2: "— 무료 & 즉시",
      description: "모든 사진을 픽셀 단위 정밀도로 여러 조각으로 분할. 드래그 앤 드롭 분할선, 스냅 정렬, 즉시 다운로드 — 모두 브라우저에서 처리.",
    },
    scenarios: [
      { icon: "Camera", title: "사진 후처리", description: "단체 사진, 파노라마, 합성 이미지를 개별 섹션으로 분할하여 편집, 공유, 인쇄에 활용." },
      { icon: "Smartphone", title: "모바일 사진 관리", description: "휴대폰 사진을 분할하여 얼굴 추출, 세부 사항 크롭, 전경과 배경 분리." },
      { icon: "ShoppingBag", title: "상품 사진 제작", description: "상품 사진을 세부 샷으로 분할하여 이커머스 상세 페이지에서 다양한 각도와 클로즈업 표시." },
    ],
    howToSteps: [
      { stepNumber: 1, title: "사진 업로드", description: "드래그 앤 드롭 또는 클릭으로 업로드 — PNG, JPG, WebP 지원, 최대 20MB." },
      { stepNumber: 2, title: "분할선 배치", description: "수평 또는 수직 분할선을 추가하고 원하는 위치로 드래그." },
      { stepNumber: 3, title: "미리보기 & 조정", description: "각 분할 영역을 실시간으로 확인. 스냅 정렬로 분할선 미세 조정." },
      { stepNumber: 4, title: "다운로드", description: "모든 조각을 ZIP으로 다운로드하거나 개별 저장." },
    ],
    faqEntries: [
      { question: "지원되는 사진 형식은?", answer: "PNG, JPG/JPEG, WebP 형식 지원. 파일당 최대 20MB." },
      { question: "분할하면 화질이 떨어지나요?", answer: "아닙니다. 각 조각은 원본 해상도와 픽셀 데이터를 유지합니다. 압축이나 리샘플링 없이 화질 손실 제로." },
      { question: "모바일에서도 사용할 수 있나요?", answer: "네. 모바일 브라우저에서도 원활하게 작동하며, 스마트폰에서 직접 사진을 분할할 수 있습니다." },
    ],
    relatedTools: [
      { slug: "/split-in-half", title: "반으로 분할", description: "가장 간단한 분할 — 이미지를 2등분." },
      { slug: "/split-into-equal-parts", title: "균등 분할", description: "이미지를 완전히 동일한 크기로 분할." },
      { slug: "/split-for-instagram", title: "인스타그램 분할", description: "인스타그램 캐러셀과 그리드 포스트용 사진 분할." },
      { slug: "/", title: "이미지 분할기", description: "드래그 앤 드롭 분할선으로 자유롭게 분할." },
    ],
  },

  "image-cutter": {
    slug: "image-cutter",
    category: "use-case",
    seo: {
      title: "온라인 이미지 커터 — 무료 정밀 절단 도구 | ImgSplit",
      description: "무료 온라인 이미지 커터 — 드래그 앤 드롭으로 이미지를 정밀하게 절단. 업로드 불필요, 100% 브라우저 처리.",
      ogTitle: "온라인 이미지 커터 — 무료 도구",
      ogDescription: "이미지를 드래그 앤 드롭으로 정밀하게 절단. 무료, 브라우저 기반.",
    },
    hero: {
      overline: "이미지 절단 도구",
      headlinePart1: "이미지",
      headlineAccent: "커터",
      headlinePart2: "— 정밀하게 절단",
      description: "드래그 앤 드롭 절단선으로 모든 이미지를 정밀하게 분할. 픽셀 단위 정밀도, 스냅 정렬, 즉시 다운로드.",
    },
    scenarios: [
      { icon: "Scissors", title: "웹 디자인 에셋 절단", description: "디자인 목업을 헤더, 버튼, 아이콘 등 개별 에셋으로 절단하여 HTML/CSS 구현에 활용." },
      { icon: "Mail", title: "이메일 템플릿 슬라이싱", description: "이메일 디자인을 최적화된 이미지 섹션으로 분할하여 모든 이메일 클라이언트에서 완벽하게 렌더링." },
      { icon: "FileImage", title: "문서 영역 추출", description: "스캔 문서나 스크린샷에서 특정 영역을 정확하게 추출." },
    ],
    howToSteps: [
      { stepNumber: 1, title: "이미지 업로드", description: "PNG, JPG, WebP 이미지를 드래그 앤 드롭 또는 클릭으로 업로드." },
      { stepNumber: 2, title: "절단선 배치", description: "수평 및 수직 절단선을 추가하고 정확한 절단 위치를 정의." },
      { stepNumber: 3, title: "절단 결과 다운로드", description: "각 조각을 미리 보고 ZIP으로 일괄 다운로드 또는 개별 저장." },
    ],
    faqEntries: [
      { question: "절단과 크롭의 차이는?", answer: "크롭은 이미지 가장자리를 제거하여 하나의 영역만 남기는 것. 절단은 이미지 전체를 여러 조각으로 나누는 것으로 — 모든 픽셀이 보존됩니다." },
      { question: "절단선의 정밀도는?", answer: "절단선은 픽셀 경계에 스냅되며, 단일 픽셀 정밀도로 배치할 수 있습니다." },
      { question: "이미지 크기 제한이 있나요?", answer: "20MB까지의 파일을 지원합니다. 픽셀 크기 제한은 없습니다." },
    ],
    relatedTools: [
      { slug: "/no-photoshop-slicer", title: "포토샵 없이 슬라이스", description: "포토샵 슬라이스 도구의 무료 대안." },
      { slug: "/split-horizontally", title: "수평 분할", description: "이미지를 수평 행과 스트립으로 분할." },
      { slug: "/split-vertically", title: "수직 분할", description: "이미지를 수직 열로 분할." },
      { slug: "/", title: "이미지 분할기", description: "드래그 앤 드롭 분할선으로 자유롭게 절단." },
    ],
  },

  "grid-maker": {
    slug: "grid-maker",
    category: "use-case",
    seo: {
      title: "이미지 그리드 메이커 — 무료 온라인 그리드 생성 | ImgSplit",
      description: "무료 온라인 이미지 그리드 메이커 — 2x2, 3x3, 4x4 또는 커스텀 그리드 생성. SNS, 무드보드에 최적. 브라우저 기반.",
      ogTitle: "이미지 그리드 메이커 — 무료 온라인 도구",
      ogDescription: "SNS, 무드보드 등에 최적인 이미지 그리드 생성. 무료, 브라우저 기반.",
    },
    hero: {
      overline: "그리드 생성 도구",
      headlinePart1: "이미지",
      headlineAccent: "그리드 메이커",
      headlinePart2: "— 자유로운 레이아웃",
      description: "2x2, 3x3, 4x4 또는 커스텀 레이아웃으로 완벽한 이미지 그리드 생성. SNS 프로필, 무드보드, 비주얼 스토리텔링에 최적.",
    },
    scenarios: [
      { icon: "LayoutGrid", title: "SNS 그리드 프로필", description: "SNS 프로필을 통일감 있는 비주얼 갤러리로 변환하는 멋진 그리드 레이아웃을 제작." },
      { icon: "Palette", title: "무드보드 & 영감 보드", description: "참조 이미지를 체계적인 그리드 타일로 분할하여 디자인 무드보드와 컬러 팔레트 탐색에 활용." },
      { icon: "Presentation", title: "프레젠테이션 비주얼", description: "인포그래픽이나 데이터 시각화를 깔끔한 그리드 레이아웃으로 분할." },
    ],
    howToSteps: [
      { stepNumber: 1, title: "이미지 업로드", description: "그리드로 분할할 이미지를 업로드. PNG, JPG, WebP 지원." },
      { stepNumber: 2, title: "그리드 정의", description: "균등한 수평·수직 분할선을 추가하여 2x2, 3x3 등 원하는 레이아웃 생성." },
      { stepNumber: 3, title: "그리드 타일 다운로드", description: "모든 타일을 미리 보고 ZIP으로 다운로드. 타일은 순서대로 번호 매김." },
    ],
    faqEntries: [
      { question: "어떤 크기의 그리드를 만들 수 있나요?", answer: "2x2부터 10x10 이상까지 자유롭게 생성 가능. 각 방향 최대 20개의 분할선." },
      { question: "타일 크기가 완전히 동일한가요?", answer: "스냅 정렬 기능으로 분할선을 균등한 간격에 자동 배치하여 완전히 동일한 타일을 생성합니다." },
      { question: "인스타그램에 가장 좋은 그리드는?", answer: "1x3 그리드는 캐러셀 포스트에 최적. 3x3 그리드는 프로필 페이지에서 놀라운 모자이크 효과를 연출." },
    ],
    relatedTools: [
      { slug: "/grid", title: "그리드 분할", description: "프리셋 그리드: 3×3, 1×3, 2×2 — SNS에 최적화." },
      { slug: "/split-for-instagram", title: "인스타그램 분할", description: "인스타그램 캐러셀 및 그리드 포스트 전용." },
      { slug: "/split-into-equal-parts", title: "균등 분할", description: "이미지를 완전히 동일한 크기로 분할." },
      { slug: "/split-for-wechat", title: "SNS 그리드", description: "SNS 프로필용 그리드 타일 분할." },
    ],
  },

}

export default data
