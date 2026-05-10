const express = require("express");
const line = require("@line/bot-sdk");

const app = express();
app.use(express.json());

// LINE SDK 設定
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const client = new line.Client(config);

// 動作確認用
app.get("/", (req, res) => {
  res.send("LINE BOT OK");
});

// ★ Push通知テスト用エンドポイント（必ず webhook より上でも下でもOK）
app.get("/push", async (req, res) => {

  // ★ 自分のユーザーIDをここに入れる（必ず文字列）
  const userId = "U8b504a1a9d3255e0b339ed1e5cc0536e";

  try {
    await client.pushMessage(userId, {
      type: "text",
      text: "Push通知テスト成功！"
    });

    res.send("送信成功");

  } catch (err) {
    console.error(err);
    res.status(500).send("送信失敗");
  }
});

// Webhook
app.post("/webhook", (req, res) => {
  const events = req.body.events;

  Promise.all(
    events.map(event => {

      // userId取得（文字列にする）
      const userId = "U8b504a1a9d3255e0b339ed1e5cc0536e";

      console.log("USER ID:", userId);

      // テキストメッセージに返信
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "受け取ったよ！"
      });
    })
  )
    .then(() => res.sendStatus(200))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

