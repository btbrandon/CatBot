import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import "../styles/ChatWindow.css";

function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const isValidImageUrl = (url) =>
    typeof url === "string" &&
    /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i.test(url.trim());

  const renderContent = (content) => {
    if (!content || (Array.isArray(content) && content.length === 0))
      return null;

    if (Array.isArray(content)) {
      return content.map((item, i) =>
        isValidImageUrl(item) ? (
          <div key={i} className="cat-image-wrapper">
            <img src={item} alt="Cat" className="cat-image" />
          </div>
        ) : (
          <ReactMarkdown key={i}>{item}</ReactMarkdown>
        )
      );
    }

    if (isValidImageUrl(content)) {
      return (
        <div className="cat-image-wrapper">
          <img src={content} alt="Cat" className="cat-image" />
        </div>
      );
    }

    return <ReactMarkdown>{content}</ReactMarkdown>;
  };

  return (
    <div className="chat-window">
      {messages.map((msg, index) => {
        const shouldRender = msg.content || msg.time || loading;
        return shouldRender ? (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <div className="message-bubble">
              {renderContent(msg.content)}
              {msg.time &&
                msg.sender !== "cat" &&
                typeof msg.content === "string" && (
                  <span className="timestamp">{msg.time}</span>
                )}
            </div>
          </div>
        ) : null;
      })}

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
