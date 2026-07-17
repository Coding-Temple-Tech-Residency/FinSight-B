import { useState } from "react";

import { useDashboard } from "../../dashboard/hooks/useDashboard";
import { useAIChat } from "../hooks/useAIChat";
import type { AIChatMessage } from "../types/chat";

const Chat = () => {
  const { symbol } = useDashboard();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<AIChatMessage[]>([]);

  const { mutate: sendMessage, isPending, isError, error, reset } = useAIChat();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || isPending) return;

    reset();

    const userMessage: AIChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedMessage,
      created_at: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMessage]);

    setMessage("");

    sendMessage(
      {
        message: trimmedMessage,
        symbol,
      },
      {
        onSuccess: (response) => {
          const responseMessage = response.message.trim();

          if (!responseMessage) return;

          setMessages((current) => [
            ...current,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: responseMessage,
              created_at: new Date().toISOString(),
            },
          ]);
        },
      },
    );
  };

  return (
    <section className="chat-page">
      <header className="chat-header">
        <h1>Ask FinSight AI</h1>
        <p>Currently discussing {symbol}.</p>
      </header>

      <div className="chat-messages" aria-live="polite">
        {messages.length === 0 && (
          <p>Ask a question about {symbol}, the market, or your portfolio.</p>
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
          <article className="chat-message assistant">
            <p>Thinking...</p>
          </article>
        )}

        {isError && (
          <div className="chat-error">
            <p className="negative">
              {error instanceof Error
                ? error.message
                : "Unable to send your message."}
            </p>

            <p className="metric-label">
              The AI backend may not be available yet.
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
          maxLength={1000}
          autoComplete="off"
          onChange={(event) => setMessage(event.target.value)}
          placeholder={`Ask about ${symbol}...`}
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
