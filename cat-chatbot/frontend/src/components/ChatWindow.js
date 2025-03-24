import React from "react";
import ReactMarkdown from "react-markdown";

function ChatWindow({ messages }) {
  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.sender}`}>
          {msg.sender === "cat" ? (
            <img src={msg.content} alt="Cat" style={{ width: "100%" }} />
          ) : (
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          )}
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;
