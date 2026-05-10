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

// Webhook
app.post("/webhook", (req, res) => {
  const events = req.body.events;

  Promise.all(
    events.map(event => {
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
