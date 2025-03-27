import React, { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import "./styles/App.css";

function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("messages");
    return saved ? JSON.parse(saved) : [];
  });

  const [threadId, setThreadId] = useState(() => {
    return localStorage.getItem("threadId") || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  const isImageUrl = (str) =>
    typeof str === "string" &&
    /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i.test(str.trim());

  const sendMessage = async (message) => {
    if (loading) return;

    const userTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      { sender: "user", content: message, time: userTime },
    ]);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, threadId }),
      });

      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      const botTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      let streamedText = "";
      const streamedImages = [];

      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: "", time: botTime },
      ]);

      setLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (value) {
          const newLines = value.split("\n").filter(Boolean);
          const newImages = newLines.filter(isImageUrl);
          const newTextLines = newLines.filter((line) => !isImageUrl(line));

          streamedText += newTextLines.join("\n");

          streamedImages.push(...newImages);

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: [streamedText.trim(), ...streamedImages],
              time: botTime,
            };
            return updated;
          });
        }
      }

      const newThreadId = localStorage.getItem("threadId");
      if (!threadId && newThreadId) {
        setThreadId(newThreadId);
      }
    } catch (err) {
      console.error("Streaming error", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: "Something went wrong 🐾" },
      ]);
    }
  };

  const resetChat = () => {
    setThreadId(null);
    localStorage.removeItem("threadId");
    localStorage.removeItem("messages");
    setMessages([]);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1 className="chat-title">CatBot 🐾</h1>
        <button className="reset-button" onClick={resetChat}>
          Reset Chat
        </button>
      </div>
      <ChatWindow messages={messages} loading={loading} />
      <ChatInput sendMessage={sendMessage} disabled={loading} />
    </div>
  );
}

export default App;
