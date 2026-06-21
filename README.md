# Next.js 開発環境テンプレート

Next.js + shadcn/ui + Tailwind CSS をベースとした汎用開発環境です。

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router, Turbopack) |
| UI | shadcn/ui (base-ui), Tailwind CSS v4 |
| 状態管理 | Zustand |
| フォーム | React Hook Form + Zod |
| テスト | Vitest, Playwright |
| コンポーネント管理 | Storybook 10 |

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

## 利用可能なスクリプト

### 開発

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 (Turbopack) |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバー起動 |
| `npm run storybook` | Storybook 起動 (port 6006) |

### コード品質

| コマンド | 説明 |
|---------|------|
| `npm run lint` | ESLint 実行 |
| `npm run lint:fix` | ESLint 自動修正 |
| `npm run format` | Prettier フォーマット |
| `npm run format:check` | Prettier チェック |
| `npm run stylelint` | Stylelint 実行 |
| `npm run markuplint` | Markuplint 実行 |
| `npm run typecheck` | TypeScript 型チェック |

### テスト

| コマンド | 説明 |
|---------|------|
| `npm run test` | Vitest 実行 |
| `npm run test:ui` | Vitest UI モード |
| `npm run test:e2e` | Playwright E2E テスト |

> テストの構成と各シナリオは [tests/README.md](tests/README.md) を参照してください。

## ディレクトリ構成

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── ui/                 # shadcn/ui プリミティブ (読み取り専用)
│   └── shared/             # ラッパーコンポーネント
├── features/               # 機能別モジュール
│   └── {feature-name}/
│       ├── components/     # 機能固有コンポーネント
│       ├── hooks/          # 機能固有フック
│       ├── stores/         # 機能固有ストア
│       └── types/          # 機能固有型定義
├── hooks/                  # 共通カスタムフック
├── lib/                    # ユーティリティ
├── stores/                 # グローバルストア
└── types/                  # 共通型定義
```

## コンポーネント設計 (防波堤パターン)

3層構造でコンポーネントを管理します。

### 1. ui/ (プリミティブ層)
shadcn/ui が生成するコンポーネント。**直接編集禁止**。

### 2. shared/ (ラッパー層)
ui/ をラップし、プロジェクト共通の機能を追加。

```tsx
// 例: AppButton - ローディング状態を追加
import { AppButton } from "@/components/shared/AppButton";

<AppButton isLoading={isPending}>送信</AppButton>
```

### 3. features/ (ドメイン層)
機能固有のコンポーネント。shared/ を使用して構築。

```tsx
// 例: features/auth/components/LoginForm.tsx
import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/shared/AppInput";
```

## shadcn/ui コンポーネントの追加

```bash
# コンポーネント追加
npx shadcn@latest add button

# ラッパー作成 (src/components/shared/AppXxx/)
```

## 環境変数

`.env.local` を作成:

```env
# 内部API (/api/weather) の認証に使用するシークレットトークン
API_SECRET_TOKEN="your-secret-token"
```

## GitHub Actions

PRを作成すると以下のチェックが自動実行されます:

- ESLint
- Prettier
- Stylelint
- Markuplint
- TypeScript 型チェック

## 注意事項

- **Node.js バージョン**: 本プロジェクトは Node.js 22 (LTS) を使用します。バージョンは `.nvmrc` / `.node-version` に固定しており、nvm・fnm・nodenv で自動切り替えできます（CI / Vercel も同バージョンを使用）。
- **base-ui**: shadcn/ui は base-ui ベースに移行しています。`asChild` の代わりに `render` プロパティを使用します。

## デプロイ (Vercel)

GitHub リポジトリを Vercel に連携すると、`main` への push で自動デプロイされます。

1. [Vercel](https://vercel.com/) でリポジトリをインポート
2. 環境変数 `API_SECRET_TOKEN` を設定（**Production / Preview の両方**に設定すること。詳細は下記）
3. デプロイ（以降は push で自動再デプロイ）

### 環境変数のスコープに注意

Vercel の環境変数は **Production / Preview / Development** で別々に管理されます。
`API_SECRET_TOKEN` を Production だけに設定すると、**プレビュー環境では未設定扱いとなり、地方クリック時に 401 になります**。プレビューでも天気を取得できるよう、**Preview 環境にも同じ変数を設定**してください（本番と検証で別トークンにする運用も可能です）。

### プレビューで確認してからマージする（推奨フロー）

`main` 以外のブランチ / PR は、Vercel が自動で**プレビューデプロイ**を作成します。本番マージ前に実物を確認できます。

1. 作業用ブランチを作成して編集する（例: 地図の色を変更）
   ```bash
   git switch -c feature/change-map-color
   # 編集してコミット
   git push -u origin feature/change-map-color
   ```
2. `main` 向けに Pull Request を作成
3. PR 上で次の 2 つが揃うのを待つ
   - **CI チェック**（lint / build / test 等）がすべて green
   - **Vercel の Preview URL**（bot が PR にコメント）で表示を確認
4. 問題なければ `main` にマージ → 本番へ自動デプロイ

> ブランチ保護により、CI が通らない PR は `main` にマージできません。「CI 緑 + プレビュー目視確認 → マージ」が実践的なレビューフローになります。

## バックエンドストレージ（任意）

Vercel は純正ストレージ（Edge Config / Blob）と、Marketplace 連携のマネージド DB（Upstash Redis / Neon Postgres 等）を提供します。本アプリでは体験用に2つを組み込んでいます。**いずれも未設定でもアプリは動作します**（該当機能を自動でスキップ）。

### Upstash Redis — 地方アクセスランキング

地方をクリックするたびに `/api/weather` 内でアクセス数を集計し（`ZINCRBY`）、地図の下に人気ランキングを表示します。

1. Vercel の **Storage（または Marketplace）→ Upstash Redis** をプロジェクトに追加
2. 環境変数（`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`）が自動で注入される
3. 再デプロイ → 地方をクリックするとランキングが集計・表示される

> ローカルで試す場合は `.env.local` に上記2変数を設定してください（未設定ならランキングは非表示）。

### Edge Config — お知らせバナー

サイト上部のお知らせバナーを **Edge Config の値で制御**します。値を変更すると **再デプロイなしで即時反映**されるのが特徴です。

1. Vercel の **Storage → Edge Config** でストアを作成し、プロジェクトに連携（`EDGE_CONFIG` が自動注入される）
2. ストアに `announcement` キーを登録
   - 文字列: `"メンテナンスを予定しています"`
   - もしくはオブジェクト: `{ "message": "...", "enabled": true }`（`enabled: false` で非表示）
3. 値を編集 → サイトを再読み込みすると、再デプロイなしでバナーが変わる

> どちらの環境変数も、Production / Preview の両方に効かせたい場合は両環境へ設定してください。
