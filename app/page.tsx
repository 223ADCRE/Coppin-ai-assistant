"use client";

import Image from "next/image";
import logo from "./assets/logo.png";

import { useChat, Message } from "ai/react";
import Bubble from "./components/Bubble";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";

const Home = () => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append, // ✅ important for manual messages
  } = useChat();

  const noMessages = messages.length === 0;

  // ✅ YOUR FEATURE (manual prompt injection)
  const handlePrompt = (promptText: string) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user",
    };

    append(msg); // 🔥 inject into chat
  };

  return (
    <main>
      {/* Logo */}
      <Image src={logo} width={180} height={60} alt="Chatbot logo" />

      <section className={noMessages ? "" : "populated"}>
        
        {/* EMPTY STATE */}
        {noMessages ? (
          <>
            <p className="starter-text">
              Ask me anything about Coppin State University!
            </p>

            <PromptSuggestionsRow onPromptClick={handlePrompt} />
          </>
        ) : (
          <>
            {/* CHAT MESSAGES */}
            {messages.map((message) => (
              <Bubble key={message.id} message={message} />
            ))}

            {isLoading && <LoadingBubble />}
          </>
        )}

        {/* INPUT */}
        <form onSubmit={handleSubmit} className="input-area">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask something..."
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Thinking..." : "Send"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Home;