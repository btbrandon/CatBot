import React from "react";
import ReactMarkdown from "react-markdown";
import "../styles/ChatWindow.css";
import { useEffect, useRef } from "react";

function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <div key={index} className={`chat-message ${msg.sender}`}>
          <div className="message-bubble">
            {msg.sender === "cat" ? (
              <div className="cat-image-wrapper">
                <img src={msg.content} alt="Cat" className="cat-image" />
              </div>
            ) : (
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            )}
          </div>
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

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;
