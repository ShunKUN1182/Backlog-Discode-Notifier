import "dotenv/config";

const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

if (!webhookUrl) {
    throw new Error("Discord Webhook URLが設定されていません");
}

console.log("読み込みに成功しました");
