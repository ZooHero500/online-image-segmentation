import type { ToolPageData } from "./types"

const data: Record<string, ToolPageData> = {
  "split-in-half": {
    slug: "split-in-half",
    category: "direction",
    seo: {
      title: "画像を半分に分割 — 無料オンライン二等分ツール | ImgSplit",
      description: "画像を瞬時に半分に分割。横方向・縦方向に対応。ピクセル精度の無料オンラインツール。サーバーへのアップロード不要、100%ブラウザ処理。",
      ogTitle: "画像を半分に分割 — 無料オンラインツール",
      ogDescription: "ワンクリックで写真を二等分。アップロード不要、ブラウザだけで完結。",
    },
    hero: {
      overline: "画像分割ツール",
      headlinePart1: "画像を",
      headlineAccent: "半分に分割",
      headlinePart2: "— 瞬時に完了",
      description: "画像を横方向・縦方向に二等分。ピクセル精度で画質劣化ゼロ、すべてブラウザ内で処理します。",
    },
    scenarios: [
      {
        icon: "Columns2",
        title: "ビフォー・アフター比較",
        description: "比較画像を個別ファイルに分割し、プレゼンテーション、製品デモ、A/Bテスト資料の並列表示に活用できます。",
      },
      {
        icon: "Smartphone",
        title: "SNSカバー画像の分割",
        description: "ワイドバナー画像を二分割し、SNSの連続投稿でシームレスなパノラマ効果を演出します。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "画像をアップロード", description: "半分に分割したい画像をドラッグ＆ドロップまたはクリックでアップロードします。" },
      { stepNumber: 2, title: "分割線を配置", description: "横方向または縦方向の分割線を中央に配置し、画像を二等分します。" },
      { stepNumber: 3, title: "両方をダウンロード", description: "二分割された画像をプレビューし、個別にまたはZIPでまとめてダウンロードします。" },
    ],
    faqEntries: [
      { question: "均等でない分割はできますか？", answer: "はい。デフォルトでは中央に配置されますが、分割線を自由にドラッグして、例えば30/70のような不均等な分割も可能です。" },
      { question: "半分に分割すると画質は劣化しますか？", answer: "いいえ。それぞれの半分は元の解像度とピクセルデータを維持します。圧縮やリサンプリングは一切行いません。" },
      { question: "横方向と縦方向を同時に分割できますか？", answer: "もちろんです。横方向と縦方向の分割線を同時に追加すれば、画像を二分割ではなく四分割にできます。" },
    ],
    relatedTools: [
      { slug: "/split-horizontally", title: "横方向に分割", description: "横方向の分割線で画像を上下のセクションに分けます。" },
      { slug: "/split-vertically", title: "縦方向に分割", description: "縦方向の分割線で画像を左右のセクションに分けます。" },
      { slug: "/split-into-equal-parts", title: "均等分割ツール", description: "画像を任意の方向に均等なセグメントに分割します。" },
      { slug: "/", title: "画像分割ツール", description: "ドラッグ＆ドロップで分割線を配置できる高機能画像分割ツール。" },
    ],
  },

  "split-horizontally": {
    slug: "split-horizontally",
    category: "direction",
    seo: {
      title: "画像を横方向に分割 — 無料オンライン水平カッター | ImgSplit",
      description: "画像を横方向に分割して上下のセクションに。複数の水平線で正確な行分割が可能。無料・ブラウザ処理・アップロード不要。",
      ogTitle: "画像を横方向に分割 — 無料オンラインカッター",
      ogDescription: "水平分割線を追加して画像を行ごとに分割。無料でブラウザ内完結。",
    },
    hero: {
      overline: "水平分割",
      headlinePart1: "画像を",
      headlineAccent: "横方向に分割",
      headlinePart2: "— 行ごとに正確に",
      description: "水平分割線を追加して画像を上下のセクションや行に分割。縦長画像のスライスや水平セグメント作成に最適です。",
    },
    scenarios: [
      {
        icon: "LayoutList",
        title: "縦長商品画像の分割",
        description: "ECサイトの縦長商品画像を適切な水平セクションに分割し、ページ読み込みの最適化と整理された表示を実現します。",
      },
      {
        icon: "FileText",
        title: "スキャン文書の分割",
        description: "レシート、請求書、フォームなど複数セクションのスキャン文書を個別の水平ストリップに分割し、ファイリングを効率化します。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "画像をアップロード", description: "PNG、JPG、WebP 形式の画像をドロップまたは選択（最大20MB）。" },
      { stepNumber: 2, title: "水平線を追加", description: "「水平線を追加」をクリックし、1本以上の水平分割線を配置。各線を正確な位置にドラッグします。" },
      { stepNumber: 3, title: "行をダウンロード", description: "各水平ストリップをプレビューし、ZIPで一括ダウンロードまたは特定の行を選択してダウンロード。" },
    ],
    faqEntries: [
      { question: "水平分割線は何本まで追加できますか？", answer: "最大20本の水平分割線を追加でき、1枚の画像から最大21の水平ストリップを作成できます。" },
      { question: "水平線と垂直線を組み合わせることはできますか？", answer: "はい。両方を追加するとグリッド分割になります。水平ストリップだけが必要な場合は、水平線のみ追加してください。" },
      { question: "正確な配置のためのスナップ機能はありますか？", answer: "はい。分割線は端や中央線に自動的にスナップし、ピクセルレベルの精度で配置できます。" },
    ],
    relatedTools: [
      { slug: "/split-in-half", title: "半分に分割", description: "1本の線で画像を二等分します。" },
      { slug: "/split-vertically", title: "縦方向に分割", description: "垂直線で画像を左右の列に分割します。" },
      { slug: "/split-long-screenshot", title: "長いスクリーンショット分割", description: "長いスクリーンショットを読みやすいページサイズに分割します。" },
      { slug: "/grid", title: "グリッド分割", description: "画像を3×3、1×3、2×2のグリッドタイルに分割します。" },
    ],
  },

  "split-vertically": {
    slug: "split-vertically",
    category: "direction",
    seo: {
      title: "画像を縦方向に分割 — 無料オンライン垂直カッター | ImgSplit",
      description: "画像を縦方向に分割して左右の列に。複数の垂直線で列ベースの分割が可能。無料・プライバシー保護・ブラウザ処理。",
      ogTitle: "画像を縦方向に分割 — 無料列カッター",
      ogDescription: "垂直分割線を追加して画像を列に分割。ブラウザベースでプライバシーも安心。",
    },
    hero: {
      overline: "垂直分割",
      headlinePart1: "画像を",
      headlineAccent: "縦方向に分割",
      headlinePart2: "— 列ごとに正確に",
      description: "垂直分割線を配置して画像を左右のセクション、列、縦ストリップに分割。ワイド画像や複数列レイアウトの分割に最適です。",
    },
    scenarios: [
      {
        icon: "Columns3",
        title: "マンガのコマ分割",
        description: "横並びに配置されたマンガのコマやストーリーボードのフレームを、個別の縦パネルに分離します。",
      },
      {
        icon: "LayoutDashboard",
        title: "ダッシュボードスクリーンショットの列抽出",
        description: "ワイドなダッシュボードやスプレッドシートのスクリーンショットから特定の列を抽出し、レポートやプレゼンに活用します。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "画像をアップロード", description: "縦方向に列分割したいワイド画像やパノラマ画像をアップロードします。" },
      { stepNumber: 2, title: "垂直線を追加", description: "1本以上の垂直分割線を配置し、ドラッグして列の境界を定義します。" },
      { stepNumber: 3, title: "列をダウンロード", description: "各列セグメントを確認し、個別にダウンロードまたはZIPで一括エクスポートします。" },
    ],
    faqEntries: [
      { question: "垂直分割は最大何本まで可能ですか？", answer: "最大20本の垂直線を追加でき、1枚の画像から最大21列を作成できます。" },
      { question: "パノラマ画像を分割するとエッジのピクセルが失われますか？", answer: "いいえ。ツールはピクセル精度の境界を使用するため、分割エッジでピクセルが失われたりぼやけたりすることはありません。" },
      { question: "縦長の画像でも垂直分割できますか？", answer: "はい。ただし垂直分割は横長やワイド画像で最も効果的です。縦長画像を垂直分割すると細い縦ストリップになります。" },
    ],
    relatedTools: [
      { slug: "/split-in-half", title: "半分に分割", description: "1本の線で二等分 — 最もシンプルな画像分割方法。" },
      { slug: "/split-horizontally", title: "横方向に分割", description: "画像を水平な行やストリップに分割します。" },
      { slug: "/split-for-instagram", title: "Instagram 分割", description: "ワイド画像をInstagramカルーセル投稿用のタイルに分割します。" },
      { slug: "/grid", title: "グリッド分割", description: "画像を3×3やカスタムグリッドタイルに分割します。" },
    ],
  },

  "split-into-equal-parts": {
    slug: "split-into-equal-parts",
    category: "direction",
    seo: {
      title: "画像を均等に分割 — 無料オンライングリッド分割ツール | ImgSplit",
      description: "画像を2、3、4等分以上に均等分割。スナップ整列で均等間隔を実現する無料オンラインツール。アップロード不要。",
      ogTitle: "画像を均等に分割 — 無料ツール",
      ogDescription: "スナップ整列の分割線で画像を完璧に均等なセグメントに分割。",
    },
    hero: {
      overline: "均等分割ツール",
      headlinePart1: "画像を",
      headlineAccent: "均等に分割",
      headlinePart2: "— 正確かつ均一に",
      description: "画像を2、3、4等分以上に完璧に均等分割。スナップ整列により、ピクセルレベルの精度で均等間隔を実現します。",
    },
    scenarios: [
      {
        icon: "Grid2X2",
        title: "パズル・コラージュ素材の準備",
        description: "画像を均等なタイルに分割し、ジグソーパズル風のゲーム、教材、コラージュ用の素材を作成します。",
      },
      {
        icon: "Printer",
        title: "均一サイズの印刷タイル",
        description: "大きな画像を均等サイズの印刷タイルに分割。各ピースが標準用紙サイズに収まり、シームレスに再組み立てできます。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "画像をアップロード", description: "均等に分割したい画像を選択します。" },
      { stepNumber: 2, title: "等間隔の分割線を追加", description: "水平または垂直の分割線を追加。スナップ整列で画像全体に均等に配置します。" },
      { stepNumber: 3, title: "均等セグメントをダウンロード", description: "すべてのパーツが均等であることを確認し、各セグメントを個別にまたはZIPでダウンロードします。" },
    ],
    faqEntries: [
      { question: "完全に均等なパーツを作るにはどうすれば？", answer: "スナップ整列機能を使用してください。分割線が自動的に等間隔の位置にスナップします。例えば3等分の場合、2本の線が1/3と2/3の位置に自動配置されます。" },
      { question: "均等な長方形のグリッドを作成できますか？", answer: "はい。等間隔の水平線と垂直線を追加すれば、同一サイズの長方形グリッドが作成できます。タイルベースのワークフローに最適です。" },
      { question: "画像サイズが割り切れない場合はどうなりますか？", answer: "最後のセグメントが1ピクセル異なる場合があります。ツールはサイズ差を最小限に抑えるよう、できるだけ均等にピクセルを分配します。" },
    ],
    relatedTools: [
      { slug: "/split-in-half", title: "半分に分割", description: "最もシンプルな均等分割 — 画像を正確に二等分します。" },
      { slug: "/split-for-print", title: "印刷用分割", description: "大きな画像を標準用紙サイズの印刷タイルに分割します。" },
      { slug: "/no-photoshop-slicer", title: "Photoshop不要のスライサー", description: "Photoshopのスライスツールに代わる無料オンラインツール。" },
      { slug: "/grid", title: "グリッド分割", description: "プリセットグリッドレイアウト：3×3、1×3、2×2。" },
    ],
  },

  "split-long-screenshot": {
    slug: "split-long-screenshot",
    category: "use-case",
    seo: {
      title: "長いスクリーンショットをページ分割 — 無料オンラインツール | ImgSplit",
      description: "長いスクリーンショットをページサイズに分割して共有・閲覧を簡単に。無料ブラウザツール。アップロード不要、あらゆる縦長画像に対応。",
      ogTitle: "長いスクリーンショットを分割 — 無料ページ分割ツール",
      ogDescription: "長いスクリーンショットを読みやすいページサイズに分割。アップロード不要。",
    },
    hero: {
      overline: "長画像分割",
      headlinePart1: "長い",
      headlineAccent: "スクリーンショット",
      headlinePart2: "をページに分割",
      description: "スクロールキャプチャした長いスクリーンショットをページサイズのセグメントに分割。共有、閲覧、アーカイブが簡単になります。あらゆる縦長画像に対応。",
    },
    scenarios: [
      {
        icon: "MessageSquare",
        title: "チャット履歴の整理",
        description: "メッセージアプリのフルページチャットスクリーンショットを画面サイズの個別画像に分割し、整理された保存と選択的な共有を実現します。",
      },
      {
        icon: "FileSearch",
        title: "Webページのドキュメント化",
        description: "長いWebページキャプチャをセクションごとに分割し、バグレポート、デザインレビュー、コンプライアンス文書として活用します。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "長いスクリーンショットをアップロード", description: "スクロールキャプチャした長いスクリーンショットをアップロード。あらゆる高さの画像に対応します。" },
      { stepNumber: 2, title: "水平区切り線を配置", description: "ページ区切りを入れたい場所に水平分割線を追加。スナップ整列で均等間隔にもできます。" },
      { stepNumber: 3, title: "ページセグメントをダウンロード", description: "各セグメントをプレビューし、すべてのページをZIPでダウンロードして手軽に共有できます。" },
    ],
    faqEntries: [
      { question: "長いスクリーンショットの高さに上限はありますか？", answer: "ファイルサイズ20MBまでの画像に対応しています。非常に縦長の画像（10,000px以上）は処理がやや遅くなる場合がありますが、完全にサポートされています。" },
      { question: "スクリーンショットを均等なページ長に分割できますか？", answer: "はい。複数の水平線を追加し、スナップ整列で均等に配置すれば、統一されたページ高さのセグメントが作成できます。" },
      { question: "分割後もスクリーンショットの文字は鮮明ですか？", answer: "もちろんです。元の解像度でクロップし、リサンプリングを行わないため、文字は鮮明で読みやすいまま維持されます。" },
    ],
    relatedTools: [
      { slug: "/split-horizontally", title: "横方向に分割", description: "水平線を追加して画像を行に分割します。" },
      { slug: "/split-for-instagram", title: "Instagram 分割", description: "画像をマルチスライドのカルーセル投稿に分割します。" },
      { slug: "/split-for-wechat", title: "SNSグリッド分割", description: "SNS投稿用のグリッド画像を作成します。" },
      { slug: "/", title: "画像分割ツール", description: "ドラッグ＆ドロップ対応の高機能分割ツール。" },
    ],
  },

  "split-for-instagram": {
    slug: "split-for-instagram",
    category: "use-case",
    seo: {
      title: "Instagram カルーセル・グリッド用画像分割 — 無料オンラインツール | ImgSplit",
      description: "Instagramカルーセル投稿やプロフィールグリッド用に画像を分割。1080×1080pxに最適化。無料・ブラウザ処理・ウォーターマークなし。",
      ogTitle: "Instagram 画像分割 — 無料カルーセル＆グリッドツール",
      ogDescription: "画像をInstagram対応のタイルに分割。1080×1080px投稿に最適化。",
    },
    hero: {
      overline: "Instagram 分割",
      headlinePart1: "画像を",
      headlineAccent: "Instagram",
      headlinePart2: "用に分割 — カルーセル＆グリッド",
      description: "画像を最適なサイズのタイルに分割し、Instagramカルーセルスライドやプロフィールグリッドレイアウトを作成。Instagramのネイティブサイズに最適化。",
    },
    platformInfo: "Instagram 推奨投稿サイズ：1080 × 1080 px（1:1 正方形）。カルーセルは最大10枚のスライドに対応。",
    scenarios: [
      {
        icon: "LayoutGrid",
        title: "シームレスなプロフィールグリッド",
        description: "1枚のワイド画像を3、6、9枚のタイルに分割し、Instagramプロフィールグリッドでシームレスなパノラマ効果を演出します。",
      },
      {
        icon: "GalleryHorizontal",
        title: "カルーセル投稿スライド",
        description: "パノラマ写真やインフォグラフィックをスワイプ可能なカルーセルスライドに分割し、複数フレームにわたるビジュアルストーリーを展開します。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "画像をアップロード", description: "Instagram用に分割したい画像やパノラマ写真をアップロードします。" },
      { stepNumber: 2, title: "グリッドを設定", description: "カルーセルスライド用の垂直線を追加するか、プロフィールレイアウト用のグリッドを作成。スナップ整列で均等間隔に。" },
      { stepNumber: 3, title: "Instagram対応タイルをダウンロード", description: "すべてのタイルをZIPでダウンロード。順番通りにInstagramにアップロードすればシームレスな仕上がりに。" },
    ],
    faqEntries: [
      { question: "Instagramの各タイルのサイズはどのくらいですか？", answer: "Instagramの投稿は1080×1080px（正方形）で表示されます。カルーセル投稿の各スライドは幅1080pxが推奨です。ツールでは任意の境界で分割できます。" },
      { question: "Instagramカルーセルは何枚までスライドを入れられますか？", answer: "Instagramは1投稿あたり最大10枚のスライドに対応しています。画像を2〜10の縦セグメントに分割すれば、スワイプ可能なパノラマが作成できます。" },
      { question: "タイルは正しい投稿順序になりますか？", answer: "はい。タイルは左から右（垂直分割の場合）または上から下（水平分割の場合）に番号付けされ、Instagramのアップロード順序と一致します。" },
    ],
    relatedTools: [
      { slug: "/split-into-equal-parts", title: "均等分割ツール", description: "あらゆるプラットフォーム向けに画像を均等なセグメントに分割します。" },
      { slug: "/split-long-screenshot", title: "長いスクリーンショット分割", description: "縦長画像を共有しやすいページサイズに分割します。" },
      { slug: "/split-for-wechat", title: "SNSグリッド分割", description: "SNS投稿用のグリッド画像を作成します。" },
      { slug: "/grid", title: "グリッド分割", description: "SNSに最適化された3×3グリッド分割。" },
    ],
  },

  "split-for-wechat": {
    slug: "split-for-wechat",
    category: "use-case",
    seo: {
      title: "SNSグリッド投稿用 画像分割ツール — 無料オンライン | ImgSplit",
      description: "無料オンライン画像分割ツール。ドラッグ＆ドロップの分割線で写真をグリッドやカスタムセグメントに分割。ブラウザ処理でプライバシーも安心。",
      ogTitle: "無料画像分割ツール — 写真をオンラインで分割",
      ogDescription: "画像をグリッドやカスタムセグメントに分割。無料でブラウザ内完結。",
    },
    hero: {
      overline: "画像グリッド分割",
      headlinePart1: "画像を",
      headlineAccent: "グリッドに分割",
      headlinePart2: "— SNS投稿に最適",
      description: "画像をグリッドタイルに分割してSNS投稿に活用。分割線をドラッグしてカスタムグリッドを作成するか、均等間隔で統一タイルを作成できます。",
    },
    scenarios: [
      {
        icon: "Share2",
        title: "SNSグリッド投稿",
        description: "1枚の画像を複数のタイルに分割し、プロフィールページで一体感のあるビジュアルを演出する目を引くグリッド投稿を作成します。",
      },
      {
        icon: "Maximize2",
        title: "大型画像のセグメント化",
        description: "アップロードサイズやサイズ制限のあるプラットフォーム向けに、大きすぎる画像を管理しやすいグリッドタイルに分割します。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "画像をアップロード", description: "グリッドタイルに分割したい写真をアップロードします。" },
      { stepNumber: 2, title: "グリッドを作成", description: "水平線と垂直線を追加してグリッドレイアウトを定義。スナップ整列で均等間隔にできます。" },
      { stepNumber: 3, title: "グリッドタイルをダウンロード", description: "すべてのグリッドピースをZIPでダウンロード。順番通りにSNSに投稿すればシームレスな仕上がりに。" },
    ],
    faqEntries: [
    ],
    relatedTools: [
      { slug: "/split-for-instagram", title: "Instagram 分割", description: "Instagramカルーセルやグリッド投稿向けに画像を分割します。" },
      { slug: "/split-long-screenshot", title: "長いスクリーンショット分割", description: "縦長スクリーンショットをページサイズに分割します。" },
      { slug: "/", title: "画像分割ツール", description: "カスタム分割線対応の高機能画像分割ツール。" },
      { slug: "/grid", title: "グリッド分割", description: "プリセットで素早くグリッド分割：3×3、1×3、2×2。" },
    ],
  },

  "split-for-print": {
    slug: "split-for-print",
    category: "use-case",
    seo: {
      title: "大きな画像を印刷用に分割 — 無料タイル印刷ツール | ImgSplit",
      description: "大きな画像を標準用紙サイズの印刷可能なタイルに分割。ポスター、バナー、大判アートを印刷して組み立て。無料ブラウザツール。",
      ogTitle: "画像を印刷用に分割 — 無料タイルツール",
      ogDescription: "大きな画像をページサイズのタイルに分割して印刷・再組み立て。",
    },
    hero: {
      overline: "印刷用分割",
      headlinePart1: "画像を",
      headlineAccent: "印刷用に分割",
      headlinePart2: "— タイル化して組み立て",
      description: "大きな画像を標準用紙サイズのタイルに分割し、印刷後に組み合わせてポスター、バナー、ウォールアートを完成させます。",
    },
    scenarios: [
      {
        icon: "Image",
        title: "DIYポスター印刷",
        description: "高解像度画像をA4タイルに分割し、家庭用プリンターで印刷。貼り合わせれば大判ポスターの完成です。",
      },
      {
        icon: "Ruler",
        title: "建築図面・設計図の分割",
        description: "大判の技術図面やフロアプランを印刷可能なセクションに分割し、各ページに管理しやすい範囲を表示します。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "大きな画像をアップロード", description: "タイル印刷したい高解像度画像、ポスター、図面をアップロードします。" },
      { stepNumber: 2, title: "タイル境界を設定", description: "用紙サイズに合わせた等間隔の分割線を追加。スナップ整列で均等な間隔にします。" },
      { stepNumber: 3, title: "印刷して組み立て", description: "すべてのタイルをダウンロードし、各ページに印刷。配置して組み合わせれば元の画像を再現できます。" },
    ],
    faqEntries: [
      { question: "タイルはどの用紙サイズに合わせるべきですか？", answer: "家庭用プリンターにはA4（210×297mm）が標準です。画像のアスペクト比と希望する最終サイズに基づいてタイル数を計算してください。" },
      { question: "組み立て用の重なりマージンは追加されますか？", answer: "ツールは正確なピクセル境界で分割します。重なりマージンが必要な場合は、タイル数を少し増やして隣接するピースで薄いストリップを共有させてください。" },
      { question: "非常に高解像度の画像（例：8000×6000）も処理できますか？", answer: "はい。20MBまでの大きな画像に対応しています。超高解像度ファイルの場合、WebP形式を使用するとファイルサイズを抑えられます。" },
    ],
    relatedTools: [
      { slug: "/split-into-equal-parts", title: "均等分割ツール", description: "画像を均等なセグメントに分割して統一タイルを作成します。" },
      { slug: "/split-horizontally", title: "横方向に分割", description: "画像を行に分割してストリップ印刷に活用します。" },
      { slug: "/no-photoshop-slicer", title: "Photoshop不要のスライサー", description: "Photoshopのスライス＆エクスポート機能に代わる無料オンラインツール。" },
      { slug: "/", title: "画像分割ツール", description: "カスタム分割線対応の高機能画像分割ツール。" },
    ],
  },

  "no-photoshop-slicer": {
    slug: "no-photoshop-slicer",
    category: "use-case",
    seo: {
      title: "無料オンライン画像スライサー — Photoshop不要 | ImgSplit",
      description: "Photoshopのスライスツールに代わる無料ツール。ソフトをインストールせずに画像を領域分割。ブラウザ処理でプライバシーも安心、即座に完了。",
      ogTitle: "Photoshop不要の画像スライサー — 無料オンラインツール",
      ogDescription: "Photoshopは不要。ブラウザで画像を瞬時にスライスできます。",
    },
    hero: {
      overline: "Photoshop不要のスライサー",
      headlinePart1: "画像スライサー",
      headlineAccent: "Photoshop不要",
      headlinePart2: "で即座に分割",
      description: "高額なソフトウェアのサブスクリプションは不要。ドラッグ＆ドロップの分割線で画像を自由にスライス — 完全無料、すべてブラウザ内で完結。",
    },
    scenarios: [
      {
        icon: "DollarSign",
        title: "サブスクリプション費用を節約",
        description: "Creative Cloudの月額サブスクリプション不要で、Photoshopと同等の画像スライス機能を利用 — 無料で誰でもアクセス可能です。",
      },
      {
        icon: "GraduationCap",
        title: "初心者に優しいワークフロー",
        description: "レイヤーもツールバーも学習コストも不要。カットしたい位置に線をドラッグするだけで、誰でも数秒で完了します。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "画像をアップロード", description: "ドラッグ＆ドロップまたはクリックでアップロード。アカウント登録不要、ソフトのインストールも不要です。" },
      { stepNumber: 2, title: "分割線をドラッグ", description: "水平線と垂直線を追加してスライス領域を定義。スナップ整列で精度を確保します。" },
      { stepNumber: 3, title: "スライスをエクスポート", description: "すべてのスライス領域をZIPでダウンロード — Web、SNS、その他あらゆる用途にすぐ使えます。" },
    ],
    faqEntries: [
      { question: "本当にPhotoshopのスライスツールと同じ精度ですか？", answer: "はい。ツールはスナップ整列により正確なピクセル境界で分割するため、複雑な操作なしにPhotoshopと同じピクセルパーフェクトな精度を実現します。" },
      { question: "HTMLメールテンプレート用に画像をスライスできますか？", answer: "もちろんです。メールデザインをセクションごとにスライスし、各領域をエクスポートして、HTMLテンプレートで参照すれば、ピクセルパーフェクトなメールレイアウトが作成できます。" },
      { question: "アカウント登録は必要ですか？", answer: "不要です。ツールは完全無料で、登録は一切必要ありません。ページを開いて、アップロード、スライス、ダウンロード — それだけです。" },
    ],
    relatedTools: [
      { slug: "/split-in-half", title: "半分に分割", description: "最もシンプルな分割 — 画像を二等分します。" },
      { slug: "/split-for-print", title: "印刷用分割", description: "大きな画像を印刷可能なページサイズのタイルに分割します。" },
      { slug: "/split-for-instagram", title: "Instagram 分割", description: "Instagramカルーセルやグリッド投稿用に画像を分割します。" },
      { slug: "/", title: "画像分割ツール", description: "ドラッグ＆ドロップ対応の高機能画像分割ツール。" },
    ],
  },

  "photo-splitter": {
    slug: "photo-splitter",
    category: "use-case",
    seo: {
      title: "オンライン写真分割ツール — 無料画像カッター | ImgSplit",
      description: "無料のオンライン写真分割ツール — 写真をドラッグ＆ドロップで正確に分割。サーバーへのアップロード不要、100%ブラウザ処理。",
      ogTitle: "写真分割ツール — 無料オンラインツール",
      ogDescription: "写真を複数のパーツに即座に分割。無料・プライバシー安全・ブラウザベース。",
    },
    hero: {
      overline: "写真分割ツール",
      headlinePart1: "写真",
      headlineAccent: "分割ツール",
      headlinePart2: "— 無料＆即座に",
      description: "あらゆる写真をピクセルレベルの精度で複数のパーツに分割。ドラッグ＆ドロップの分割線、スナップ整列、即時ダウンロード — すべてブラウザ内で完結。",
    },
    scenarios: [
      { icon: "Camera", title: "写真の後処理", description: "集合写真、パノラマ、合成画像を個別セクションに分割し、編集・共有・印刷に活用。" },
      { icon: "Smartphone", title: "スマホ写真の管理", description: "スマホで撮影した写真を分割 — 顔の切り出し、細部のトリミング、前景と背景の分離。" },
      { icon: "ShoppingBag", title: "商品写真の作成", description: "商品写真を詳細ショットに分割し、ECサイトの商品ページで異なる角度やクローズアップを表示。" },
    ],
    howToSteps: [
      { stepNumber: 1, title: "写真をアップロード", description: "ドラッグ＆ドロップまたはクリックでアップロード — PNG、JPG、WebP対応、最大20MB。" },
      { stepNumber: 2, title: "分割線を配置", description: "水平または垂直の分割線を追加し、ドラッグで正確な位置に配置。" },
      { stepNumber: 3, title: "プレビュー＆調整", description: "各パーツをリアルタイムで確認。スナップ整列で分割線を微調整。" },
      { stepNumber: 4, title: "ダウンロード", description: "全パーツをZIPでダウンロード、または個別に保存。" },
    ],
    faqEntries: [
      { question: "対応する写真形式は？", answer: "PNG、JPG/JPEG、WebP形式に対応。1ファイルあたり最大20MB。" },
      { question: "分割で画質は劣化しますか？", answer: "いいえ。各パーツは元の解像度とピクセルデータを保持します。圧縮やリサンプリングなし — 画質劣化ゼロ。" },
      { question: "不均等に分割できますか？", answer: "はい。分割線を任意の位置にドラッグして、カスタムサイズのパーツを作成できます。" },
      { question: "スマホでも使えますか？", answer: "はい。モバイルブラウザでも快適に動作し、スマホから直接写真を分割できます。" },
    ],
    relatedTools: [
      { slug: "/split-in-half", title: "半分に分割", description: "最もシンプルな分割 — 画像を2等分。" },
      { slug: "/split-into-equal-parts", title: "等分分割", description: "画像を均等なセグメントに分割。" },
      { slug: "/split-for-instagram", title: "Instagram分割", description: "Instagramカルーセルやグリッド投稿用に写真を分割。" },
      { slug: "/", title: "画像分割ツール", description: "ドラッグ＆ドロップの分割線で自由に分割。" },
    ],
  },

  "image-cutter": {
    slug: "image-cutter",
    category: "use-case",
    seo: {
      title: "オンライン画像カッター — 無料カッティングツール | ImgSplit",
      description: "無料のオンライン画像カッター — ドラッグ＆ドロップでカット線を配置し、即座にダウンロード。アップロード不要、100%ブラウザ処理。",
      ogTitle: "オンライン画像カッター — 無料ツール",
      ogDescription: "画像を正確にカット。ドラッグ＆ドロップ操作、無料・ブラウザベース。",
    },
    hero: {
      overline: "画像カッティングツール",
      headlinePart1: "画像",
      headlineAccent: "カッター",
      headlinePart2: "— 正確にカット",
      description: "ドラッグ＆ドロップのカット線で任意の画像を精確に分割。ピクセルレベルの精度、スナップ整列、即時ダウンロード。",
    },
    scenarios: [
      { icon: "Scissors", title: "Webデザインのアセット切り出し", description: "デザインモックアップをヘッダー、ボタン、アイコンなどの個別アセットに切り出し。" },
      { icon: "Mail", title: "メールテンプレートのスライス", description: "メールデザインを最適化された画像セクションに分割し、HTMLメールを完璧に表示。" },
      { icon: "FileImage", title: "ドキュメント領域の抽出", description: "スキャン文書やスクリーンショットから特定の領域を正確に抽出。" },
    ],
    howToSteps: [
      { stepNumber: 1, title: "画像をアップロード", description: "PNG、JPG、WebP画像をドラッグ＆ドロップまたはクリックでアップロード。" },
      { stepNumber: 2, title: "カット線を配置", description: "水平・垂直のカット線を追加し、カット位置を正確に定義。" },
      { stepNumber: 3, title: "カット結果をダウンロード", description: "各パーツをプレビューし、ZIPで一括ダウンロードまたは個別保存。" },
    ],
    faqEntries: [
      { question: "カットとクロップの違いは？", answer: "クロップは画像の一部だけ残す操作。カットは画像全体を複数パーツに分割 — すべてのピクセルがいずれかのパーツに保存されます。" },
      { question: "カット線の精度は？", answer: "カット線はピクセル境界にスナップし、単一ピクセル精度での配置が可能です。" },
      { question: "画像サイズの上限は？", answer: "20MBまでのファイルに対応。ピクセル数の制限はありません。" },
    ],
    relatedTools: [
      { slug: "/no-photoshop-slicer", title: "Photoshop不要スライサー", description: "Photoshopのスライスツールの無料代替。" },
      { slug: "/split-horizontally", title: "水平分割", description: "画像を水平方向の行やストリップに分割。" },
      { slug: "/split-vertically", title: "垂直分割", description: "画像を垂直方向の列に分割。" },
      { slug: "/", title: "画像分割ツール", description: "ドラッグ＆ドロップの分割線で自由にカット。" },
    ],
  },

  "grid-maker": {
    slug: "grid-maker",
    category: "use-case",
    seo: {
      title: "画像グリッドメーカー — 無料オンライングリッド生成 | ImgSplit",
      description: "無料のオンライン画像グリッドメーカー — 2x2、3x3、4x4またはカスタムグリッドを作成。SNS、ムードボードに最適。ブラウザベース。",
      ogTitle: "画像グリッドメーカー — 無料オンラインツール",
      ogDescription: "SNS、ムードボードなどに最適な画像グリッドを作成。無料・ブラウザベース。",
    },
    hero: {
      overline: "グリッド作成ツール",
      headlinePart1: "画像",
      headlineAccent: "グリッドメーカー",
      headlinePart2: "— 自由なレイアウト",
      description: "2x2、3x3、4x4 または任意のカスタムレイアウトで完璧なグリッドを作成。SNSプロフィール、ムードボード、ビジュアルストーリーテリングに最適。",
    },
    scenarios: [
      { icon: "LayoutGrid", title: "SNSグリッドプロフィール", description: "SNSプロフィールを統一感のあるビジュアルギャラリーに変える、美しいグリッドレイアウトを作成。" },
      { icon: "Palette", title: "ムードボード＆インスピレーション", description: "リファレンス画像をグリッドに分割し、デザインムードボードやカラーパレットの探索に活用。" },
      { icon: "Presentation", title: "プレゼンテーション素材", description: "インフォグラフィックやデータ可視化をグリッドベースのビジュアルに分割。" },
    ],
    howToSteps: [
      { stepNumber: 1, title: "画像をアップロード", description: "グリッドに分割したい画像をアップロード。PNG、JPG、WebP対応。" },
      { stepNumber: 2, title: "グリッドを定義", description: "等間隔の水平・垂直線を追加し、2x2、3x3などの希望するレイアウトを作成。" },
      { stepNumber: 3, title: "グリッドタイルをダウンロード", description: "すべてのタイルをプレビューし、ZIPでダウンロード。タイルは順番に番号付け。" },
    ],
    faqEntries: [
      { question: "どんなサイズのグリッドが作れますか？", answer: "2x2から10x10以上まで、自由なサイズで作成可能。各方向最大20本の分割線。" },
      { question: "タイルは完全に均等ですか？", answer: "スナップ整列機能で分割線を等間隔に自動配置し、完全に均等なタイルを作成できます。" },
      { question: "Instagramに最適なグリッドは？", answer: "1x3グリッドはカルーセル投稿に最適。3x3グリッドはプロフィールページで圧巻のモザイク効果を演出。" },
    ],
    relatedTools: [
      { slug: "/grid", title: "グリッド分割", description: "プリセットグリッド：3×3、1×3、2×2 — SNS向けに最適化。" },
      { slug: "/split-for-instagram", title: "Instagram分割", description: "Instagramカルーセルやグリッド投稿専用。" },
      { slug: "/split-into-equal-parts", title: "等分分割", description: "画像を完全に均等なセグメントに分割。" },
      { slug: "/split-for-wechat", title: "SNSグリッド", description: "SNSプロフィール用のグリッドタイルに分割。" },
    ],
  },

  "compress-image": {
    slug: "compress-image",
    category: "use-case",
    seo: {
      title: "オンライン画像圧縮 — 無料＆プライバシー安全 | ImgSplit",
      description: "無料で画像をオンライン圧縮 — 視覚品質を維持しながらファイルサイズを縮小。ブラウザ処理、サーバーへのアップロード不要、JPEG・PNG・WebP対応。",
      ogTitle: "オンライン画像圧縮 — 無料＆プライバシー安全",
      ogDescription: "ブラウザで画像ファイルサイズを即座に縮小。無料・プライバシー安全・アップロード不要。",
    },
    hero: {
      overline: "画像圧縮ツール",
      headlinePart1: "画像を",
      headlineAccent: "圧縮",
      headlinePart2: "— 即座に",
      description: "目に見える品質低下なしに画像ファイルサイズを縮小。JPEG・PNG・WebP対応 — すべてブラウザ内で処理、データはデバイスから外に出ません。",
    },
    scenarios: [
      {
        icon: "Globe",
        title: "Web最適化",
        description: "Webサイトにアップロードする前に画像を圧縮 — ページ読み込み高速化、Core Web Vitals向上、SEOランキング改善を視覚品質を犠牲にせずに実現。",
      },
      {
        icon: "Mail",
        title: "メール添付ファイル",
        description: "画像添付ファイルを圧縮してメールのサイズ制限に対応。写真の見た目を保ちながら10MBや25MBの添付上限に収めます。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "画像をアップロード", description: "圧縮したいJPEG、PNG、またはWebP画像をドラッグ＆ドロップまたはクリックでアップロード。" },
      { stepNumber: 2, title: "品質を調整", description: "品質スライダーでファイルサイズと視覚品質のバランスを調整。ダウンロード前にリアルタイムでプレビュー。" },
      { stepNumber: 3, title: "圧縮ファイルをダウンロード", description: "最適化された画像をダウンロード — ファイルサイズが小さくなり、同じ素晴らしい見た目を維持。圧縮前後のサイズを即座に比較。" },
    ],
    faqEntries: [
      { question: "画像を圧縮すると品質は低下しますか？", answer: "圧縮は冗長なデータを除去してファイルサイズを縮小します。品質設定70%以上では、視覚的な差異は通常肉眼では認識できません。" },
      { question: "どの画像フォーマットを圧縮できますか？", answer: "JPEG、PNG、WebP画像を圧縮できます。最大限の圧縮には、サイズ対品質比で最優秀なWebPフォーマットへの変換がおすすめです。" },
      { question: "アップロードのファイルサイズ制限はありますか？", answer: "最大20MBの画像をアップロードできます。すべてブラウザ内で処理するため、大きなファイルは少し時間がかかる場合があります。" },
    ],
    relatedTools: [
      { slug: "/compress-jpeg", title: "JPEG圧縮", description: "品質コントロール付きの専用JPEG圧縮。" },
      { slug: "/png-to-webp", title: "PNGからWebP", description: "PNGをWebPに変換して最大限の圧縮を実現。" },
      { slug: "/resize", title: "画像リサイズ", description: "画像を正確なサイズやパーセンテージでリサイズ。" },
      { slug: "/", title: "画像分割ツール", description: "ドラッグ＆ドロップの分割線で画像を分割。" },
    ],
  },

  "compress-jpeg": {
    slug: "compress-jpeg",
    category: "use-case",
    seo: {
      title: "オンラインJPEG圧縮 — JPGファイルサイズ縮小 | ImgSplit",
      description: "JPEGおよびJPG画像を無料でオンライン圧縮。調整可能な品質設定でファイルサイズを縮小。ブラウザ処理、プライバシー安全、サーバーアップロード不要。",
      ogTitle: "オンラインJPEG圧縮 — JPGファイルサイズ縮小",
      ogDescription: "調整可能な品質でJPEGファイルサイズを縮小。無料・プライバシー安全・ブラウザベース。",
    },
    hero: {
      overline: "JPEG圧縮",
      headlinePart1: "JPEGを",
      headlineAccent: "圧縮",
      headlinePart2: "— サイズ縮小",
      description: "きめ細かい品質コントロールでJPEGおよびJPGファイルサイズを縮小。写真家、ブロガー、Web開発者に最適 — 目に見える品質低下なしにファイルを小さくします。",
    },
    scenarios: [
      {
        icon: "Camera",
        title: "写真ワークフロー",
        description: "カメラの高解像度JPEG写真をWebギャラリー、クライアント確認用、SNS用に圧縮 — 10MBのファイルを1MB以下に縮小しながらディテールを維持。",
      },
      {
        icon: "Globe",
        title: "ブログ画像",
        description: "ブログ記事のJPEG画像を最適化。読み込み速度の向上は読者のエンゲージメント向上と検索エンジンランキングの改善につながります。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "JPEGをアップロード", description: "圧縮したいJPEG/JPGファイルをドラッグ＆ドロップまたは選択。" },
      { stepNumber: 2, title: "品質レベルを設定", description: "品質スライダーを調整 — 低い値ほどファイルが小さくなります。出力をプレビューしてサイズと品質の最適なバランスを見つけてください。" },
      { stepNumber: 3, title: "圧縮JPEGをダウンロード", description: "圧縮されたJPEGを保存。ファイルサイズがどれだけ節約されたかを確認できます。" },
    ],
    faqEntries: [
      { question: "JPEG圧縮の最適な品質設定は？", answer: "Web用途では75-85%の品質が最適なバランス — 通常60-80%のファイルサイズ削減で視覚的な差異は最小限。印刷用には90%以上を維持してください。" },
      { question: "JPEGを複数回圧縮できますか？", answer: "可能ですが、再圧縮のたびに微細なアーティファクトが発生します。最良の結果を得るには、既に圧縮されたJPEGではなく、常にオリジナルファイルから圧縮してください。" },
      { question: "JPEGとJPGの違いは何ですか？", answer: "違いはありません — JPGとJPEGは同じフォーマットを指します。短い「.jpg」拡張子は、拡張子を3文字に制限していたWindowsで一般的になりました。" },
    ],
    relatedTools: [
      { slug: "/compress-image", title: "画像圧縮", description: "あらゆるフォーマットに対応する汎用画像圧縮。" },
      { slug: "/jpg-to-webp", title: "JPGからWebP", description: "JPEGをWebPに変換してさらに小さなファイルサイズに。" },
      { slug: "/reduce-image-size", title: "画像サイズ縮小", description: "あらゆる画像を最小ファイルサイズに最適化。" },
    ],
  },

  "compress-png": {
    slug: "compress-png",
    category: "use-case",
    seo: {
      title: "オンラインPNG圧縮 — PNGファイルサイズ縮小 | ImgSplit",
      description: "透明度を保持しながらPNG画像をオンライン圧縮。ロスレスまたはロッシー圧縮でファイルサイズを縮小。無料・ブラウザ処理・サーバーアップロード不要。",
      ogTitle: "オンラインPNG圧縮 — PNGファイルサイズ縮小",
      ogDescription: "透明度を保ちながらPNGファイルサイズを縮小。無料・プライバシー安全・ブラウザベース。",
    },
    hero: {
      overline: "PNG圧縮",
      headlinePart1: "PNGを",
      headlineAccent: "圧縮",
      headlinePart2: "— 透明度維持",
      description: "透明度サポートを完全に保持しながらPNGファイルサイズを縮小。UIスクリーンショット、デザインアセット、アルファチャンネルが必要なグラフィックに最適。",
    },
    scenarios: [
      {
        icon: "Smartphone",
        title: "UIスクリーンショット",
        description: "デザインツールやスクリーンキャプチャからのPNGスクリーンショットを圧縮。ドキュメント、バグレポート、デザインレビューでの読み込みを高速化。",
      },
      {
        icon: "Layers",
        title: "デザインアセット",
        description: "PNGデザインアセット — アイコン、ロゴ、UI要素 — をWebおよびアプリ開発用に最適化しながら、鮮明なエッジと透明度を維持。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "PNGをアップロード", description: "圧縮したいPNGファイルをドラッグ＆ドロップまたは選択。透明度は完全に保持されます。" },
      { stepNumber: 2, title: "PNGを最適化", description: "出力をPNGのままにします。ImgSplitは画像をロスレスで再エンコードし、再エンコードで大きくなる場合は元ファイルを保持します。" },
      { stepNumber: 3, title: "最適化PNGをダウンロード", description: "圧縮されたPNGを保存。透明度、色深度、視覚品質が維持されます。" },
    ],
    faqEntries: [
      { question: "圧縮でPNGの透明度は失われますか？", answer: "いいえ。圧縮プロセスはアルファチャンネルを完全に保持します。透明な背景はそのまま維持されます。" },
      { question: "なぜPNGファイルはJPEGより大きいのですか？", answer: "PNGはロスレス圧縮を使用して各ピクセルを正確に保持し、さらに透明度データも保存します。透明度が不要な写真には、JPEGやWebPへの変換でより小さなファイルが得られます。" },
      { question: "圧縮するよりWebPに変換すべきですか？", answer: "最大限のサイズ削減が必要でプラットフォームがWebPをサポートしている場合、WebPへの変換で透明度を保ちながらファイルサイズを50-80%削減できます。" },
    ],
    relatedTools: [
      { slug: "/png-to-webp", title: "PNGからWebP", description: "PNGをWebPに変換して透明度付きで劇的に小さなファイルに。" },
      { slug: "/png-to-jpg", title: "PNGからJPG", description: "透明度が不要な場合にPNGをJPEGに変換して小さなファイルに。" },
      { slug: "/compress-image", title: "画像圧縮", description: "あらゆるフォーマットに対応する汎用画像圧縮。" },
    ],
  },

  "png-to-webp": {
    slug: "png-to-webp",
    category: "use-case",
    seo: {
      title: "PNGからWebPに変換 — 無料＆高速 | ImgSplit",
      description: "PNG画像をWebPフォーマットに変換して劇的にファイルサイズを縮小。透明度を保持。無料ブラウザベースコンバーター、サーバーアップロード不要。",
      ogTitle: "PNGからWebP変換 — 無料オンラインコンバーター",
      ogDescription: "PNGをWebPに変換して透明度付きで小さなファイルに。無料・ブラウザベース。",
    },
    hero: {
      overline: "PNGからWebPコンバーター",
      headlinePart1: "PNGを",
      headlineAccent: "WebP",
      headlinePart2: "に変換 — より小さなファイル",
      description: "PNG画像をWebPフォーマットに変換し、透明度を保持しながら最大80%のファイルサイズ削減を実現。より高速なWebサイトとアプリのための最新画像フォーマット。",
    },
    scenarios: [
      {
        icon: "Zap",
        title: "Webサイトパフォーマンス",
        description: "サイトのPNGアセットをWebPに切り替え — ページ読み込みが高速化、帯域幅が削減、Core Web Vitalsが向上。主要ブラウザはWebPをネイティブサポート。",
      },
      {
        icon: "Smartphone",
        title: "アプリアセット",
        description: "アプリアイコン、UI要素、グラフィックをPNGからWebPに変換。アセットが小さくなりインストール高速化、読み込み迅速化、ストレージ使用量削減を実現。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "PNGをアップロード", description: "WebPフォーマットに変換したいPNG画像をドラッグ＆ドロップまたは選択。" },
      { stepNumber: 2, title: "出力を設定", description: "WebP出力の品質設定を調整。高品質ほどファイルが大きくなります — プレビューで最適なバランスを見つけてください。" },
      { stepNumber: 3, title: "WebPファイルをダウンロード", description: "変換されたWebP画像を保存。ファイルサイズを比較して劇的な削減を確認してください。" },
    ],
    faqEntries: [
      { question: "WebPはPNGのような透明度をサポートしますか？", answer: "はい。WebPはアルファ透明度を完全にサポートし、ほとんどのユースケースでPNGの優れた代替となります — 大幅に小さなファイルサイズで。" },
      { question: "どのブラウザがWebPをサポートしていますか？", answer: "すべての主要ブラウザがWebPをサポート：Chrome、Firefox、Safari、Edge、Opera。Internet Explorerと非常に古いブラウザバージョンのみ非対応です。" },
      { question: "WebPはPNGと比べてどのくらい小さいですか？", answer: "WebPファイルは通常、同等のPNGファイルより50-80%小さくなります。正確な節約は画像の内容によりますが、削減は常に劇的です。" },
    ],
    relatedTools: [
      { slug: "/png-to-jpg", title: "PNGからJPG", description: "透明度が不要な場合にPNGをJPEGに変換。" },
      { slug: "/jpg-to-webp", title: "JPGからWebP", description: "JPEG画像を最新のWebPフォーマットに変換。" },
      { slug: "/compress-png", title: "PNG圧縮", description: "PNGフォーマットを維持しながらファイルサイズを縮小。" },
    ],
  },

  "png-to-jpg": {
    slug: "png-to-jpg",
    category: "use-case",
    seo: {
      title: "PNGからJPGに変換 — 無料オンラインコンバーター | ImgSplit",
      description: "PNG画像を無料でJPGフォーマットにオンライン変換。透明度を除去してファイルサイズを縮小。ブラウザ処理、プライバシー安全、サーバーアップロード不要。",
      ogTitle: "PNGからJPG変換 — 無料オンラインコンバーター",
      ogDescription: "PNGをJPGに変換して透明度を除去しファイルサイズを縮小。無料・ブラウザベース。",
    },
    hero: {
      overline: "PNGからJPGコンバーター",
      headlinePart1: "PNGを",
      headlineAccent: "JPG",
      headlinePart2: "に変換 — 透明度を除去",
      description: "PNG画像をJPGフォーマットに変換してファイルサイズを縮小し、ユニバーサルな互換性を実現。透明部分はお好みの背景色で塗りつぶされます。",
    },
    scenarios: [
      {
        icon: "Globe",
        title: "SNS投稿",
        description: "PNGスクリーンショットやグラフィックをJPGに変換してSNSプラットフォーム用に。PNGの過度な圧縮を回避し、クリーンなJPGをアップロードして予測可能な品質を確保。",
      },
      {
        icon: "Mail",
        title: "文書共有",
        description: "PNGグラフィックをJPGに変換してメール添付、プレゼンテーション、文書用に。JPGファイルは小さく、あらゆるデバイスで閲覧可能。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "PNGをアップロード", description: "JPGフォーマットに変換したいPNGファイルをドラッグ＆ドロップまたは選択。" },
      { stepNumber: 2, title: "背景色と品質を設定", description: "透明部分の背景色を選択（デフォルト：白）し、JPEG品質レベルを設定。" },
      { stepNumber: 3, title: "JPGファイルをダウンロード", description: "変換されたJPG画像を保存。透明部分は選択した背景色で置き換えられます。" },
    ],
    faqEntries: [
      { question: "PNGの透明部分はどうなりますか？", answer: "透明部分は単色の背景色 — デフォルトでは白 — で塗りつぶされます。変換前にお好みの色を選択できます。" },
      { question: "PNGからJPGへの変換で画質は変わりますか？", answer: "JPEGはロッシー圧縮を使用するため、低い設定ではわずかな品質差が生じる場合があります。品質90%以上では違いはほぼ目に見えません。" },
      { question: "JPGに変換せずPNGのまま維持すべき場合は？", answer: "透明度が必要な場合、テキストや線画のピクセルパーフェクトな精度が必要な場合、またはロスレス品質が必要な場合はPNGを維持。写真やファイルサイズの縮小が必要な場合はJPGに変換。" },
    ],
    relatedTools: [
      { slug: "/png-to-webp", title: "PNGからWebP", description: "最新ブラウザ向けにPNGをWebPに変換してさらに小さなファイルに。" },
      { slug: "/compress-jpeg", title: "JPEG圧縮", description: "変換後にJPEGファイルサイズをさらに縮小。" },
      { slug: "/jpg-to-png", title: "JPGからPNG", description: "ロスレス品質が必要な場合にJPGをPNGに戻す。" },
    ],
  },

  "jpg-to-png": {
    slug: "jpg-to-png",
    category: "use-case",
    seo: {
      title: "JPGからPNGに変換 — 無料オンラインコンバーター | ImgSplit",
      description: "JPGおよびJPEG画像を無料でPNGフォーマットに変換してロスレス品質を実現。ブラウザベースコンバーター、サーバーアップロード不要、即座にダウンロード。",
      ogTitle: "JPGからPNG変換 — 無料オンラインコンバーター",
      ogDescription: "JPEGをPNGに変換してロスレス品質を実現。無料・プライバシー安全・ブラウザベース。",
    },
    hero: {
      overline: "JPGからPNGコンバーター",
      headlinePart1: "JPGを",
      headlineAccent: "PNG",
      headlinePart2: "に変換 — ロスレス品質",
      description: "JPEG画像をPNGフォーマットに変換してロスレス品質と透明度サポートを実現。デザイン作業、編集、ピクセルパーフェクトな出力が必要なワークフローに最適。",
    },
    scenarios: [
      {
        icon: "Layers",
        title: "デザインワーク",
        description: "写真をPNGに変換してデザインプロジェクトに活用 — レイヤー合成、オーバーレイ、モックアップにはPNGのロスレス品質と透明度サポートが最適。",
      },
      {
        icon: "Shield",
        title: "透明度が必要な場合",
        description: "写真に透明度を追加する必要がある場合、まずPNGに変換し、デザインツールでアルファチャンネルを編集してクリーンな切り抜きやオーバーレイを実現。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "JPGをアップロード", description: "PNGフォーマットに変換したいJPG/JPEGファイルをドラッグ＆ドロップまたは選択。" },
      { stepNumber: 2, title: "結果をプレビュー", description: "PNGプレビューを確認。変換はオリジナルJPEGの全視覚コンテンツをフル品質で保持します。" },
      { stepNumber: 3, title: "PNGファイルをダウンロード", description: "ロスレスPNG画像を保存。ファイルはオリジナルJPEGより大きくなりますが、追加の圧縮アーティファクトはゼロです。" },
    ],
    faqEntries: [
      { question: "JPGからPNGへの変換で画質は向上しますか？", answer: "PNGへの変換はさらなる品質低下を防ぎますが、オリジナルのJPEG圧縮で失われたディテールを復元することはできません。変換されたPNGはJPEGの現在の状態を完璧に保持します。" },
      { question: "なぜPNGファイルはオリジナルJPGより大きいのですか？", answer: "PNGはロスレス圧縮を使用して各ピクセルを正確に保持するため、ファイルが大きくなります。JPEGはロッシー圧縮を使用し、一部のデータを破棄して小さなサイズを実現します。" },
      { question: "PNGに変換後、透明度を追加できますか？", answer: "はい。PNGフォーマットになれば、任意のデザインツール（Photoshop、GIMP、Figma）でアルファチャンネルを編集して透明度を追加できます — JPEGでは不可能な操作です。" },
    ],
    relatedTools: [
      { slug: "/jpg-to-webp", title: "JPGからWebP", description: "JPEGをWebPに変換して最新の圧縮で小さなファイルに。" },
      { slug: "/compress-png", title: "PNG圧縮", description: "変換後にPNGファイルサイズを縮小。" },
      { slug: "/png-to-jpg", title: "PNGからJPG", description: "ファイルサイズが小さい方が必要な場合にJPGに戻す。" },
    ],
  },

  "jpg-to-webp": {
    slug: "jpg-to-webp",
    category: "use-case",
    seo: {
      title: "JPGからWebPに変換 — 最新フォーマット | ImgSplit",
      description: "JPGおよびJPEG画像をWebPフォーマットに変換して最大限の圧縮を実現。最大80%のサイズ削減。無料ブラウザベースコンバーター、サーバーアップロード不要。",
      ogTitle: "JPGからWebP変換 — 最新フォーマットコンバーター",
      ogDescription: "JPEGをWebPに変換して最大80%のサイズ削減。無料・プライバシー安全・ブラウザベース。",
    },
    hero: {
      overline: "JPGからWebPコンバーター",
      headlinePart1: "JPGを",
      headlineAccent: "WebP",
      headlinePart2: "に変換 — 最大圧縮",
      description: "JPEG画像を最新のWebPフォーマットに変換して劇的にファイルサイズを縮小。同等の視覚品質で最大80%のサイズ削減 — Webパフォーマンスのための賢い選択。",
    },
    scenarios: [
      {
        icon: "RefreshCw",
        title: "Webサイト移行",
        description: "パフォーマンス改善の一環としてサイトのJPEG画像をWebPに一括変換。ページ読み込み高速化、ホスティングコスト削減、Google PageSpeedスコア向上を実現。",
      },
      {
        icon: "Zap",
        title: "パフォーマンス最適化",
        description: "重いJPEGのヒーロー画像や商品写真をWebP版に置き換え。訪問者は同じビジュアル体験を得ながら、ダウンロード時間はごくわずかに。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "JPGをアップロード", description: "WebPに変換したいJPEGファイルをドラッグ＆ドロップまたは選択。" },
      { stepNumber: 2, title: "WebP品質を調整", description: "品質設定を微調整。品質80%でもWebPファイルは同等のJPEGより劇的に小さくなります。" },
      { stepNumber: 3, title: "WebPファイルをダウンロード", description: "WebP画像を保存してファイルサイズの節約を比較。ほとんどのユーザーが50-80%の削減を確認できます。" },
    ],
    faqEntries: [
      { question: "WebPはJPEGと比べてどのくらい小さいですか？", answer: "WebPは同等の視覚品質でJPEGより通常25-34%小さくなります（Googleの研究によると）。多くの画像で50%以上の節約を実現します。" },
      { question: "WebPはどこでもサポートされていますか？", answer: "はい。すべての主要ブラウザ（Chrome、Firefox、Safari 14以降、Edge）がWebPをサポートしています。まれなレガシーブラウザには、HTML <picture>要素でJPEGをフォールバックとして提供できます。" },
      { question: "JPEGからWebPへの変換で品質は低下しますか？", answer: "JPEGとWebPはどちらもロッシーフォーマットのため、再エンコードで最小限の追加アーティファクトが生じます。最良の結果を得るには、お持ちの最高品質のJPEGソースから変換してください。" },
    ],
    relatedTools: [
      { slug: "/png-to-webp", title: "PNGからWebP", description: "PNG画像を透明度サポート付きでWebPに変換。" },
      { slug: "/compress-jpeg", title: "JPEG圧縮", description: "JPEGフォーマットを維持しながらファイルサイズを縮小。" },
      { slug: "/jpg-to-png", title: "JPGからPNG", description: "JPEGをロスレスPNGフォーマットに変換。" },
    ],
  },

  "webp-to-png": {
    slug: "webp-to-png",
    category: "use-case",
    seo: {
      title: "WebPからPNGに変換 — 無料オンラインコンバーター | ImgSplit",
      description: "WebP画像をPNGフォーマットに変換してユニバーサルな互換性を実現。透明度を保持。無料ブラウザベースコンバーター、サーバーアップロード不要。",
      ogTitle: "WebPからPNG変換 — 無料オンラインコンバーター",
      ogDescription: "WebPをPNGに変換してユニバーサルな互換性を実現。無料・プライバシー安全・ブラウザベース。",
    },
    hero: {
      overline: "WebPからPNGコンバーター",
      headlinePart1: "WebPを",
      headlineAccent: "PNG",
      headlinePart2: "に変換 — ユニバーサルフォーマット",
      description: "WebP画像をPNGに変換して、WebPに未対応の旧ソフトウェア、印刷ワークフロー、デザインツールとの最大限の互換性を確保。",
    },
    scenarios: [
      {
        icon: "ArrowRightLeft",
        title: "互換性のニーズ",
        description: "WebP画像をダウンロードしたがソフトウェアが対応していない？PNGに変換すればPhotoshop、PowerPoint、Wordなどすべてのツールで即座に互換性を確保。",
      },
      {
        icon: "Image",
        title: "レガシーツールでの編集",
        description: "古い画像エディターやデザインツールはWebPファイルを開けない場合があります。まずPNGに変換して編集し、必要に応じて後で変換し直してください。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "WebPをアップロード", description: "PNGフォーマットに変換したいWebP画像をドラッグ＆ドロップまたは選択。" },
      { stepNumber: 2, title: "変換をプレビュー", description: "PNGプレビューを確認。WebPファイルの全視覚コンテンツと透明度が完璧に保持されます。" },
      { stepNumber: 3, title: "PNGファイルをダウンロード", description: "PNG画像を保存 — 事実上すべての画像ビューア、エディター、プラットフォームと互換性があります。" },
    ],
    faqEntries: [
      { question: "WebPからPNGへの変換で品質は低下しますか？", answer: "変換で品質は失われません。PNGはロスレスフォーマットのため、WebPソースの全ピクセルが正確に保持されます。PNGはWebPほど積極的に圧縮しないためファイルサイズは大きくなります。" },
      { question: "WebPからPNGへの変換で透明度は保持されますか？", answer: "はい。WebPとPNGの両方がアルファ透明度をサポートしています。WebP画像の透明部分はPNG出力で完璧に保持されます。" },
      { question: "JPGではなくPNGに変換すべき理由は？", answer: "透明度サポートやロスレス品質が必要な場合はPNGを選択。最小のファイルサイズが必要で透明度が不要な場合はJPGを選択。" },
    ],
    relatedTools: [
      { slug: "/webp-to-jpg", title: "WebPからJPG", description: "透明度なしでWebPをJPGに変換して小さなファイルに。" },
      { slug: "/compress-png", title: "PNG圧縮", description: "変換後にPNGファイルサイズを縮小。" },
      { slug: "/png-to-webp", title: "PNGからWebP", description: "ファイルサイズが小さい方が必要な場合にWebPに戻す。" },
    ],
  },

  "webp-to-jpg": {
    slug: "webp-to-jpg",
    category: "use-case",
    seo: {
      title: "WebPからJPGに変換 — 無料オンラインコンバーター | ImgSplit",
      description: "WebP画像をJPGフォーマットに変換して最大限の互換性を実現。無料ブラウザベースコンバーター、サーバーアップロード不要、即座にダウンロード。",
      ogTitle: "WebPからJPG変換 — 無料オンラインコンバーター",
      ogDescription: "WebPをJPGに変換して最大限の互換性を実現。無料・プライバシー安全・ブラウザベース。",
    },
    hero: {
      overline: "WebPからJPGコンバーター",
      headlinePart1: "WebPを",
      headlineAccent: "JPG",
      headlinePart2: "に変換 — 最大互換性",
      description: "WebP画像をユニバーサルにサポートされるJPGフォーマットに変換。共有、印刷、あらゆるソフトウェアやプラットフォームでの使用に最適 — 互換性の心配なし。",
    },
    scenarios: [
      {
        icon: "Mail",
        title: "他者との共有",
        description: "すべてのデバイスがWebPに対応しているわけではありません。メール、メッセージアプリ、ファイル転送で共有する前にJPGに変換すれば、誰でも画像を開けます。",
      },
      {
        icon: "FileDown",
        title: "印刷準備",
        description: "ほとんどの印刷業者やオンデマンド印刷サービスはJPGファイルを期待しています。WebP画像をJPGに変換して、手間なく予測可能な色出力で印刷できます。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "WebPをアップロード", description: "JPGフォーマットに変換したいWebP画像をドラッグ＆ドロップまたは選択。" },
      { stepNumber: 2, title: "JPG品質を設定", description: "品質スライダーを調整。透明部分はお好みの背景色（デフォルト：白）で塗りつぶされます。" },
      { stepNumber: 3, title: "JPGファイルをダウンロード", description: "JPG画像を保存 — 共有、印刷、あらゆるアプリケーションですぐに使えます。" },
    ],
    faqEntries: [
      { question: "WebPからJPGへの変換で透明度はどうなりますか？", answer: "JPGは透明度をサポートしていません。WebP画像の透明部分は単色の背景色 — デフォルトでは白 — で塗りつぶされます。変換前に別の色を選択できます。" },
      { question: "JPGは最も互換性の高い画像フォーマットですか？", answer: "はい。JPG/JPEGは事実上すべてのデバイス、ブラウザ、メールクライアント、ソフトウェアでサポートされています。互換性を最優先する場合、最も安全な選択です。" },
      { question: "WebPからJPGへの変換でファイルサイズは増加しますか？", answer: "通常は増加します。WebPはJPGより優れた圧縮を提供するためです。ただし、JPGの品質設定を調整してファイルサイズと視覚品質の適切なバランスを見つけることができます。" },
    ],
    relatedTools: [
      { slug: "/webp-to-png", title: "WebPからPNG", description: "透明度とロスレス品質が必要な場合にWebPをPNGに変換。" },
      { slug: "/compress-jpeg", title: "JPEG圧縮", description: "変換後にJPEGファイルサイズをさらに縮小。" },
      { slug: "/jpg-to-webp", title: "JPGからWebP", description: "ファイルサイズが小さい方が必要な場合にWebPに戻す。" },
    ],
  },

  "reduce-image-size": {
    slug: "reduce-image-size",
    category: "use-case",
    seo: {
      title: "画像サイズ縮小 — 無料ファイルオプティマイザー | ImgSplit",
      description: "無料で画像ファイルサイズをオンライン縮小。JPEG、PNG、WebP画像をWeb、メール、ストレージ用に最適化。ブラウザ処理、プライバシー安全、サーバーアップロード不要。",
      ogTitle: "画像サイズ縮小 — 無料オンラインオプティマイザー",
      ogDescription: "画像ファイルサイズを即座に最適化・縮小。無料・プライバシー安全・ブラウザベース。",
    },
    hero: {
      overline: "画像サイズ縮小",
      headlinePart1: "画像",
      headlineAccent: "サイズ",
      headlinePart2: "を縮小 — 即座に最適化",
      description: "あらゆる画像を最小限のファイルサイズに最適化。JPEG、PNG、WebPのインテリジェント圧縮 — より高速なWebサイト、より少ないストレージ、より素早いアップロードに最適。",
    },
    scenarios: [
      {
        icon: "Zap",
        title: "Webサイト高速化",
        description: "大きな画像はWebサイトが遅い原因の第1位。画像サイズを縮小してページ読み込み時間、直帰率、検索エンジンランキングを劇的に改善。",
      },
      {
        icon: "FileDown",
        title: "ストレージ最適化",
        description: "クラウドストレージやデバイスの容量が不足？写真ライブラリ全体の画像サイズを縮小して、画像を削除せずにギガバイト単位のスペースを解放。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "画像をアップロード", description: "小さくしたいJPEG、PNG、またはWebP画像をドラッグ＆ドロップまたは選択。" },
      { stepNumber: 2, title: "設定を最適化", description: "圧縮品質を調整し、必要に応じて出力フォーマットを変更。WebPが通常最も効果的なサイズ削減を提供します。" },
      { stepNumber: 3, title: "最適化画像をダウンロード", description: "小さくなった画像ファイルを保存。ツールは正確な節約バイト数と削減率を表示します。" },
    ],
    faqEntries: [
      { question: "画像ファイルサイズを縮小する最良の方法は？", answer: "3つの戦略が最も効果的：品質調整による圧縮（最速）、WebPフォーマットへの変換（最も効果的）、またはより小さな寸法へのリサイズ（最も積極的）。3つすべてを組み合わせると最小のファイルが得られます。" },
      { question: "画像ファイルサイズはどのくらい縮小できますか？", answer: "ソース画像と設定に応じて通常40-80%の削減が可能。5MBのJPEGを品質80のWebPに変換すると500KBのファイルを簡単に生成できます。" },
      { question: "ファイルサイズの縮小は印刷品質に影響しますか？", answer: "Webおよびスクリーン用途では、適切に圧縮された画像はオリジナルと見分けがつきません。プロフェッショナル印刷用には品質を90%以上に保ち、過度な圧縮を避けてください。" },
    ],
    relatedTools: [
      { slug: "/compress-image", title: "画像圧縮", description: "フォーマット選択付きの汎用画像圧縮。" },
      { slug: "/compress-jpeg", title: "JPEG圧縮", description: "JPEG写真専用の圧縮。" },
      { slug: "/png-to-webp", title: "PNGからWebP", description: "最良の圧縮率のためにWebPに変換。" },
    ],
  },

  "crop-image": {
    slug: "crop-image",
    category: "use-case",
    seo: { title: "画像をオンラインでトリミング — 無料SNSクロップツール | ImgSplit", description: "Instagram、YouTube、Facebook、X、LinkedIn向けの正確なサイズで画像をトリミング。無料、プライベート、ブラウザ内処理。", ogTitle: "画像をオンラインでトリミング", ogDescription: "アップロード不要でSNSサイズにトリミング。" },
    hero: { overline: "画像トリミングツール", headlinePart1: "画像を", headlineAccent: "トリミング", headlinePart2: "正確なサイズ", description: "任意の画像をSNS向けの正確なサイズにリサイズしてトリミング。プリセットを選び、位置を調整し、ローカルで書き出せます。" },
    scenarios: [
      { icon: "Crop", title: "正確な比率", description: "正方形、縦長、ワイドの比率を固定して、投稿前にプラットフォーム要件に合わせられます。" },
      { icon: "Smartphone", title: "SNS対応", description: "Instagram投稿・ストーリー、YouTubeサムネイル、Facebookカバー、X、LinkedInのプリセットを利用できます。" },
    ],
    howToSteps: [
      { stepNumber: 1, title: "画像をアップロード", description: "Resizeのクロッププリセットを開き、PNG、JPEG、WebP画像を追加します。" },
      { stepNumber: 2, title: "プリセットを選択", description: "SNSサイズまたは手動比率を選び、クロップ枠をドラッグします。" },
      { stepNumber: 3, title: "ダウンロード", description: "トリミングを適用し、PNG、JPEG、WebPで保存します。" },
    ],
    faqEntries: [
      { question: "これは別のクロップエディタですか？", answer: "いいえ。Resizeエディタ内のクロップワークフローとSNSプリセットです。" },
      { question: "画像はアップロードされますか？", answer: "いいえ。処理はブラウザ内で行われ、画像は端末に残ります。" },
      { question: "カスタムサイズも使えますか？", answer: "はい。キャンバス寸法、手動比率、画像位置を自由に調整できます。" },
    ],
    relatedTools: [
      { slug: "/resize", title: "画像リサイズ", description: "正確なサイズで画像をリサイズして書き出し。" },
      { slug: "/crop-for-instagram", title: "Instagram用トリミング", description: "正方形投稿を素早く作成。" },
      { slug: "/youtube-thumbnail-crop", title: "YouTubeサムネイル", description: "16:9サムネイルサイズにトリミング。" },
    ],
  },

  "crop-for-instagram": {
    slug: "crop-for-instagram",
    category: "use-case",
    seo: { title: "Instagram用画像トリミング — 無料1:1クロッパー | ImgSplit", description: "Instagram投稿サイズにオンラインでトリミング。1080 x 1080の正方形プリセット、ブラウザ内でプライベートに書き出し。", ogTitle: "Instagram用画像トリミング", ogDescription: "アップロード不要でInstagram正方形投稿を作成。" },
    hero: { overline: "Instagramクロップ", headlinePart1: "Instagram用に", headlineAccent: "トリミング", headlinePart2: "1:1投稿", description: "任意の画像から1080 x 1080のInstagram投稿クロップを作成。被写体を中央に配置して書き出せます。" },
    scenarios: [
      { icon: "Crop", title: "正方形フィード投稿", description: "横長や縦長の写真を、比率を迷わず1:1投稿に変換します。" },
      { icon: "Smartphone", title: "モバイル共有", description: "スマホや予約投稿ツールに送る前にブラウザで準備できます。" },
    ],
    howToSteps: [
      { stepNumber: 1, title: "写真をアップロード", description: "Instagram投稿プリセットから画像を追加します。" },
      { stepNumber: 2, title: "クロップを調整", description: "画像またはクロップ枠をドラッグして正方形に収めます。" },
      { stepNumber: 3, title: "ダウンロード", description: "トリミングを適用し、Instagramサイズの画像を保存します。" },
    ],
    faqEntries: [
      { question: "このプリセットのサイズは？", answer: "1080 x 1080ピクセル、1:1比率です。" },
      { question: "縦長投稿にも使えますか？", answer: "カスタム寸法はResizeで設定できます。9:16はStoryプリセットを使ってください。" },
      { question: "品質は下がりますか？", answer: "選択したキャンバスサイズで書き出します。Instagram投稿は1080 x 1080が目標サイズです。" },
    ],
    relatedTools: [
      { slug: "/instagram-story-crop", title: "Instagram Story", description: "9:16縦長画像を作成。" },
      { slug: "/resize", title: "画像リサイズ", description: "任意の寸法でリサイズとトリミング。" },
      { slug: "/compress-image", title: "画像圧縮", description: "共有前にファイルサイズを削減。" },
    ],
  },

  "instagram-story-crop": {
    slug: "instagram-story-crop",
    category: "use-case",
    seo: { title: "Instagram Storyトリミング — 無料9:16クロッパー | ImgSplit", description: "Instagram Storyサイズにオンラインでトリミング。1080 x 1920縦長プリセット、ブラウザ内編集、即時ダウンロード。", ogTitle: "Instagram Storyトリミング", ogDescription: "1080 x 1920プリセットで縦長Storyを作成。" },
    hero: { overline: "Instagram Storyクロップ", headlinePart1: "Instagram", headlineAccent: "Story", headlinePart2: "9:16縦長", description: "1080 x 1920プリセットで全画面Story素材を準備。画像位置を調整してプライベートに書き出せます。" },
    scenarios: [
      { icon: "Smartphone", title: "全画面Story", description: "横長や正方形画像を伸ばさずに縦長Story素材へ変換します。" },
      { icon: "Crop", title: "被写体を保持", description: "顔、商品、テキストが表示範囲に残るようにクロップを調整できます。" },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Storyプリセットを開く", description: "Resizeで1080 x 1920のInstagram Storyプリセットを使用します。" },
      { stepNumber: 2, title: "クロップを調整", description: "角をドラッグ、または画像を移動して重要部分を残します。" },
      { stepNumber: 3, title: "書き出し", description: "InstagramやReelsカバー向けの縦長画像をダウンロードします。" },
    ],
    faqEntries: [
      { question: "Storyのサイズは？", answer: "1080 x 1920ピクセル、9:16比率です。" },
      { question: "TikTokやReelsにも使えますか？", answer: "はい。9:16出力は多くの縦型SNSにも適しています。" },
      { question: "全体を表示できますか？", answer: "Fitモードを使うと、余白ありで全体を表示できます。" },
    ],
    relatedTools: [
      { slug: "/crop-for-instagram", title: "Instagram投稿", description: "正方形投稿を作成。" },
      { slug: "/resize", title: "画像リサイズ", description: "カスタム寸法で調整。" },
      { slug: "/jpg-to-webp", title: "JPGからWebP", description: "完成素材をWebPに変換。" },
    ],
  },

  "youtube-thumbnail-crop": {
    slug: "youtube-thumbnail-crop",
    category: "use-case",
    seo: { title: "YouTubeサムネイルトリミング — 無料1280x720クロッパー | ImgSplit", description: "YouTubeサムネイルサイズにオンラインでトリミング。1280 x 720の16:9プリセット、アップロード不要。", ogTitle: "YouTubeサムネイルトリミング", ogDescription: "ブラウザで1280 x 720サムネイルを作成。" },
    hero: { overline: "YouTubeサムネイルクロップ", headlinePart1: "YouTube", headlineAccent: "サムネイル", headlinePart2: "16:9", description: "任意の画像から1280 x 720のYouTubeサムネイルを作成。16:9プリセットで構図を決めて書き出せます。" },
    scenarios: [
      { icon: "Youtube", title: "サムネイル準備", description: "写真、スクリーンショット、アートワークを推奨サイズにトリミングします。" },
      { icon: "Crop", title: "構図コントロール", description: "顔、商品、タイトル領域を安全なフレーム内に保てます。" },
    ],
    howToSteps: [
      { stepNumber: 1, title: "画像をアップロード", description: "YouTubeサムネイルプリセットを開き、元画像を追加します。" },
      { stepNumber: 2, title: "構図を決める", description: "16:9クロップ枠でクリックされやすい構図を選びます。" },
      { stepNumber: 3, title: "ダウンロード", description: "1280 x 720のサムネイルをPNG、JPEG、WebPで書き出します。" },
    ],
    faqEntries: [
      { question: "プリセットサイズは？", answer: "1280 x 720ピクセル、16:9比率です。" },
      { question: "JPGで書き出せますか？", answer: "はい。JPEG、PNG、WebPでダウンロードできます。" },
      { question: "文字入れもできますか？", answer: "いいえ。このツールはトリミングとリサイズに集中しています。" },
    ],
    relatedTools: [
      { slug: "/resize", title: "画像リサイズ", description: "任意のキャンバスサイズに調整。" },
      { slug: "/compress-jpeg", title: "JPEG圧縮", description: "完成サムネイルを軽量化。" },
      { slug: "/crop-image", title: "画像トリミング", description: "汎用オンラインクロップ。" },
    ],
  },

}

export default data
