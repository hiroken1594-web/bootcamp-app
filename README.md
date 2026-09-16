# うごくみる（bootcamp-app）

毎日の運動を記録し、グラフと表で「見えるかたち」にするWebアプリです。

## 概要

配信活動などで忙しく運動不足になりがちな人をターゲットに、日々の運動記録・体重/身長/年齢に基づく推奨運動量との比較・記録の一覧表示をシンプルな画面フローで提供します。

## 主な機能

- プロフィール（名前・体重・身長・年齢）の登録・更新
- 運動記録（種目・時間）の登録
- 年齢に応じた推奨運動量（WHOの身体活動ガイドラインの目安）との比較表示
- 運動記録の推移グラフ表示
- 過去の運動記録一覧（表）表示
- 入力バリデーション（未入力・過剰な値・不正な文字列のチェック）

## 利用の流れ

1. **入口画面** → 「詳しく見る」でタイトル画面へ
2. **タイトル画面**（アプリ名とキャッチフレーズ）→ 「はじめる」で入力画面へ
3. **入力画面** でプロフィール（名前・体重・身長・年齢）と今日の運動（種目・時間）を入力して保存
4. **結果画面** で推奨運動量との比較とグラフを表示
5. **記録一覧画面** で過去の記録を表形式で確認

## 本番URL

https://bootcamp-app-ten.vercel.app

（Vercelが自動発行する `*.vercel.app` ドメインをそのまま使用しています。独自ドメインは設定していません。)

## 技術構成

`package.json` に基づく実際の構成です。

- フロントエンド: [React](https://react.dev/) 18 + [Vite](https://vitejs.dev/) 8（`@vitejs/plugin-react`）
- API: Vercel Functions（[api/profile.js](api/profile.js), [api/records.js](api/records.js)）
- ORM: [Prisma](https://www.prisma.io/) 7（`@prisma/client` + `@prisma/adapter-pg` による driver adapter 構成）
- DB接続: [pg](https://node-postgres.com/)（`node-postgres`）
- データベース: PostgreSQL（Vercel経由のNeon）
- デプロイ先: [Vercel](https://vercel.com/)（Hobbyプラン）

フロントエンドはブラウザから直接データベースへ接続せず、`/api/*` のVercel Functions経由でのみデータを読み書きします（[lib/prisma.js](lib/prisma.js)、[src/lib/api.js](src/lib/api.js)）。

## ローカル環境での起動方法

このプロジェクトはフロントエンド（Vite）とAPI（Vercel Functions）を別プロセスで動かし、Viteが `/api` 宛のリクエストをVercel devへプロキシします（[vite.config.js](vite.config.js)）。

```bash
# 依存関係のインストール
npm install

# ターミナル1: API（Vercel Functions）を起動 (http://localhost:3000)
vercel dev

# ターミナル2: フロントエンド開発サーバーを起動 (http://localhost:5173)
npm run dev
```

ブラウザで `http://localhost:5173` を開いてください。

初回は `vercel dev` の実行時にVercelプロジェクトとのリンクを求められます。このリポジトリのVercelプロジェクト（`bootcamp-app`）にリンクしてください。

## 必要な環境変数

アプリのコードが実際に参照している環境変数は以下の2つです（[lib/prisma.js](lib/prisma.js), [prisma.config.js](prisma.config.js)）。

| 変数名 | 用途 |
|---|---|
| `POSTGRES_PRISMA_URL` | Prisma CLI（`prisma db push` 等）が使用する接続文字列 |
| `POSTGRES_URL_NON_POOLING` | アプリ実行時（API）がPrisma経由でDBに接続する際に使用する、プーラーを経由しない直接接続文字列 |

実際の値は記載しません。Vercelダッシュボードの当該プロジェクトの Storage / Environment Variables から取得し、`.env.local` に保存してください（サンプルは [.env.local.example](.env.local.example) を参照）。`.env.local` はGit管理対象外です。

Vercel上にはNeon連携により他にも複数のPostgres関連環境変数（`bootcampapp_` 接頭辞など）が自動生成されていますが、アプリのコードからは参照していません。

## Vercelへのデプロイ

このリポジトリはVercelプロジェクト `bootcamp-app`（チーム: `kento-hiroki-9603s-projects`）と連携済みです。

- GitHubリポジトリとVercelプロジェクトがGit連携されています
- **`main` ブランチへのpushで自動的に本番デプロイが実行されます**
- 手動でデプロイする場合は Vercel CLI から以下を実行します

```bash
vercel deploy         # プレビューデプロイ
vercel deploy --prod  # 本番デプロイ
```

## 現時点での注意事項

- **認証機能は実装されていません。** プロフィールは名前だけで識別されるため、同じ名前を知っている・推測できる第三者が他人のプロフィールや運動記録を閲覧・変更できる可能性があります。ログインやパスワードによる保護は現時点ではありません。
- そのため、**本アプリはテスト・デモ用途を想定しています。実在する氏名・連絡先などの個人情報や、機密情報は入力しないでください。**
- 上記の制約を踏まえたうえで、認証機能の追加は今後の検討課題です。

## 開発状況

学習用（ブートキャンプ課題）として開発中のプロジェクトです。画面フローと基本的なCRUD・グラフ表示は動作しますが、認証・アクセス制御・自動テストなどは未整備です。
