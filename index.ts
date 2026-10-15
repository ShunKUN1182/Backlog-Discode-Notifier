import "dotenv/config";

async function main(): Promise<void> {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        throw new Error("Discord Webhook URLが設定されていません");
    }
    const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: "テスト通知: Backlog Discord Notifier 送信成功",
        }),
    });
    if (!response.ok) {
        const errorBody = await response.text();
        console.error("HTTPステータス:", response.status);
        console.error("Discordからのエラー:", errorBody);
        throw new Error("Discordへの送信に失敗しました");
    }
    console.log("テスト通知成功");
}

main().catch((error: unknown) => {
    console.error("エラーが発生しました:", error);
    process.exitCode = 1;
});
