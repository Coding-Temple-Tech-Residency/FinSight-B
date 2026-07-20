import { useState } from "react";

import { useAIChat } from "../hooks/useAIChat";
import type { AIChatMessage } from "../types/chat";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<AIChatMessage[]>([]);

  const { mutate: sendMessage, isPending, isError, error, reset } = useAIChat();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || isPending) {
      return;
    }

    reset();

    const userMessage: AIChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedMessage,
      created_at: new Date().toISOString(),
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);

    setMessage("");

    sendMessage(
      {
        message: trimmedMessage,
      },
      {
        onSuccess: (insight) => {
          const responseMessage = insight.summary.trim();

          if (!responseMessage) {
            return;
          }

          const assistantMessage: AIChatMessage = {
            id: String(insight.id),
            role: "assistant",
            content: responseMessage,
            created_at: insight.created_at,
          };

          setMessages((currentMessages) => [
            ...currentMessages,
            assistantMessage,
          ]);
        },
      },
    );
  };

  return (
    <section className="chat-page">
      <header className="chat-header">
        <h1>Ask FinSight AI</h1>

        <p>Ask questions about the market and your current portfolios.</p>
      </header>

      <div className="chat-messages" aria-live="polite">
        {messages.length === 0 && (
          <p>
            Ask about your portfolios, holdings, diversification, or the market.
          </p>
        )}

        {messages.map((chatMessage) => (
          <article
            key={chatMessage.id}
            className={`chat-message ${chatMessage.role}`}
          >
            <p>{chatMessage.content}</p>
          </article>
        ))}

        {isPending && (
          <article className="chat-message assistant" role="status">
            <p>Thinking...</p>
          </article>
        )}

        {isError && (
          <div className="chat-error" role="alert">
            <p className="negative">
              {error instanceof Error
                ? error.message
                : "Unable to send your message."}
            </p>
          </div>
        )}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <label htmlFor="ai-chat-message" className="sr-only">
          Ask FinSight AI
        </label>

        <input
          id="ai-chat-message"
          value={message}
          maxLength={4000}
          autoComplete="off"
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Ask about your portfolios..."
        />

        <button type="submit" disabled={!message.trim() || isPending}>
          {isPending ? "Sending..." : "Send"}
        </button>
      </form>

      <p className="ai-disclaimer">
        AI responses are informational and are not financial advice.
      </p>
    </section>
  );
};

export default Chat;
