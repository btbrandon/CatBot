import OpenAI from "openai";
import getCatImage from "../functions/getCatImage.js";
import catbotInstructions from "../catbotPrompt.js";
import dotenv from "dotenv";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let ASSISTANT_ID = null;

export async function setupAssistant() {
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

export async function handleMessage(threadId, message) {
  const thread = threadId?.startsWith("thread_")
    ? threadId
    : (await openai.beta.threads.create()).id;

  await openai.beta.threads.messages.create(thread, {
    role: "user",
    content: message,
  });

  let run = await openai.beta.threads.runs.create(thread, {
    assistant_id: await setupAssistant(),
  });

  let status = run.status;
  while (status !== "completed" && status !== "failed") {
    await new Promise((r) => setTimeout(r, 1000));
    const updatedRun = await openai.beta.threads.runs.retrieve(thread, run.id);
    status = updatedRun.status;

    if (status === "requires_action") {
      const toolCalls =
        updatedRun?.required_action?.submit_tool_outputs?.tool_calls || [];

      for (const toolCall of toolCalls) {
        if (toolCall.function.name === "getCatImage") {
          const args = JSON.parse(toolCall.function.arguments);
          const imageUrls = await getCatImage(args);
          await openai.beta.threads.runs.submitToolOutputs(thread, run.id, {
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

  const messages = await openai.beta.threads.messages.list(thread);
  const latestMessage = messages.data.find((m) => m.role === "assistant");

  let reply = "Something went wrong 😿";
  if (latestMessage?.content?.[0]?.text?.value) {
    reply = latestMessage.content[0].text.value;
  } else if (
    latestMessage?.content?.[0]?.type === "tool_use" &&
    latestMessage.content[0].tool_use?.output
  ) {
    const parsed = JSON.parse(latestMessage.content[0].tool_use.output);
    if (parsed.imageUrls?.length) reply = parsed.imageUrls;
  }

  return {
    reply,
    threadId: thread,
  };
}

export async function handleMessageStream(threadId, message, onDelta) {
  const thread = threadId?.startsWith("thread_")
    ? threadId
    : (await openai.beta.threads.create()).id;

  await openai.beta.threads.messages.create(thread, {
    role: "user",
    content: message,
  });

  const assistantId = await setupAssistant();
  const stream = await openai.beta.threads.runs.stream(thread, {
    assistant_id: assistantId,
  });

  let fullText = "";

  for await (const event of stream) {
    if (event.event === "thread.message.delta") {
      const contents = event.data.delta?.content || [];

      for (const part of contents) {
        if (
          part.type === "text" &&
          part.text?.value &&
          !part.text.value.includes("json{")
        ) {
          fullText += part.text.value;
          onDelta(part.text.value);
        }
      }
    }

    if (event.event === "thread.run.requires_action") {
      const toolCalls =
        event.data.required_action.submit_tool_outputs.tool_calls;

      const tool_outputs = [];

      for (const toolCall of toolCalls) {
        if (toolCall.function.name === "getCatImage") {
          const args = JSON.parse(toolCall.function.arguments);
          const imageUrls = await getCatImage(args);

          tool_outputs.push({
            tool_call_id: toolCall.id,
            output: JSON.stringify({ imageUrls }),
          });

          for (const url of imageUrls) {
            const formatted = `\n${url}\n`;
            fullText += formatted;
            onDelta(formatted);
          }
        }
      }

      await openai.beta.threads.runs.submitToolOutputs(thread, event.data.id, {
        tool_outputs,
      });
    }
  }

  if (typeof localStorage !== "undefined") {
    localStorage.setItem("threadId", thread);
  }

  return thread;
}
