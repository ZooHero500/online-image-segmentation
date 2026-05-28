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

  "compress-image": {
    slug: "compress-image",
    category: "use-case",
    seo: {
      title: "온라인 이미지 압축 — 무료 & 개인정보 보호 | ImgSplit",
      description: "무료 온라인 이미지 압축 — 시각적 품질을 유지하면서 파일 크기를 줄이세요. 브라우저 기반, 서버 업로드 불필요, JPEG, PNG, WebP 지원.",
      ogTitle: "온라인 이미지 압축 — 무료 & 개인정보 보호",
      ogDescription: "브라우저에서 이미지 파일 크기를 즉시 줄이세요. 무료, 안전, 업로드 불필요.",
    },
    hero: {
      overline: "이미지 압축 도구",
      headlinePart1: "이미지",
      headlineAccent: "압축",
      headlinePart2: "— 즉시 완료",
      description: "눈에 띄는 품질 저하 없이 이미지 파일 크기를 줄이세요. JPEG, PNG, WebP 지원 — 모든 처리가 브라우저에서 이루어지며 데이터는 기기를 떠나지 않습니다.",
    },
    scenarios: [
      {
        icon: "Globe",
        title: "웹 최적화",
        description: "웹사이트에 업로드하기 전에 이미지를 압축하세요 — 시각적 품질을 희생하지 않으면서 페이지 로딩 속도 향상, Core Web Vitals 개선, SEO 순위 향상을 달성할 수 있습니다.",
      },
      {
        icon: "Mail",
        title: "이메일 첨부파일",
        description: "이미지 첨부파일을 압축하여 이메일 크기 제한에 맞추세요. 사진의 좋은 화질을 유지하면서 10MB 또는 25MB 첨부 제한 내로 유지합니다.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "이미지 업로드", description: "압축할 JPEG, PNG 또는 WebP 이미지를 드래그 앤 드롭하거나 클릭하여 업로드하세요." },
      { stepNumber: 2, title: "품질 조정", description: "품질 슬라이더로 파일 크기와 시각적 품질의 균형을 조정하세요. 다운로드 전에 실시간으로 결과를 미리 볼 수 있습니다." },
      { stepNumber: 3, title: "압축 파일 다운로드", description: "최적화된 이미지를 다운로드하세요 — 더 작은 파일 크기, 동일한 멋진 화질. 압축 전후 크기를 즉시 비교해 보세요." },
    ],
    faqEntries: [
      { question: "이미지를 압축하면 품질이 떨어지나요?", answer: "압축은 중복 데이터를 제거하여 파일 크기를 줄입니다. 70% 이상의 품질 설정에서는 시각적 차이가 육안으로 거의 인지할 수 없습니다." },
      { question: "어떤 이미지 형식을 압축할 수 있나요?", answer: "JPEG, PNG, WebP 이미지를 압축할 수 있습니다. 최대한의 압축을 위해서는 크기 대비 품질 비율이 가장 우수한 WebP 형식으로의 변환을 권장합니다." },
      { question: "업로드 파일 크기 제한이 있나요?", answer: "최대 20MB의 이미지를 업로드할 수 있습니다. 모든 처리가 브라우저에서 이루어지므로 큰 파일은 처리 시간이 약간 더 걸릴 수 있습니다." },
    ],
    relatedTools: [
      { slug: "/compress-jpeg", title: "JPEG 압축", description: "품질 제어가 가능한 전문 JPEG 압축." },
      { slug: "/png-to-webp", title: "PNG를 WebP로", description: "PNG를 WebP로 변환하여 최대한의 압축 달성." },
      { slug: "/resize", title: "이미지 크기 조정", description: "이미지를 정확한 크기 또는 백분율로 조정." },
      { slug: "/", title: "이미지 분할 도구", description: "드래그 앤 드롭 분할선으로 이미지를 여러 조각으로 분할." },
    ],
  },

  "compress-jpeg": {
    slug: "compress-jpeg",
    category: "use-case",
    seo: {
      title: "온라인 JPEG 압축 — JPG 파일 크기 줄이기 | ImgSplit",
      description: "무료 온라인 JPEG 및 JPG 이미지 압축. 조정 가능한 품질 설정으로 파일 크기를 줄이세요. 브라우저 기반, 개인정보 보호, 서버 업로드 불필요.",
      ogTitle: "온라인 JPEG 압축 — JPG 파일 크기 줄이기",
      ogDescription: "조정 가능한 품질로 JPEG 파일 크기를 줄이세요. 무료, 안전, 브라우저 기반.",
    },
    hero: {
      overline: "JPEG 압축",
      headlinePart1: "JPEG",
      headlineAccent: "압축",
      headlinePart2: "— 크기 줄이기",
      description: "세밀한 품질 제어로 JPEG 및 JPG 파일 크기를 줄이세요. 사진작가, 블로거, 웹 개발자에게 최적 — 눈에 보이는 품질 저하 없이 더 작은 파일을 얻으세요.",
    },
    scenarios: [
      {
        icon: "Camera",
        title: "사진 워크플로",
        description: "카메라로 촬영한 고해상도 JPEG 사진을 웹 갤러리, 고객 시안, 소셜 미디어용으로 압축 — 세부 사항을 유지하면서 10MB 파일을 1MB 이하로 줄이세요.",
      },
      {
        icon: "Globe",
        title: "블로그 이미지",
        description: "블로그 게시물과 기사의 JPEG 이미지를 최적화하세요. 빠른 로딩은 독자 참여도 향상과 검색 엔진 순위 개선으로 이어집니다.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "JPEG 업로드", description: "압축할 JPEG/JPG 파일을 드래그 앤 드롭하거나 선택하세요." },
      { stepNumber: 2, title: "품질 수준 설정", description: "품질 슬라이더를 조정하세요 — 낮은 값일수록 파일이 작아집니다. 출력을 미리 보고 크기와 품질 사이의 최적점을 찾으세요." },
      { stepNumber: 3, title: "압축된 JPEG 다운로드", description: "압축된 JPEG를 저장하세요. 도구가 절약된 파일 크기를 정확히 보여줍니다." },
    ],
    faqEntries: [
      { question: "JPEG 압축에 적합한 품질 설정은?", answer: "웹 용도에는 75-85% 품질이 최적의 균형을 제공합니다 — 일반적으로 60-80%의 파일 크기 감소에 눈에 띄는 차이가 최소화됩니다. 인쇄용에는 90% 이상을 유지하세요." },
      { question: "JPEG를 여러 번 압축할 수 있나요?", answer: "가능하지만, 재압축할 때마다 약간의 아티팩트가 발생합니다. 최상의 결과를 위해서는 이미 압축된 JPEG를 다시 압축하기보다 항상 원본 파일에서 압축하세요." },
      { question: "JPEG와 JPG의 차이점은 무엇인가요?", answer: "차이가 없습니다 — JPG와 JPEG는 동일한 형식을 가리킵니다. 짧은 '.jpg' 확장자는 원래 확장자를 3글자로 제한했던 Windows에서 보편화되었습니다." },
    ],
    relatedTools: [
      { slug: "/compress-image", title: "이미지 압축", description: "모든 형식에 대응하는 범용 이미지 압축." },
      { slug: "/jpg-to-webp", title: "JPG를 WebP로", description: "JPEG를 WebP로 변환하여 더 작은 파일 크기 달성." },
      { slug: "/reduce-image-size", title: "이미지 크기 줄이기", description: "모든 이미지를 최소 파일 크기로 최적화." },
    ],
  },

  "compress-png": {
    slug: "compress-png",
    category: "use-case",
    seo: {
      title: "온라인 PNG 압축 — PNG 파일 크기 줄이기 | ImgSplit",
      description: "투명도를 유지하면서 PNG 이미지를 온라인으로 압축하세요. 무손실 또는 손실 압축으로 파일 크기를 줄이세요. 무료, 브라우저 기반, 서버 업로드 불필요.",
      ogTitle: "온라인 PNG 압축 — PNG 파일 크기 줄이기",
      ogDescription: "투명도를 유지하면서 PNG 파일 크기를 줄이세요. 무료, 안전, 브라우저 기반.",
    },
    hero: {
      overline: "PNG 압축",
      headlinePart1: "PNG",
      headlineAccent: "압축",
      headlinePart2: "— 투명도 유지",
      description: "투명도 지원을 완전히 보존하면서 PNG 파일 크기를 줄이세요. UI 스크린샷, 디자인 에셋, 알파 채널이 필요한 그래픽에 최적입니다.",
    },
    scenarios: [
      {
        icon: "Smartphone",
        title: "UI 스크린샷",
        description: "디자인 도구와 화면 캡처에서 가져온 PNG 스크린샷을 압축하세요. 문서, 버그 리포트, 디자인 리뷰에서의 로딩 속도를 높입니다.",
      },
      {
        icon: "Layers",
        title: "디자인 에셋",
        description: "PNG 디자인 에셋 — 아이콘, 로고, UI 요소 — 을 웹 및 앱 개발용으로 최적화하면서 선명한 엣지와 투명도를 유지하세요.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "PNG 업로드", description: "압축할 PNG 파일을 드래그 앤 드롭하거나 선택하세요. 투명도가 완전히 보존됩니다." },
      { stepNumber: 2, title: "PNG 최적화", description: "PNG 출력을 유지하세요. ImgSplit은 이미지를 무손실로 다시 인코딩하고, 다시 인코딩한 파일이 더 커지면 원본 파일을 유지합니다." },
      { stepNumber: 3, title: "최적화된 PNG 다운로드", description: "압축된 PNG를 저장하세요. 투명도, 색상 심도, 시각적 품질이 유지됩니다." },
    ],
    faqEntries: [
      { question: "압축하면 PNG의 투명도가 제거되나요?", answer: "아닙니다. 압축 과정에서 알파 채널이 완전히 보존됩니다. 투명한 배경은 그대로 유지됩니다." },
      { question: "왜 PNG 파일은 JPEG보다 큰가요?", answer: "PNG는 무손실 압축을 사용하여 모든 픽셀을 정확히 보존하고 투명도 데이터도 저장합니다. 투명도가 필요 없는 사진의 경우 JPEG나 WebP로 변환하면 훨씬 작은 파일을 얻을 수 있습니다." },
      { question: "압축 대신 WebP로 변환해야 하나요?", answer: "최대한의 크기 축소가 필요하고 플랫폼이 WebP를 지원한다면, WebP로 변환하면 투명도를 유지하면서 파일 크기를 50-80% 줄일 수 있습니다." },
    ],
    relatedTools: [
      { slug: "/png-to-webp", title: "PNG를 WebP로", description: "PNG를 WebP로 변환하여 투명도를 유지하면서 획기적으로 작은 파일로." },
      { slug: "/png-to-jpg", title: "PNG를 JPG로", description: "투명도가 필요 없을 때 PNG를 JPEG로 변환하여 더 작은 파일로." },
      { slug: "/compress-image", title: "이미지 압축", description: "모든 형식에 대응하는 범용 이미지 압축." },
    ],
  },

  "png-to-webp": {
    slug: "png-to-webp",
    category: "use-case",
    seo: {
      title: "PNG를 WebP로 변환 — 무료 & 빠름 | ImgSplit",
      description: "PNG 이미지를 WebP 형식으로 변환하여 획기적으로 작은 파일을 얻으세요. 투명도 보존. 무료 브라우저 기반 변환기, 서버 업로드 불필요.",
      ogTitle: "PNG를 WebP로 변환 — 무료 온라인 변환기",
      ogDescription: "PNG를 WebP로 변환하여 투명도를 유지하면서 파일 축소. 무료, 브라우저 기반.",
    },
    hero: {
      overline: "PNG를 WebP로 변환기",
      headlinePart1: "PNG를",
      headlineAccent: "WebP",
      headlinePart2: "로 변환 — 더 작은 파일",
      description: "PNG 이미지를 WebP 형식으로 변환하여 투명도를 유지하면서 최대 80% 파일 크기 감소를 달성하세요. 더 빠른 웹사이트와 앱을 위한 최신 이미지 형식입니다.",
    },
    scenarios: [
      {
        icon: "Zap",
        title: "웹사이트 성능",
        description: "사이트의 PNG 에셋을 WebP로 전환하세요 — 페이지 로딩이 빨라지고, 대역폭이 줄어들며, Core Web Vitals가 개선됩니다. 대부분의 브라우저가 WebP를 기본 지원합니다.",
      },
      {
        icon: "Smartphone",
        title: "앱 에셋",
        description: "앱 아이콘, UI 요소, 그래픽을 PNG에서 WebP로 변환하세요. 더 작은 에셋은 더 빠른 설치, 더 빠른 로딩, 더 적은 저장 공간 사용을 의미합니다.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "PNG 업로드", description: "WebP 형식으로 변환할 PNG 이미지를 드래그 앤 드롭하거나 선택하세요." },
      { stepNumber: 2, title: "출력 설정", description: "WebP 출력의 품질 설정을 조정하세요. 높은 품질은 더 큰 파일을 의미합니다 — 미리보기로 적절한 균형을 찾으세요." },
      { stepNumber: 3, title: "WebP 파일 다운로드", description: "변환된 WebP 이미지를 저장하세요. 파일 크기를 비교하여 획기적인 감소를 확인해 보세요." },
    ],
    faqEntries: [
      { question: "WebP는 PNG처럼 투명도를 지원하나요?", answer: "네. WebP는 알파 투명도를 완전히 지원하므로 대부분의 사용 사례에서 PNG의 우수한 대안이 됩니다 — 훨씬 작은 파일 크기로." },
      { question: "어떤 브라우저가 WebP를 지원하나요?", answer: "모든 주요 브라우저가 WebP를 지원합니다: Chrome, Firefox, Safari, Edge, Opera. Internet Explorer와 매우 오래된 브라우저 버전만 지원하지 않습니다." },
      { question: "WebP는 PNG보다 얼마나 작나요?", answer: "WebP 파일은 일반적으로 동등한 PNG 파일보다 50-80% 작습니다. 정확한 절약량은 이미지 내용에 따라 다르지만 감소 효과는 항상 극적입니다." },
    ],
    relatedTools: [
      { slug: "/png-to-jpg", title: "PNG를 JPG로", description: "투명도가 필요 없을 때 PNG를 JPEG로 변환." },
      { slug: "/jpg-to-webp", title: "JPG를 WebP로", description: "JPEG 이미지를 최신 WebP 형식으로 변환." },
      { slug: "/compress-png", title: "PNG 압축", description: "PNG 형식을 유지하면서 파일 크기를 축소." },
    ],
  },

  "png-to-jpg": {
    slug: "png-to-jpg",
    category: "use-case",
    seo: {
      title: "PNG를 JPG로 변환 — 무료 온라인 변환기 | ImgSplit",
      description: "무료 온라인으로 PNG 이미지를 JPG 형식으로 변환하세요. 투명도를 제거하고 파일 크기를 줄이세요. 브라우저 기반, 개인정보 보호, 서버 업로드 불필요.",
      ogTitle: "PNG를 JPG로 변환 — 무료 온라인 변환기",
      ogDescription: "PNG를 JPG로 변환하여 투명도를 제거하고 파일 크기를 줄이세요. 무료, 브라우저 기반.",
    },
    hero: {
      overline: "PNG를 JPG로 변환기",
      headlinePart1: "PNG를",
      headlineAccent: "JPG",
      headlinePart2: "로 변환 — 투명도 제거",
      description: "PNG 이미지를 JPG 형식으로 변환하여 더 작은 파일 크기와 범용 호환성을 얻으세요. 투명한 영역은 원하는 배경색으로 채워집니다.",
    },
    scenarios: [
      {
        icon: "Globe",
        title: "소셜 미디어 게시",
        description: "PNG 스크린샷과 그래픽을 JPG로 변환하여 소셜 미디어 플랫폼에 업로드하세요. PNG 업로드 시 과도한 압축을 피하고 깨끗한 JPG로 예측 가능한 품질을 확보하세요.",
      },
      {
        icon: "Mail",
        title: "문서 공유",
        description: "PNG 그래픽을 JPG로 변환하여 이메일 첨부, 프레젠테이션, 문서에 활용하세요. JPG 파일은 더 작고 모든 기기에서 볼 수 있습니다.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "PNG 업로드", description: "JPG 형식으로 변환할 PNG 파일을 드래그 앤 드롭하거나 선택하세요." },
      { stepNumber: 2, title: "배경색 및 품질 설정", description: "투명 영역의 배경색을 선택하고(기본값: 흰색) JPEG 품질 수준을 설정하세요." },
      { stepNumber: 3, title: "JPG 파일 다운로드", description: "변환된 JPG 이미지를 저장하세요. 투명 영역은 선택한 배경색으로 대체됩니다." },
    ],
    faqEntries: [
      { question: "PNG의 투명한 영역은 어떻게 되나요?", answer: "투명한 영역은 단색 배경색으로 채워집니다 — 기본값은 흰색입니다. 변환 전에 원하는 색상을 선택할 수 있습니다." },
      { question: "PNG를 JPG로 변환하면 이미지 품질이 변하나요?", answer: "JPEG는 손실 압축을 사용하므로 낮은 설정에서는 약간의 품질 차이가 있을 수 있습니다. 90% 이상의 품질에서는 차이가 거의 보이지 않습니다." },
      { question: "JPG로 변환하지 않고 PNG를 유지해야 할 때는?", answer: "투명도가 필요하거나, 텍스트/선 그래픽의 픽셀 단위 정밀도가 필요하거나, 무손실 품질이 필요할 때 PNG를 유지하세요. 사진이나 더 작은 파일 크기가 필요할 때 JPG로 변환하세요." },
    ],
    relatedTools: [
      { slug: "/png-to-webp", title: "PNG를 WebP로", description: "PNG를 WebP로 변환하여 최신 브라우저에서 더 작은 파일로." },
      { slug: "/compress-jpeg", title: "JPEG 압축", description: "변환 후 JPEG 파일 크기를 더 줄이세요." },
      { slug: "/jpg-to-png", title: "JPG를 PNG로", description: "무손실 품질이 필요할 때 JPG를 PNG로 되돌리세요." },
    ],
  },

  "jpg-to-png": {
    slug: "jpg-to-png",
    category: "use-case",
    seo: {
      title: "JPG를 PNG로 변환 — 무료 온라인 변환기 | ImgSplit",
      description: "무료 온라인으로 JPG 및 JPEG 이미지를 PNG 형식으로 변환하여 무손실 품질을 얻으세요. 브라우저 기반 변환기, 서버 업로드 불필요, 즉시 다운로드.",
      ogTitle: "JPG를 PNG로 변환 — 무료 온라인 변환기",
      ogDescription: "JPEG를 PNG로 변환하여 무손실 품질 확보. 무료, 안전, 브라우저 기반.",
    },
    hero: {
      overline: "JPG를 PNG로 변환기",
      headlinePart1: "JPG를",
      headlineAccent: "PNG",
      headlinePart2: "로 변환 — 무손실 품질",
      description: "JPEG 이미지를 PNG 형식으로 변환하여 무손실 품질과 투명도 지원을 얻으세요. 디자인 작업, 편집, 픽셀 단위 정밀 출력이 필요한 워크플로에 최적입니다.",
    },
    scenarios: [
      {
        icon: "Layers",
        title: "디자인 작업",
        description: "사진을 PNG로 변환하여 디자인 프로젝트에 활용 — 레이어 합성, 오버레이, 목업에는 PNG의 무손실 품질과 투명도 지원이 가장 적합합니다.",
      },
      {
        icon: "Shield",
        title: "투명도 필요",
        description: "사진에 투명도를 추가해야 하나요? 먼저 PNG로 변환한 후 디자인 도구에서 알파 채널을 편집하여 깔끔한 누끼와 오버레이를 만드세요.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "JPG 업로드", description: "PNG 형식으로 변환할 JPG/JPEG 파일을 드래그 앤 드롭하거나 선택하세요." },
      { stepNumber: 2, title: "결과 미리보기", description: "PNG 미리보기를 확인하세요. 변환 과정에서 원본 JPEG의 모든 시각적 콘텐츠가 최상 품질로 보존됩니다." },
      { stepNumber: 3, title: "PNG 파일 다운로드", description: "무손실 PNG 이미지를 저장하세요. 파일은 원본 JPEG보다 크지만 추가 압축 아티팩트는 없습니다." },
    ],
    faqEntries: [
      { question: "JPG를 PNG로 변환하면 이미지 품질이 향상되나요?", answer: "PNG로 변환하면 추가적인 품질 손실은 방지하지만 원본 JPEG 압축에서 손실된 세부 사항을 복원할 수는 없습니다. 변환된 PNG는 JPEG의 현재 상태를 완벽하게 보존합니다." },
      { question: "왜 PNG 파일이 원본 JPG보다 큰가요?", answer: "PNG는 무손실 압축을 사용하여 모든 픽셀을 정확히 보존하므로 파일이 더 큽니다. JPEG는 손실 압축을 사용하여 일부 데이터를 버려 더 작은 크기를 달성합니다." },
      { question: "PNG로 변환 후 투명도를 추가할 수 있나요?", answer: "네. PNG 형식이 되면 모든 디자인 도구(Photoshop, GIMP, Figma)에서 알파 채널을 편집하여 투명도를 추가할 수 있습니다 — JPEG에서는 불가능한 작업입니다." },
    ],
    relatedTools: [
      { slug: "/jpg-to-webp", title: "JPG를 WebP로", description: "JPEG를 WebP로 변환하여 최신 압축으로 더 작은 파일로." },
      { slug: "/compress-png", title: "PNG 압축", description: "변환 후 PNG 파일 크기를 축소." },
      { slug: "/png-to-jpg", title: "PNG를 JPG로", description: "더 작은 파일이 필요할 때 JPG로 되돌리세요." },
    ],
  },

  "jpg-to-webp": {
    slug: "jpg-to-webp",
    category: "use-case",
    seo: {
      title: "JPG를 WebP로 변환 — 최신 형식 | ImgSplit",
      description: "JPG 및 JPEG 이미지를 WebP 형식으로 변환하여 최대한의 압축을 달성하세요. 최대 80% 파일 크기 감소. 무료 브라우저 기반 변환기, 서버 업로드 불필요.",
      ogTitle: "JPG를 WebP로 변환 — 최신 형식 변환기",
      ogDescription: "JPEG를 WebP로 변환하여 최대 80% 파일 축소. 무료, 안전, 브라우저 기반.",
    },
    hero: {
      overline: "JPG를 WebP로 변환기",
      headlinePart1: "JPG를",
      headlineAccent: "WebP",
      headlinePart2: "로 변환 — 최대 압축",
      description: "JPEG 이미지를 최신 WebP 형식으로 변환하여 획기적으로 파일 크기를 줄이세요. 비슷한 시각적 품질로 최대 80% 크기 감소 — 웹 성능을 위한 현명한 선택입니다.",
    },
    scenarios: [
      {
        icon: "RefreshCw",
        title: "웹사이트 마이그레이션",
        description: "성능 개선 과정에서 사이트의 JPEG 이미지를 WebP로 일괄 변환하세요. 빠른 페이지 로딩, 낮은 호스팅 비용, 더 나은 Google PageSpeed 점수를 달성합니다.",
      },
      {
        icon: "Zap",
        title: "성능 최적화",
        description: "무거운 JPEG 히어로 이미지와 상품 사진을 WebP 버전으로 교체하세요. 방문자는 동일한 시각적 경험을 얻으면서 다운로드 시간은 대폭 단축됩니다.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "JPG 업로드", description: "WebP로 변환할 JPEG 파일을 드래그 앤 드롭하거나 선택하세요." },
      { stepNumber: 2, title: "WebP 품질 조정", description: "품질 설정을 세밀하게 조정하세요. 80% 품질에서도 WebP 파일은 동등한 JPEG보다 획기적으로 작습니다." },
      { stepNumber: 3, title: "WebP 파일 다운로드", description: "WebP 이미지를 저장하고 파일 크기 절감을 비교해 보세요. 대부분의 사용자가 50-80%의 감소를 확인합니다." },
    ],
    faqEntries: [
      { question: "WebP는 JPEG보다 얼마나 작나요?", answer: "WebP는 동등한 시각적 품질에서 일반적으로 JPEG보다 25-34% 작습니다(Google 연구 기준). 많은 이미지에서 50% 이상의 절약을 달성합니다." },
      { question: "WebP는 모든 곳에서 지원되나요?", answer: "네, 모든 주요 브라우저(Chrome, Firefox, Safari 14+, Edge)가 WebP를 지원합니다. 드문 레거시 브라우저를 위해 HTML <picture> 요소로 JPEG를 폴백으로 제공할 수 있습니다." },
      { question: "JPEG에서 WebP로 변환하면 품질이 손실되나요?", answer: "JPEG와 WebP 모두 손실 형식이므로 재인코딩 시 최소한의 추가 아티팩트가 발생합니다. 최상의 결과를 위해 보유한 최고 품질의 JPEG 원본에서 변환하세요." },
    ],
    relatedTools: [
      { slug: "/png-to-webp", title: "PNG를 WebP로", description: "PNG 이미지를 투명도 지원과 함께 WebP로 변환." },
      { slug: "/compress-jpeg", title: "JPEG 압축", description: "JPEG 형식을 유지하면서 파일 크기를 축소." },
      { slug: "/jpg-to-png", title: "JPG를 PNG로", description: "JPEG를 무손실 PNG 형식으로 변환." },
    ],
  },

  "webp-to-png": {
    slug: "webp-to-png",
    category: "use-case",
    seo: {
      title: "WebP를 PNG로 변환 — 무료 온라인 변환기 | ImgSplit",
      description: "WebP 이미지를 PNG 형식으로 변환하여 범용 호환성을 확보하세요. 투명도 보존. 무료 브라우저 기반 변환기, 서버 업로드 불필요.",
      ogTitle: "WebP를 PNG로 변환 — 무료 온라인 변환기",
      ogDescription: "WebP를 PNG로 변환하여 범용 호환성 확보. 무료, 안전, 브라우저 기반.",
    },
    hero: {
      overline: "WebP를 PNG로 변환기",
      headlinePart1: "WebP를",
      headlineAccent: "PNG",
      headlinePart2: "로 변환 — 범용 형식",
      description: "WebP 이미지를 PNG로 변환하여 WebP를 아직 지원하지 않는 구형 소프트웨어, 인쇄 워크플로, 디자인 도구와의 최대 호환성을 확보하세요.",
    },
    scenarios: [
      {
        icon: "ArrowRightLeft",
        title: "호환성 필요",
        description: "WebP 이미지를 다운로드했지만 소프트웨어가 지원하지 않나요? PNG로 변환하면 Photoshop, PowerPoint, Word 등 모든 도구와 즉시 호환됩니다.",
      },
      {
        icon: "Image",
        title: "레거시 도구에서 편집",
        description: "구형 이미지 편집기와 디자인 도구는 WebP 파일을 열지 못할 수 있습니다. 먼저 PNG로 변환하여 편집하고, 필요하면 나중에 다시 변환하세요.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "WebP 업로드", description: "PNG 형식으로 변환할 WebP 이미지를 드래그 앤 드롭하거나 선택하세요." },
      { stepNumber: 2, title: "변환 미리보기", description: "PNG 미리보기를 확인하세요. WebP 파일의 모든 시각적 콘텐츠와 투명도가 완벽하게 보존됩니다." },
      { stepNumber: 3, title: "PNG 파일 다운로드", description: "PNG 이미지를 저장하세요 — 이제 거의 모든 이미지 뷰어, 편집기, 플랫폼과 호환됩니다." },
    ],
    faqEntries: [
      { question: "WebP를 PNG로 변환하면 품질이 손실되나요?", answer: "변환 과정에서 품질 손실은 없습니다. PNG는 무손실 형식이므로 WebP 소스의 모든 픽셀이 정확히 보존됩니다. PNG는 WebP만큼 적극적으로 압축하지 않으므로 파일 크기는 더 커집니다." },
      { question: "WebP를 PNG로 변환할 때 투명도가 보존되나요?", answer: "네. WebP와 PNG 모두 알파 투명도를 지원합니다. WebP 이미지의 모든 투명 영역이 PNG 출력에서 완벽하게 보존됩니다." },
      { question: "JPG 대신 PNG로 변환해야 하는 이유는?", answer: "투명도 지원이나 무손실 품질이 필요하면 PNG를 선택하세요. 가장 작은 파일 크기가 필요하고 투명도가 불필요하면 JPG를 선택하세요." },
    ],
    relatedTools: [
      { slug: "/webp-to-jpg", title: "WebP를 JPG로", description: "투명도 없이 WebP를 JPG로 변환하여 더 작은 파일로." },
      { slug: "/compress-png", title: "PNG 압축", description: "변환 후 PNG 파일 크기를 축소." },
      { slug: "/png-to-webp", title: "PNG를 WebP로", description: "더 작은 파일이 필요할 때 WebP로 되돌리세요." },
    ],
  },

  "webp-to-jpg": {
    slug: "webp-to-jpg",
    category: "use-case",
    seo: {
      title: "WebP를 JPG로 변환 — 무료 온라인 변환기 | ImgSplit",
      description: "WebP 이미지를 JPG 형식으로 변환하여 최대 호환성을 확보하세요. 무료 브라우저 기반 변환기, 서버 업로드 불필요, 즉시 다운로드.",
      ogTitle: "WebP를 JPG로 변환 — 무료 온라인 변환기",
      ogDescription: "WebP를 JPG로 변환하여 최대 호환성 확보. 무료, 안전, 브라우저 기반.",
    },
    hero: {
      overline: "WebP를 JPG로 변환기",
      headlinePart1: "WebP를",
      headlineAccent: "JPG",
      headlinePart2: "로 변환 — 최대 호환성",
      description: "WebP 이미지를 범용 지원되는 JPG 형식으로 변환하세요. 공유, 인쇄, 모든 소프트웨어와 플랫폼에서의 사용에 최적 — 호환성 걱정이 없습니다.",
    },
    scenarios: [
      {
        icon: "Mail",
        title: "타인과 공유",
        description: "모든 기기가 WebP를 처리하는 것은 아닙니다. 이메일, 메신저, 파일 전송으로 공유하기 전에 JPG로 변환하면 누구나 이미지를 열 수 있습니다.",
      },
      {
        icon: "FileDown",
        title: "인쇄 준비",
        description: "대부분의 인쇄소와 주문형 인쇄 서비스는 JPG 파일을 기대합니다. WebP 이미지를 JPG로 변환하여 번거로움 없이 예측 가능한 색상 출력으로 인쇄하세요.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "WebP 업로드", description: "JPG 형식으로 변환할 WebP 이미지를 드래그 앤 드롭하거나 선택하세요." },
      { stepNumber: 2, title: "JPG 품질 설정", description: "품질 슬라이더를 조정하세요. 투명한 영역은 선택한 배경색(기본값: 흰색)으로 채워집니다." },
      { stepNumber: 3, title: "JPG 파일 다운로드", description: "JPG 이미지를 저장하세요 — 공유, 인쇄, 모든 애플리케이션에서 바로 사용할 수 있습니다." },
    ],
    faqEntries: [
      { question: "WebP를 JPG로 변환할 때 투명도는 어떻게 되나요?", answer: "JPG는 투명도를 지원하지 않습니다. WebP 이미지의 투명한 영역은 단색 배경색 — 기본값은 흰색 — 으로 채워집니다. 변환 전에 다른 색상을 선택할 수 있습니다." },
      { question: "JPG가 가장 호환성이 좋은 이미지 형식인가요?", answer: "네. JPG/JPEG는 사실상 모든 기기, 브라우저, 이메일 클라이언트, 소프트웨어에서 지원됩니다. 호환성이 최우선일 때 가장 안전한 선택입니다." },
      { question: "WebP를 JPG로 변환하면 파일 크기가 증가하나요?", answer: "일반적으로 그렇습니다. WebP가 JPG보다 더 나은 압축을 제공하기 때문입니다. 하지만 JPG 품질 설정을 조정하여 파일 크기와 시각적 품질 사이의 적절한 균형을 찾을 수 있습니다." },
    ],
    relatedTools: [
      { slug: "/webp-to-png", title: "WebP를 PNG로", description: "투명도와 무손실 품질이 필요할 때 WebP를 PNG로 변환." },
      { slug: "/compress-jpeg", title: "JPEG 압축", description: "변환 후 JPEG 파일 크기를 더 줄이세요." },
      { slug: "/jpg-to-webp", title: "JPG를 WebP로", description: "더 작은 파일이 필요할 때 WebP로 되돌리세요." },
    ],
  },

  "reduce-image-size": {
    slug: "reduce-image-size",
    category: "use-case",
    seo: {
      title: "이미지 크기 줄이기 — 무료 파일 최적화 도구 | ImgSplit",
      description: "무료 온라인으로 이미지 파일 크기를 줄이세요. JPEG, PNG, WebP 이미지를 웹, 이메일, 저장용으로 최적화. 브라우저 기반, 개인정보 보호, 서버 업로드 불필요.",
      ogTitle: "이미지 크기 줄이기 — 무료 온라인 최적화 도구",
      ogDescription: "이미지 파일 크기를 즉시 최적화하고 줄이세요. 무료, 안전, 브라우저 기반.",
    },
    hero: {
      overline: "이미지 크기 축소",
      headlinePart1: "이미지",
      headlineAccent: "크기",
      headlinePart2: "줄이기 — 즉시 최적화",
      description: "모든 이미지를 최소 파일 크기로 최적화하세요. JPEG, PNG, WebP의 지능형 압축 — 더 빠른 웹사이트, 적은 저장 공간, 빠른 업로드에 최적입니다.",
    },
    scenarios: [
      {
        icon: "Zap",
        title: "웹사이트 속도",
        description: "큰 이미지는 웹사이트 속도 저하의 1순위 원인입니다. 이미지 크기를 줄여 페이지 로딩 시간, 이탈률, 검색 엔진 순위를 극적으로 개선하세요.",
      },
      {
        icon: "FileDown",
        title: "저장 공간 최적화",
        description: "클라우드 저장 공간이나 기기 용량이 부족하신가요? 사진 라이브러리의 이미지 크기를 줄여 이미지를 삭제하지 않고도 기가바이트 단위의 공간을 확보하세요.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "이미지 업로드", description: "크기를 줄이고 싶은 JPEG, PNG 또는 WebP 이미지를 드래그 앤 드롭하거나 선택하세요." },
      { stepNumber: 2, title: "설정 최적화", description: "압축 품질을 조정하고 선택적으로 출력 형식을 변경하세요. WebP가 일반적으로 가장 효과적인 크기 감소를 제공합니다." },
      { stepNumber: 3, title: "최적화된 이미지 다운로드", description: "작아진 이미지 파일을 저장하세요. 도구가 정확한 절약 바이트 수와 감소 비율을 표시합니다." },
    ],
    faqEntries: [
      { question: "이미지 파일 크기를 줄이는 가장 좋은 방법은?", answer: "세 가지 전략이 가장 효과적입니다: 품질 조정을 통한 압축(가장 빠름), WebP 형식으로 변환(가장 효과적), 또는 더 작은 치수로 리사이즈(가장 적극적). 세 가지를 모두 조합하면 가장 작은 파일을 얻을 수 있습니다." },
      { question: "이미지 파일 크기를 얼마나 줄일 수 있나요?", answer: "소스 이미지와 설정에 따라 일반적으로 40-80%의 감소가 가능합니다. 5MB JPEG를 품질 80의 WebP로 변환하면 500KB 파일을 쉽게 만들 수 있습니다." },
      { question: "파일 크기를 줄이면 인쇄 품질에 영향을 미치나요?", answer: "웹 및 화면 용도에서는 잘 압축된 이미지가 원본과 동일하게 보입니다. 전문 인쇄용에는 품질을 90% 이상으로 유지하고 과도한 압축을 피하세요." },
    ],
    relatedTools: [
      { slug: "/compress-image", title: "이미지 압축", description: "형식 옵션을 갖춘 범용 이미지 압축." },
      { slug: "/compress-jpeg", title: "JPEG 압축", description: "JPEG 사진 전용 압축." },
      { slug: "/png-to-webp", title: "PNG를 WebP로", description: "최적의 압축률을 위해 WebP로 변환." },
    ],
  },

}

export default data
