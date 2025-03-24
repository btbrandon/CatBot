// Updated server.js with OpenAI Assistant API
const express = require("express");
const { OpenAI } = require("openai");
const catbotInstructions = require("./catbotPrompt");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 5001;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let ASSISTANT_ID = null;

// Utility to create and reuse assistant
async function setupAssistant() {
  if (ASSISTANT_ID) return ASSISTANT_ID;

  const assistant = await openai.beta.assistants.create({
    name: "CatBot",
    instructions: catbotInstructions,
    model: "gpt-4o-mini",
  });

  ASSISTANT_ID = assistant.id;
  return ASSISTANT_ID;
}

// Streaming endpoint
app.post("/chat", async (req, res) => {
  const { message, threadId: incomingThreadId } = req.body;
  let threadId = incomingThreadId;

  try {
    const assistantId = await setupAssistant();

    // Step 1: Create thread if it's a new user or session
    if (!threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
    }

    // Step 2: Add user message to thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });

    // Step 3: Run assistant on the thread
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    // Step 4: Poll until run is complete
    let status = run.status;
    while (status !== "completed" && status !== "failed") {
      await new Promise((r) => setTimeout(r, 1000));
      const updatedRun = await openai.beta.threads.runs.retrieve(
        threadId,
        run.id
      );
      status = updatedRun.status;
    }

    // Step 5: Fetch assistant response
    const messages = await openai.beta.threads.messages.list(threadId);
    const latestMessage = messages.data.find((m) => m.role === "assistant");

    const response =
      latestMessage?.content?.[0]?.text?.value || "Something went wrong 😿";

    // ✅ Return both the reply and the threadId
    res.json({ message: response, threadId });
  } catch (error) {
    console.error("❌ Chat error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get assistant response." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Streaming backend running at http://localhost:${port}`);
});
