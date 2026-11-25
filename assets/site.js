// TakumiTool 共通スクリプト：アプリ・拡張アドインの一覧データと表示、ふわっと表示の動き。
// パスはサイトのルートから書く。各ページは <body data-base="../"> のようにルートまでの相対パスを持つ。

// アプリの一覧。アプリを追加するときはここに 1 件足す。
// icon・thumbnail・storeUrl は未設定（空文字）ならサンプル画像／「準備中」になる。
const APPS = [
    {
        name: 'TT_3D Scanner',
        category: '3D スキャン',
        description: 'LiDAR で空間や構造物を素早く 3D スキャン。BIM 標準の IFC 形式で出力し、各種 CAD ソフトへ連携できます。',
        icon: 'assets/apps/tt3dscanner-icon.png',
        thumbnail: 'assets/apps/tt3dscanner-thumb.jpg',
        storeUrl: 'https://apps.apple.com/us/app/tt-3d-scanner/id6792498240',
        supportUrl: 'ttAr_HP.html',
    },
    {
        name: 'TT_Note',
        category: '現場メモ',
        description: '写真・PDF・CAD データを下図に、ペン・図形・寸法・カウンターで手書き記録。メモは PDF で出力・共有できます。',
        icon: 'assets/apps/ttnote-icon.png',
        thumbnail: 'assets/apps/ttnote-thumb.jpg',
        storeUrl: 'https://apps.apple.com/jp/app/tt-note/id6825391427',
        supportUrl: 'ttNote_HP.html',
    },
];

// 拡張アドインの一覧。アドインごとに addins/<フォルダ名>/ に使い方のページとファイルを置き、ここに 1 件足す。
// icon は未設定ならサンプル画像。
const ADDINS = [
    {
        name: 'test.txt',
        description: 'ダウンロードリンクの動作確認用テキストファイルです。',
        icon: '',
        page: 'addins/test/',
        file: 'addins/test/test.txt',
    },
];

const SAMPLE_ICON = 'assets/sample-icon.svg';
const SAMPLE_THUMB = 'assets/sample-thumb.svg';
const APPLE_LOGO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.27-1.6 2.78-.41 6.9 1.15 9.15.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.42-3.66zM14.1 5.86c.63-.77 1.06-1.83.94-2.89-.91.04-2.01.61-2.66 1.37-.58.67-1.1 1.76-.96 2.8 1.01.08 2.05-.52 2.68-1.28z"/></svg>';

const base = document.body.dataset.base || '';
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const path = (p) => escapeHtml(/^https?:/.test(p) ? p : base + p);

const appGrid = document.getElementById('app-grid');
if (appGrid) {
    appGrid.innerHTML = APPS.map((app) => {
        const name = escapeHtml(app.name);
        const store = app.storeUrl
            ? `<a class="pill pill-dark" href="${escapeHtml(app.storeUrl)}" target="_blank" rel="noopener">${APPLE_LOGO}App Store で見る</a>`
            : `<span class="pill is-disabled">${APPLE_LOGO}App Store 準備中</span>`;
        return `
            <article class="tile reveal">
                <div class="thumb">
                    <img src="${path(app.thumbnail || SAMPLE_THUMB)}" alt="${name} のサムネイル" loading="lazy" onload="if (this.naturalHeight > this.naturalWidth) this.parentNode.classList.add('is-portrait')">
                    ${app.thumbnail ? '' : '<span class="sample-tag">SAMPLE</span>'}
                </div>
                <div class="tile-body">
                    <div class="tile-head">
                        <img src="${path(app.icon || SAMPLE_ICON)}" alt="${name} のアイコン" width="64" height="64">
                        <div>
                            <h3>${name}</h3>
                            <span class="chip">${escapeHtml(app.category)}</span>
                        </div>
                    </div>
                    <p class="tile-desc">${escapeHtml(app.description)}</p>
                    <div class="tile-actions">${store}</div>
                    <div class="tile-links">
                        <a href="${path(app.supportUrl)}#contact">サポート</a>
                        <a href="${path(app.supportUrl)}#privacy">プライバシーポリシー</a>
                        <a href="${path(app.supportUrl)}#terms">利用規約</a>
                    </div>
                </div>
            </article>`;
    }).join('');
}

const addinGrid = document.getElementById('addin-grid');
if (addinGrid) {
    addinGrid.innerHTML = ADDINS.map((addin) => `
        <article class="addin reveal">
            <img src="${path(addin.icon || SAMPLE_ICON)}" alt="" width="56" height="56">
            <div class="addin-body">
                <h3><a href="${path(addin.page)}">${escapeHtml(addin.name)}</a></h3>
                <p>${escapeHtml(addin.description)}</p>
                <div class="addin-actions">
                    <a class="pill" href="${path(addin.page)}">使い方を見る</a>
                    <a class="pill pill-line" href="${path(addin.file)}" download>ダウンロード</a>
                </div>
            </div>
        </article>`).join('');
}

// 画面に入った要素に is-in を付けて表示する
const revealTargets = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealTargets.forEach((el) => io.observe(el));
} else {
    revealTargets.forEach((el) => el.classList.add('is-in'));
}
