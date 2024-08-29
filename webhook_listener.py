from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import requests

def handle_approval(approval):
    print("approval", approval)
    url = "http://localhost:3000/api/v1/application/" + str(approval["shinsei_id"])
    headers = {'accept': 'application/json',
               'Content-Type': 'application/json'
               }

    application = requests.get(url, headers=headers)
    application = application.json()
    print(f"application: {application}")

    if "ラーメン" in application["title"]:
        print("警告をだします")
        approval["comment"] = "警告"

        url = 'http://localhost:3000/api/v1/approvals'
        response = requests.put(url, headers=headers, data=json.dumps(approval))
        response = response.json()
        print(f"Response: {response}")
    

class RequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        # ヘッダの内容を取得
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)  # POSTデータの読み取り
        post_data = json.loads(post_data)  # JSON形式に変換

        # 受信したデータをログに出力
        print("Received JSON data:", post_data)

        # # レスポンスの設定
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        # # クライアントに返すデータ
        response = {'status': 'received'}
        self.wfile.write(json.dumps(response).encode('utf-8'))

        if post_data["entry_type"] == "approval":
            handle_approval(post_data["data"])

def run(server_class=HTTPServer, handler_class=RequestHandler, port=3001):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()
