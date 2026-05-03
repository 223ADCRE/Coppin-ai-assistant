"use client";

import { useRef, useEffect } from "react";
import { useChat, Message } from "ai/react";
import Bubble from "./components/Bubble";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";

const SendIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const Home = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } =
    useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const noMessages = messages.length === 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [input]);

  const handlePrompt = (promptText: string) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user",
    };
    append(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        formRef.current?.requestSubmit();
      }
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <header className="chat-header">
        <div className="header-logo">E</div>
        <div className="header-text">
          <h1>EDUCHAT AI</h1>
          <p>Your School Assistant Bot</p>
        </div>
        <div className="header-badge">
          <span className="header-badge-dot" />
          Online
        </div>
      </header>

      {/* Messages or Landing */}
      {noMessages ? (
        <div className="landing-state">
          <div className="landing-intro">
            <h2>How can I help you today?</h2>
            <p>Ask me anything about Coppin State University</p>
          </div>
          <PromptSuggestionsRow onPromptClick={handlePrompt} />
        </div>
      ) : (
        <div className="chat-messages">
          {messages.map((message) => (
            <Bubble key={message.id} message={message} />
          ))}
          {isLoading && <LoadingBubble />}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Sticky footer */}
      <footer className="chat-footer">
        <form ref={formRef} className="input-form" onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            className="input-textarea"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask something about Coppin State…"
            rows={1}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </form>
        <p className="input-hint">Enter to send · Shift+Enter for new line</p>
      </footer>
    </div>
  );
};

export default Home;
