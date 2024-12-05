# Gyro Ball

ジャイロセンサーを使ってボールを転がし、画面を塗りつぶすWebアプリケーションです。

## 機能

- デバイスの傾きに応じてボールが転がります
- ボールの軌跡が黒く塗られていきます
- 塗られた面積のパーセンテージがリアルタイムで表示されます
- 摩擦による減速効果があり、自然な動きを実現
- 画面の端までボールを移動可能
- レスポンシブデザインで様々な画面サイズに対応
- iOSデバイスでのジャイロセンサー権限管理に対応

## 技術スタック

- TypeScript
- SvelteKit
- HTML5 Canvas
- DeviceOrientation API

## 開発環境のセットアップ

1. リポジトリのクローン

```bash
git clone https://github.com/your-username/gyro-ball.git
cd gyro-ball
```

1. 依存関係のインストール

```bash
pnpm install
```

1. 開発サーバーの起動

```bash
pnpm dev
```

1. ブラウザでアクセス

```text
http://localhost:5173
```

## 動作確認

- スマートフォンやタブレットでアクセスしてください
- iOSデバイスの場合、最初にジャイロセンサーへのアクセス許可が必要です
- デバイスを傾けることでボールが転がり、軌跡が残ります
- 画面全体を塗りつぶすことができます

## 注意事項

- デバイスのジャイロセンサーが必要です
- HTTPSでの実行が推奨されます（一部ブラウザではHTTPSが必須）
- PCでは動作確認できません（ジャイロセンサーが必要なため）
