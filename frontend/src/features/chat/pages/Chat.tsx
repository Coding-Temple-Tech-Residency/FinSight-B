import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateRight,
  faPaperPlane,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import Modal from "../../../components/ui/Modal";

import { useDashboard } from "../../dashboard/hooks/useDashboard";
import { useAIChat } from "../hooks/useAIChat";

import type { AIChatMessage } from "../types/chat";

import "../styles/chat.css";

const CHAT_STORAGE_KEY = "finsight-ai-chat";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to send your message.";
};

const loadStoredMessages = (): AIChatMessage[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedMessages = window.localStorage.getItem(CHAT_STORAGE_KEY);

    if (!storedMessages) {
      return [];
    }

    const parsedMessages: unknown = JSON.parse(storedMessages);

    if (!Array.isArray(parsedMessages)) {
      return [];
    }

    return parsedMessages.filter(
      (item): item is AIChatMessage =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "role" in item &&
        "content" in item &&
        typeof item.id === "string" &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string",
    );
  } catch {
    return [];
  }
};

const Chat = () => {
  const { symbol } = useDashboard();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<AIChatMessage[]>(loadStoredMessages);
  const [failedMessage, setFailedMessage] = useState<string | null>(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: sendMessage, isPending, isError, error, reset } = useAIChat();

  const hasMessages = messages.length > 0;
  const characterCount = message.length;

  const suggestedPrompts = [
    "Analyze all of my portfolios.",
    "How diversified are my holdings?",
    "What are the biggest risks in my portfolios?",
    `What should I know about ${symbol}?`,
  ];

  useEffect(() => {
    try {
      window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Local storage may be unavailable in private browsing environments.
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isPending, isError]);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";

    const nextHeight = Math.min(textarea.scrollHeight, 160);

    textarea.style.height = `${nextHeight}px`;
  }, [message]);

  const submitMessage = (content: string, appendUserMessage = true) => {
    const trimmedMessage = content.trim();

    if (!trimmedMessage || isPending) {
      return;
    }

    reset();
    setFailedMessage(trimmedMessage);

    if (appendUserMessage) {
      const userMessage: AIChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmedMessage,
        created_at: new Date().toISOString(),
      };

      setMessages((currentMessages) => [...currentMessages, userMessage]);
    }

    setMessage("");

    sendMessage(
      {
        message: trimmedMessage,
      },
      {
        onSuccess: (response) => {
          const responseMessage = response.summary?.trim();

          if (!responseMessage) {
            setFailedMessage(trimmedMessage);
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

          setFailedMessage(null);
        },
        onError: () => {
          setFailedMessage(trimmedMessage);
        },
      },
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitMessage(message);
  };

  const handleTextareaKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      submitMessage(message);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    submitMessage(prompt);
  };

  const handleRetry = () => {
    if (!failedMessage || isPending) {
      return;
    }

    submitMessage(failedMessage, false);
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
    setFailedMessage(null);
    reset();
    setIsClearModalOpen(false);

    try {
      window.localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {
      // Local storage may be unavailable.
    }

    textareaRef.current?.focus();
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
              <div className="chat-empty-copy">
                <h2>Start a conversation</h2>

                <p>
                  Ask a question about {symbol}, market activity,
                  diversification, portfolio risk, or your current holdings.
                </p>
              </div>

              <div
                className="chat-suggestions"
                aria-label="Suggested questions"
              >
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="chat-suggestion-button"
                    onClick={() => handleSuggestedPrompt(prompt)}
                    disabled={isPending}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
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
              aria-label="FinSight AI is thinking"
            >
              <span className="chat-message-role">FinSight AI</span>

              <div className="chat-thinking-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              <span className="sr-only">
                FinSight AI is generating a response.
              </span>
            </article>
          )}

          {isError && (
            <div className="chat-error" role="alert">
              <div>
                <p className="negative">{getErrorMessage(error)}</p>

                <p className="metric-label">
                  Check that the backend and AI service are available, then try
                  again.
                </p>
              </div>

              <button
                type="button"
                className="chat-retry-button"
                onClick={handleRetry}
                disabled={!failedMessage || isPending}
              >
                <FontAwesomeIcon icon={faArrowRotateRight} aria-hidden="true" />
                Retry
              </button>
            </div>
          )}

          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        <form className="chat-form" onSubmit={handleSubmit}>
          <div className="chat-input-container">
            <label htmlFor="ai-chat-message" className="sr-only">
              Ask FinSight AI
            </label>

            <textarea
              ref={textareaRef}
              id="ai-chat-message"
              className="chat-input"
              value={message}
              rows={1}
              maxLength={4000}
              autoComplete="off"
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder={`Ask about ${symbol} or your portfolio...`}
              disabled={isPending}
            />

            <span className="chat-character-count" aria-live="polite">
              {characterCount}/4000
            </span>
          </div>

          <button
            type="submit"
            className="chat-send-button"
            disabled={!message.trim() || isPending}
          >
            <FontAwesomeIcon icon={faPaperPlane} aria-hidden="true" />

            <span>{isPending ? "Sending..." : "Send"}</span>
          </button>
        </form>

        <div className="chat-form-help">
          <p>Press Enter to send. Use Shift + Enter for a new line.</p>

          <p className="ai-disclaimer">
            AI responses are for educational purposes only and are not financial
            advice.
          </p>
        </div>
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
            Messages will be removed from this device. Saved AI insights will
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
