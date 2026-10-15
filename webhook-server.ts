import { createServer } from "node:http";

const server = createServer((req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });
    req.on("end", () => {
        const data = JSON.parse(body);
        console.log("タスク名:", data.task);
        console.log("ステータス:", data.status);

        res.writeHead(200, {
            "Content-Type": "text/plain; charset=utf-8",
        });
        res.end("受信成功");
    });
});

server.listen(3000, () => {
    console.log("サーバー起動 : http://localhost:3000");
});
