type ChatFollowUpSuggestionsProps = {
  symbol: string;
  disabled?: boolean;
  onSelect: (prompt: string) => void;
};

const ChatFollowUpSuggestions = ({
  symbol,
  disabled = false,
  onSelect,
}: ChatFollowUpSuggestionsProps) => {
  const followUpPrompts = [
    "Analyze the diversification across all of my portfolios.",
    "Identify the biggest concentration risks in my portfolios.",
    "Compare the estimated performance of my portfolios.",
    `Explain how ${symbol} could affect my overall portfolio risk.`,
  ];

  return (
    <div className="chat-follow-ups" aria-label="Suggested follow-up questions">
      <p className="chat-follow-ups-label">Continue exploring</p>

      <div className="chat-follow-ups-list">
        {followUpPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="chat-follow-up-button"
            onClick={() => onSelect(prompt)}
            disabled={disabled}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatFollowUpSuggestions;
