import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  handleMessage,
  handleMessageStream,
} from "./services/assistantService.js";

dotenv.config();
const app = express();
const port = 5001;

app.use(cors({ origin: "http://localhost:3000", methods: ["POST", "GET"] }));
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message, threadId } = req.body;
  try {
    const { reply, threadId: resolvedThreadId } = await handleMessage(
      threadId,
      message
    );
    res.json({ message: reply, threadId: resolvedThreadId });
  } catch (error) {
    console.error("❌ Chat error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get assistant response." });
  }
});

app.post("/chat/stream", async (req, res) => {
  const { message, threadId } = req.body;

  try {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    let finalThreadId = null;

    await handleMessageStream(threadId, message, (delta) => {
      // Explicitly write each delta followed by a newline
      res.write(delta + "\n");
    }).then((thread) => {
      finalThreadId = thread;
    });

    res.end();
  } catch (err) {
    console.error("❌ Stream error", err);
    res.status(500).end("Streaming error");
  }
});

app.listen(port, () => {
  console.log(`🚀 Streaming backend running at http://localhost:${port}`);
});
