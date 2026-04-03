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

}

export default data
