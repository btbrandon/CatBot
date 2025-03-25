import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import axios from "axios";
import "./styles/App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [threadId, setThreadId] = useState(() => {
    return localStorage.getItem("threadId") || null;
  });
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message) => {
    if (loading) return;
    // immediately add the user's message to the conversation
    setMessages((prev) => [...prev, { sender: "user", content: message }]);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5001/chat", {
        message,
        threadId,
      });

      // for the first message in a conversation
      if (response.data.threadId && !threadId) {
        setThreadId(response.data.threadId);
        localStorage.setItem("threadId", response.data.threadId);
      }

      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: response.data.message },
      ]);
    } catch (err) {
      console.error("❌ Failed to get assistant response", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: "Something went wrong 🐾" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1 className="chat-title">CatBot 🐾</h1>
        <button
          className="reset-button"
          onClick={() => {
            setThreadId(null);
            localStorage.removeItem("threadId");
            setMessages([]);
          }}
        >
          Reset Chat
        </button>
      </div>
      <ChatWindow messages={messages} loading={loading} />
      <ChatInput sendMessage={sendMessage} disabled={loading} />
    </div>
  );
}

export default App;
