## 環境構築

### クローン
```bash
cd 作業ディレクトリ
git clone git@github.com:TOKIUM/summer-intern.git
cd summer-intern
```

### 各種セットアップ
```bash
docker-compose build --no-cache
docker-compose run web yarn install
docker-compose run web rails db:setup
docker-compose run web rails db:migrate
docker-compose run web bundle exec rails webpacker:compile
```

### サーバー起動
```bash
docker-compose up -d
```

### ローカルサーバーへのアクセス
すべてが正常に動作している場合、ブラウザで http://localhost:3000 にアクセスして、アプリケーションが期待通りに動作しているか確認
