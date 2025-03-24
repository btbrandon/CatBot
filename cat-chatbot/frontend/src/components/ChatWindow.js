import React from "react";
import ReactMarkdown from "react-markdown";
import "../styles/ChatWindow.css";

function ChatWindow({ messages, loading }) {
  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <div key={index} className={`chat-message ${msg.sender}`}>
          {msg.sender === "cat" ? (
            <img src={msg.content} alt="Cat" className="cat-image" />
          ) : (
            <div className="message-bubble">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          )}
        </div>
      ))}
      {loading && (
        <div className="chat-message bot">
          <div className="message-bubble typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
