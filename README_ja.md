# LINE リッチメニューマネージャー

LINE ボットのリッチメニュー管理用アプリです。リッチメニューついては [こちら](https://developers.line.me/ja/docs/messaging-api/using-rich-menus/) を参照。

# NPM からインストール
すぐに使いたい場合は、NPM からインストールして使えます。
```
npm install -g line-richmenus-manager
line-richmenus-manager
```
macOS の場合
```
sudo npm install -g line-richmenus-manager
sudo line-richmenus-manager
```
サービスがポート 3000 で起動します。任意のブラウザで接続できますが、Chrome でのみ検証しています。止める際はターミナルから Ctrl+C で終了してください。またポート番号を指定して起動することもできます。
```
line-richmenus-manager --port:3200
```
# アプリケーションの使い方
シンプルなため説明は省略しますが、不明な点があればコメントください。

# 機能
以下のことが出来ます。:
- リッチメニューの一覧を取得
- 特定ユーザーに紐づくリッチメニューの取得
- リッチメニューの詳細表示、ユーザーへの紐づけ、紐づけ解除およびリッチメニューの削除
- リッチメニューの作成
マウスを使ってエリアを指定できるほか、ピクセル単位で x/y/幅/高さを指定してエリアを作ることが出来ます。

# GitHub からの取得
## 前提条件
- LINE 開発者アカウント
- node.js
- 開発中の LINE Bot アプリ
- Visual Studio Code
- Debugger for Chrome 拡張
- **Chrome でしかテストしてません。**

## セットアップ
以下のコマンドでコードの取得とモジュールのインストールを行います。
```
git clone https://github.com/kenakamu/line-richmenus-manager
npm install
```

## デバッグの実行
このアプリは express ベースのサーバーと Angular 2 ベースのクライアントから構成されます。

1. 統合コンソールより以下のコマンドを実行して Angular 2 アプリケーションを起動。プロキシファイルを指定して、express サーバーと通信を設定。
```
ng serve --aot --progress=false --proxy-config proxy.conf.json
```

2. express サーバーをデバッグしたい場合、デバッグメニューより "Launch Node" 構成を選択して F5 押下。

3. ブラウザ側のデバッグは "Launch Chrome" 構成を選択して、F5 押下。
