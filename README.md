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

### サーバー起動
```bash
docker compose build
docker compose up -d
```

### ローカルサーバーへのアクセス
すべてが正常に動作している場合、ブラウザで http://localhost:3000 にアクセスして、アプリケーションが期待通りに動作しているか確認
