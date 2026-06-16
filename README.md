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

- **Node.js 24**: markuplint は Node.js 24 で動作しません (ESM互換性問題)。ローカルでは `npm run markuplint` をスキップするか、Node.js 22 を使用してください。CI では Node.js 22 を使用しています。
- **base-ui**: shadcn/ui は base-ui ベースに移行しています。`asChild` の代わりに `render` プロパティを使用します。

## デプロイ (Vercel)

GitHub リポジトリを Vercel に連携すると、`main` への push で自動デプロイされます。

1. [Vercel](https://vercel.com/) でリポジトリをインポート
2. 環境変数 `API_SECRET_TOKEN` を設定
3. デプロイ（以降は push で自動再デプロイ）
