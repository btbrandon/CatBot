import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([]);

  const [threadId, setThreadId] = useState(() => {
    // Try to load from localStorage (or sessionStorage)
    return localStorage.getItem("threadId") || null;
  });

  const sendMessage = async (message) => {
    // Display user message
    setMessages((prev) => [...prev, { sender: "user", content: message }]);

    try {
      const response = await axios.post("http://localhost:5001/chat", {
        message,
        threadId, // send it to backend
      });

      // Save returned threadId if new
      if (response.data.threadId && !threadId) {
        setThreadId(response.data.threadId);
        localStorage.setItem("threadId", response.data.threadId); // persist across reloads
      }

      // Display assistant reply
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
    }
  };

  return (
    <div className="App">
      <h1>CatBot</h1>
      <ChatWindow messages={messages} />
      <ChatInput sendMessage={sendMessage} />
      <button
        onClick={() => {
          setThreadId(null);
          localStorage.removeItem("threadId");
          setMessages([]);
        }}
      >
        Reset Chat
      </button>
    </div>
  );
}

export default App;
