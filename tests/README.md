# テスト

本プロジェクトのテストは2層構成です。

| 種別 | ツール | 対象 | 実行コマンド |
|---|---|---|---|
| コンポーネント / ユニット | Vitest + Storybook (browser mode) | UI コンポーネント単体（stories） | `npm run test`（CI は `npx vitest run`） |
| E2E | Playwright | アプリ全体の通し（Route Handler 含む） | `npm run test:e2e`（CI は chromium のみ） |

> 初回は `npx playwright install chromium` でブラウザを取得してください。
> CI では `CI`（lint/build/unit）と `E2E` の2ジョブが並列で走ります。

---

## E2E シナリオ

ファイル: [tests/e2e/weather.spec.ts](e2e/weather.spec.ts)

気象庁 API（`/api/weather`）は `page.route()` でモックして決定的にしています。
そのため外部ネットワーク・環境変数に依存せず、安定して実行できます。

### 1. 地図と9地方が表示される

- **前提**: トップページ（`/`）を開く
- **確認**:
  - 見出し「気象予報アプリ」が表示される
  - 9地方（北海道・東北・関東・中部・近畿・中国・四国・九州・沖縄）のラベルがすべて表示される

### 2. 地方をクリックすると天気予報モーダルが開く

- **モック**: `/api/weather` が3日分の天気（晴れ / くもり / 雨）を返す
- **操作**: 「関東（東京都）」をクリック
- **確認**:
  - ダイアログが開く
  - タイトル「関東（東京都） の気象予報」が表示される
  - 3日分の天気（晴れ・くもり・雨）が表示される

### 3. 認証エラー時は 401 の案内メッセージを表示する

- **モック**: `/api/weather` が `401 Unauthorized` を返す
- **操作**: 地方をクリック
- **確認**: ダイアログ内に「401」を含むエラーメッセージが表示される
- **意図**: 環境変数 `API_SECRET_TOKEN` 未設定時の挙動（ハンズオンの要となる仕様）を担保する

### 4. キーボード操作でモーダルを開閉できる

- **操作**: 地方にフォーカス → `Enter` で開く → `Esc` で閉じる
- **確認**: ダイアログの表示 / 非表示が切り替わる
- **意図**: キーボード操作（アクセシビリティ）を担保する

---

## コンポーネント / ユニットテスト

`@storybook/addon-vitest` により、Storybook の stories をそのままテストとして実行します。
各 story のレンダリングとインタラクションが検証されます。

- [src/components/shared/AppButton/AppButton.stories.tsx](../src/components/shared/AppButton/AppButton.stories.tsx)
- [src/components/shared/AppCard/AppCard.stories.tsx](../src/components/shared/AppCard/AppCard.stories.tsx)

新しい共通コンポーネントを追加する際は、対応する `*.stories.tsx` を用意すると、
そのままユニットテストのカバレッジになります。
