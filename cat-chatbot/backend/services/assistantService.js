const { OpenAI } = require("openai");
const getCatImage = require("../functions/getCatImage");
const catbotInstructions = require("../catbotPrompt");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let ASSISTANT_ID = null;

async function setupAssistant() {
  if (ASSISTANT_ID) return ASSISTANT_ID;

  const assistant = await openai.beta.assistants.create({
    name: "CatBot",
    instructions: catbotInstructions,
    model: "gpt-4o-mini",
    tools: [
      {
        type: "function",
        function: {
          name: "getCatImage",
          description:
            "Fetch a random cat image (optionally filtered by breed)",
          parameters: {
            type: "object",
            properties: {
              breed: { type: "string", description: "Cat breed ID" },
              count: { type: "number", description: "Number of cats" },
            },
            required: [],
          },
        },
      },
    ],
  });

  ASSISTANT_ID = assistant.id;
  return ASSISTANT_ID;
}

async function handleMessage(threadId, message) {
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: message,
  });

  let run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: await setupAssistant(),
  });

  let status = run.status;
  while (status !== "completed" && status !== "failed") {
    await new Promise((r) => setTimeout(r, 1000));
    const updatedRun = await openai.beta.threads.runs.retrieve(
      threadId,
      run.id
    );
    status = updatedRun.status;

    if (status === "requires_action") {
      const toolCalls =
        updatedRun?.required_action?.submit_tool_outputs?.tool_calls || [];

      for (const toolCall of toolCalls) {
        if (toolCall.function.name === "getCatImage") {
          const args = JSON.parse(toolCall.function.arguments);
          const imageUrls = await getCatImage(args);
          await openai.beta.threads.runs.submitToolOutputs(threadId, run.id, {
            tool_outputs: [
              {
                tool_call_id: toolCall.id,
                output: JSON.stringify({ imageUrls }),
              },
            ],
          });
        }
      }
    }
  }

  const messages = await openai.beta.threads.messages.list(threadId);
  const latestMessage = messages.data.find((m) => m.role === "assistant");

  return latestMessage?.content?.[0]?.text?.value || "Something went wrong 😿";
}

module.exports = { setupAssistant, handleMessage };
