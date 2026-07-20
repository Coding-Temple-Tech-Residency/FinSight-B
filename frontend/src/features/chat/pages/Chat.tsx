import { useEffect, useRef, useState, type FormEvent } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import Modal from "../../../components/ui/Modal";

import { useDashboard } from "../../dashboard/hooks/useDashboard";
import { useAIChat } from "../hooks/useAIChat";

import type { AIChatMessage } from "../types/chat";

import "../styles/chat.css";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to send your message.";
};

const Chat = () => {
  const { symbol } = useDashboard();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { mutate: sendMessage, isPending, isError, error, reset } = useAIChat();

  const hasMessages = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isPending]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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
        onSuccess: (response) => {
          const responseMessage = response.summary.trim();

          if (!responseMessage) {
            return;
          }

          const assistantMessage: AIChatMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: responseMessage,
            created_at: response.created_at ?? new Date().toISOString(),
          };

          setMessages((currentMessages) => [
            ...currentMessages,
            assistantMessage,
          ]);
        },
      },
    );
  };

  const openClearModal = () => {
    if (!hasMessages || isPending) {
      return;
    }

    setIsClearModalOpen(true);
  };

  const closeClearModal = () => {
    setIsClearModalOpen(false);
  };

  const handleClearChat = () => {
    if (isPending) {
      return;
    }

    setMessages([]);
    setMessage("");
    reset();
    setIsClearModalOpen(false);
  };

  return (
    <>
      <section className="chat-page">
        <header className="chat-header">
          <div>
            <p className="page-eyebrow">Artificial Intelligence</p>

            <h1>Ask FinSight AI</h1>

            <p>Ask about {symbol}, the market, or your portfolio holdings.</p>
          </div>

          <button
            type="button"
            className="chat-clear-button"
            onClick={openClearModal}
            disabled={!hasMessages || isPending}
            aria-haspopup="dialog"
          >
            <FontAwesomeIcon icon={faTrashCan} aria-hidden="true" />

            <span>Clear chat</span>
          </button>
        </header>

        <div className="chat-messages" aria-live="polite" aria-busy={isPending}>
          {!hasMessages && !isPending && (
            <div className="chat-empty-state">
              <h2>Start a conversation</h2>

              <p>
                Ask a question about {symbol}, market activity, diversification,
                portfolio risk, or your current holdings.
              </p>
            </div>
          )}

          {messages.map((chatMessage) => (
            <article
              key={chatMessage.id}
              className={`chat-message ${chatMessage.role}`}
            >
              <span className="chat-message-role">
                {chatMessage.role === "user" ? "You" : "FinSight AI"}
              </span>

              <p>{chatMessage.content}</p>
            </article>
          ))}

          {isPending && (
            <article
              className="chat-message assistant chat-thinking"
              role="status"
            >
              <span className="chat-message-role">FinSight AI</span>

              <p>Thinking...</p>
            </article>
          )}

          {isError && (
            <div className="chat-error" role="alert">
              <p className="negative">{getErrorMessage(error)}</p>

              <p className="metric-label">
                Check that the backend and AI service are available, then try
                again.
              </p>
            </div>
          )}

          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        <form className="chat-form" onSubmit={handleSubmit}>
          <label htmlFor="ai-chat-message" className="sr-only">
            Ask FinSight AI
          </label>

          <input
            id="ai-chat-message"
            className="chat-input"
            type="text"
            value={message}
            maxLength={4000}
            autoComplete="off"
            onChange={(event) => setMessage(event.target.value)}
            placeholder={`Ask about ${symbol} or your portfolio...`}
            disabled={isPending}
          />

          <button
            type="submit"
            className="chat-send-button"
            disabled={!message.trim() || isPending}
          >
            <FontAwesomeIcon icon={faPaperPlane} aria-hidden="true" />

            <span>{isPending ? "Sending..." : "Send"}</span>
          </button>
        </form>

        <p className="ai-disclaimer">
          AI responses are for educational purposes only and are not financial
          advice.
        </p>
      </section>

      <Modal
        isOpen={isClearModalOpen}
        title="Clear chat"
        onClose={closeClearModal}
        panelClassName="clear-chat-modal-panel"
      >
        <div className="clear-chat-modal">
          <p>Are you sure you want to clear this conversation?</p>

          <p className="metric-label">
            Messages will be removed from this screen. Saved AI insights will
            not be deleted.
          </p>

          <div className="clear-chat-actions">
            <button
              type="button"
              className="clear-chat-cancel"
              onClick={closeClearModal}
            >
              Cancel
            </button>

            <button
              type="button"
              className="clear-chat-confirm"
              onClick={handleClearChat}
            >
              <FontAwesomeIcon icon={faTrashCan} aria-hidden="true" />
              Clear chat
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Chat;
