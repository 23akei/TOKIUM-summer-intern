## 環境構築

### クローン
```bash
cd 作業ディレクトリ
git clone git@github.com:Gild-shogi/TOKIUM-summer-intern.git
cd TOKIUM-summer-intern
```

### 各種セットアップ
```bash
docker compose run --rm front yarn install
docker compose run app rails db:setup
docker compose run app rails db:migrate
```

#### 環境変数
Google Maps APIキーの設定: `front/.env`にGoogle Maps APIのAPIキーとmap idを設定する必要があります。
`front/.env.example`を参考にして`front/.env`を作成してください。

### サーバー起動
```bash
docker compose build
docker compose up -d
```

### ローカルサーバーへのアクセス
すべてが正常に動作している場合、ブラウザで http://localhost:3000 にアクセスして、アプリケーションが期待通りに動作しているか確認

## 開発時に適宜行うコマンド

### OpenAPIからapi.tsを生成
openapi.ymlをつかってapi.ts(apiをたたくための関数を含んだファイル)を生成できる
openapi.ymlが変更されたたびに下を走らせる
```bash
yarn openapi
```

###　モデルの追加
モデルの追加を含む変更があった場合、DBのマイグレーションを行う。
コンテナ内なら
```bash
bin/rails db:migrate
```
コンテナ外なら
```bash
docker compose run app rails db:migrate
```

#### （バックエンド開発者向け）モデルの追加方法
バックエンドでモデルを追加する場合、下記のコマンドをappコンテナ内で実行する
```bash
bin/rails generate model モデル名 カラム名:型 カラム名:型 ...
```

## Webhook
http://プライベートIPアドレス:3001をurlとして登録するとwebhook_listener.pyがつかえる
webhook_listener.pyは、フックを登録したユーザに承認依頼がきた申請のタイトルが”ラーメン”を含む場合、commentに警告を追加する
例えばその後ユーザーは承認画面から、Commentに”警告”を含む申請を検索して一括却下などをすることができる

### entry:
submittion: フックを登録したユーザーの提出した申請の承認が完了したとき
approval: フックを登録したユーザーに承認依頼がきたとき

