import { createServer } from "node:http";
import "dotenv/config";

const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

async function sendDiscordMessage(message: string): Promise<void> {
    if (!webhookUrl) {
        throw new Error("Discord webhook URLが設定されていません");
    }
    const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: message,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Discord送信失敗: ${response.status} ${errorBody}`);
    }
}

const server = createServer((req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });
    req.on("end", async () => {
        try {
            console.log("受信したデータ:", body);
            const data = JSON.parse(body);
            const issue = data.content;
            const eventName = data.type === 1 ? "作成" : data.type === 2 ? "更新" : "error";

            const message =
                `【${data.createdUser}が課題を${eventName}しました】\n` +
                `課題名：${issue.summary}\n` +
                `ステータス：${issue.status.name}\n` +
                `担当者：${issue.assignee.name}`;
            await sendDiscordMessage(message);
            res.writeHead(200, {
                "Content-Type": "text/plain; charset=utf-8",
            });
            res.end("受信成功");
        } catch (error) {
            console.error("通知処理に失敗:", error);
            if (!res.headersSent) {
                res.writeHead(500, {
                    "Content-Type": "text/plain; charset=utf-8",
                });
                res.end("受信失敗");
            }
        }
    });
});

server.listen(3000, () => {
    console.log("サーバー起動 : http://localhost:3000");
});

// テストデータ
// const add = {
//     id: 442177283,
//     project: {
//         id: 229850,
//         projectKey: "2026_TEAM135_B",
//         name: "2026_team135_b",
//         chartEnabled: true,
//         subtaskingEnabled: true,
//         projectLeaderCanEditProjectLeader: false,
//         useWikiTreeView: false,
//         textFormattingRule: "markdown",
//         archived: false,
//     },
//     type: 1,
//     content: {
//         id: 63453902,
//         key_id: 15,
//         summary: "うるさくてごめんなさい",
//         description: "",
//         issueType: {
//             id: 1290504,
//             projectId: 229850,
//             name: "タスク",
//             color: "#7ea800",
//             displayOrder: 0,
//         },
//         resolution: null,
//         priority: { id: 3, name: "中" },
//         status: { id: 1, name: "未対応" },
//         assignee: {
//             id: 649671,
//             userId: "*OHJlYgqVCv",
//             name: "福島 駿弥",
//             roleType: 94,
//             lang: "ja",
//         },
//         category: [],
//         versions: [],
//         milestone: [],
//         startDate: null,
//         dueDate: "2026-10-28",
//         estimatedHours: null,
//         actualHours: null,
//         parentIssueId: null,
//         customFields: [],
//         attachments: [],
//         shared_files: [],
//         externalFileLinks: [],
//     },
//     notifications: [],
//     createdUser: {
//         id: 649671,
//         userId: null,
//         name: "福島 駿弥",
//         roleType: 2,
//         lang: "ja",
//         mailAddress: null,
//         nulabAccount: {
//             nulabId: "Ytac3RaXnuUy9PRj8KVbnkJhNEh6786yx2IHEK7hlas2rR9k5f",
//             name: "福島 駿弥",
//             uniqueId: "2250378",
//         },
//     },
//     created: "2026-10-15T06:55:42Z",
// };

// const change = {
//     id: 442178299,
//     project: {
//         id: 229850,
//         projectKey: "2026_TEAM135_B",
//         name: "2026_team135_b",
//         chartEnabled: true,
//         subtaskingEnabled: true,
//         projectLeaderCanEditProjectLeader: false,
//         useWikiTreeView: false,
//         textFormattingRule: "markdown",
//         archived: false,
//     },
//     type: 2,
//     content: {
//         id: 63453902,
//         key_id: 15,
//         summary: "うるさくてごめんなさい",
//         description: "",
//         issueType: {
//             id: 1290504,
//             projectId: 229850,
//             name: "タスク",
//             color: "#7ea800",
//             displayOrder: 0,
//         },
//         resolution: null,
//         priority: { id: 3, name: "中" },
//         status: { id: 2, name: "処理中" },
//         assignee: {
//             id: 586462,
//             userId: "*4UgehwlPYG",
//             name: "高木 湊二郎",
//             roleType: 94,
//             lang: "ja",
//         },
//         category: [],
//         versions: [],
//         milestone: [],
//         startDate: null,
//         dueDate: "2026-10-28",
//         estimatedHours: null,
//         actualHours: null,
//         parentIssueId: null,
//         customFields: [],
//         attachments: [],
//         shared_files: [],
//         externalFileLinks: [],
//         diff: null,
//         comment: { id: 346850869, content: "テストやで" },
//         changes: [
//             { field: "status", new_value: "2", old_value: "1", type: "standard" },
//             {
//                 field: "assigner",
//                 new_value: "高木 湊二郎",
//                 old_value: "福島 駿弥",
//                 type: "standard",
//             },
//         ],
//     },
//     notifications: [
//         {
//             id: 438708397,
//             alreadyRead: false,
//             reason: 1,
//             user: {
//                 id: 586462,
//                 userId: null,
//                 name: "高木 湊二郎",
//                 roleType: 2,
//                 lang: "ja",
//                 mailAddress: null,
//                 nulabAccount: {
//                     nulabId: "G7RB1TAw8DaIQ6M4OJSmSaLCwm423fVfAGCOOQcmaea49pIpXd",
//                     name: "高木 湊二郎",
//                     uniqueId: "2240077",
//                 },
//             },
//             resourceAlreadyRead: false,
//         },
//     ],
//     createdUser: {
//         id: 649671,
//         userId: null,
//         name: "福島 駿弥",
//         roleType: 2,
//         lang: "ja",
//         mailAddress: null,
//         nulabAccount: {
//             nulabId: "Ytac3RaXnuUy9PRj8KVbnkJhNEh6786yx2IHEK7hlas2rR9k5f",
//             name: "福島 駿弥",
//             uniqueId: "2250378",
//         },
//     },
//     created: "2026-10-15T06:58:21Z",
// };

// テスト用
// curl -i -X POST 'https://backlog-discode-notifler.2250378.workers.dev/' \
//   -H 'Content-Type: application/json' \
//   -d '{
//     "type": 2,
//     "content": {
//       "summary": "Cloudflareテスト",
//       "status": {
//         "name": "処理中"
//       },
//       "assignee": {
//         "name": "テスト担当者"
//       }
//     }
//   }'
