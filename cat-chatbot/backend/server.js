const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { handleMessage } = require("./services/assistantService");

const app = express();
const port = 5001;

app.use(cors({ origin: "http://localhost:3000", methods: ["POST", "GET"] }));
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message, threadId } = req.body;
  try {
    const thread =
      threadId ||
      (await require("openai").OpenAI.prototype.beta.threads.create()).id;
    const response = await handleMessage(thread, message);
    res.json({ message: response, threadId: thread });
  } catch (error) {
    console.error("❌ Chat error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get assistant response." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Streaming backend running at http://localhost:${port}`);
});
