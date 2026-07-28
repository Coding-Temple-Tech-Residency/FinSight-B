import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateRight,
  faCheck,
  faCopy,
  faPaperPlane,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import Modal from "../../../components/ui/Modal";
import ChatFollowUpSuggestions from "../components/ChatFollowUpSuggestions";
import ChatMessageContent from "../components/ChatMessageContent";

import { useDashboard } from "../../dashboard/hooks/useDashboard";
import { useAIChat } from "../hooks/useAIChat";
import { useCurrency } from "../../currency/hooks/useCurrency";

import type { AIChatMessage } from "../types/chat";

import "../styles/chat.css";
import "../styles/chat-enhancements.css";

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

const formatMessageTime = (createdAt?: string): string => {
  if (!createdAt) {
    return "";
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const copyToClipboard = async (content: string): Promise<void> => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(content);
    return;
  }

  const textarea = document.createElement("textarea");

  textarea.value = content;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();

  document.execCommand("copy");
  document.body.removeChild(textarea);
};

const Chat = () => {
  const { symbol } = useDashboard();
  const { preferredCurrency } = useCurrency();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<AIChatMessage[]>(loadStoredMessages);

  const [failedMessage, setFailedMessage] = useState<string | null>(null);

  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const newestAssistantMessageRef = useRef<HTMLElement>(null);
  const previousAssistantMessageIdRef = useRef<string | undefined>(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  const { mutate: sendMessage, isPending, isError, error, reset } = useAIChat();

  const hasMessages = messages.length > 0;
  const characterCount = message.length;
  const lastMessage = messages.at(-1);

  const lastAssistantMessageId = useMemo(() => {
    return [...messages]
      .reverse()
      .find((chatMessage) => chatMessage.role === "assistant")?.id;
  }, [messages]);

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
      // Local storage may be unavailable.
    }
  }, [messages]);

  useEffect(() => {
    if (
      !lastAssistantMessageId ||
      previousAssistantMessageIdRef.current === lastAssistantMessageId
    ) {
      return;
    }

    previousAssistantMessageIdRef.current = lastAssistantMessageId;

    newestAssistantMessageRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [lastAssistantMessageId]);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";

    const nextHeight = Math.min(textarea.scrollHeight, 160);

    textarea.style.height = `${nextHeight}px`;
  }, [message]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

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
        symbol,
        preferredCurrency,
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

  const handleCopyMessage = async (chatMessage: AIChatMessage) => {
    try {
      await copyToClipboard(chatMessage.content);

      setCopiedMessageId(chatMessage.id);

      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = window.setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (copyError) {
      console.error("Unable to copy chat response:", copyError);
    }
  };

  const handleRegenerateResponse = (assistantMessageId: string) => {
    if (isPending) {
      return;
    }

    const assistantMessageIndex = messages.findIndex(
      (chatMessage) => chatMessage.id === assistantMessageId,
    );

    if (assistantMessageIndex <= 0) {
      return;
    }

    const previousUserMessage = [...messages]
      .slice(0, assistantMessageIndex)
      .reverse()
      .find((chatMessage) => chatMessage.role === "user");

    if (!previousUserMessage) {
      return;
    }

    setMessages((currentMessages) =>
      currentMessages.filter(
        (chatMessage) => chatMessage.id !== assistantMessageId,
      ),
    );

    submitMessage(previousUserMessage.content, false);
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
    setCopiedMessageId(null);
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

          {messages.map((chatMessage) => {
            const messageTime = formatMessageTime(chatMessage.created_at);

            const isCopied = copiedMessageId === chatMessage.id;

            const canRegenerate =
              chatMessage.role === "assistant" &&
              chatMessage.id === lastAssistantMessageId;

            return (
              <article
                key={chatMessage.id}
                ref={
                  chatMessage.role === "assistant" &&
                  chatMessage.id === lastAssistantMessageId
                    ? newestAssistantMessageRef
                    : undefined
                }
                className={`chat-message ${chatMessage.role}`}
              >
                <div className="chat-message-header">
                  <span className="chat-message-role">
                    {chatMessage.role === "user" ? "You" : "FinSight AI"}
                  </span>

                  {messageTime && (
                    <time
                      className="chat-message-time"
                      dateTime={chatMessage.created_at}
                    >
                      {messageTime}
                    </time>
                  )}
                </div>

                {chatMessage.role === "assistant" ? (
                  <ChatMessageContent content={chatMessage.content} />
                ) : (
                  <p>{chatMessage.content}</p>
                )}

                {chatMessage.role === "assistant" && (
                  <div
                    className="chat-message-actions"
                    aria-label="AI response actions"
                  >
                    <button
                      type="button"
                      className="chat-message-action"
                      onClick={() => handleCopyMessage(chatMessage)}
                      aria-label={
                        isCopied ? "Response copied" : "Copy response"
                      }
                      title={isCopied ? "Copied" : "Copy response"}
                    >
                      <FontAwesomeIcon
                        icon={isCopied ? faCheck : faCopy}
                        aria-hidden="true"
                      />

                      <span>{isCopied ? "Copied" : "Copy"}</span>
                    </button>

                    {canRegenerate && (
                      <button
                        type="button"
                        className="chat-message-action"
                        onClick={() => handleRegenerateResponse(chatMessage.id)}
                        disabled={isPending}
                        aria-label="Regenerate response"
                        title="Regenerate response"
                      >
                        <FontAwesomeIcon
                          icon={faArrowRotateRight}
                          aria-hidden="true"
                        />

                        <span>Regenerate</span>
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })}

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

          {hasMessages &&
            !isPending &&
            !isError &&
            lastMessage?.role === "assistant" && (
              <ChatFollowUpSuggestions
                symbol={symbol}
                disabled={isPending}
                onSelect={handleSuggestedPrompt}
              />
            )}

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
