import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Chat from "./Chat";

const mockSendMessage = vi.fn();

vi.mock("../hooks/useAIChat", () => ({
  useAIChat: () => ({
    mutate: mockSendMessage,
    isPending: false,
    isError: false,
    error: null,
    reset: vi.fn(),
  }),
}));

vi.mock("../../dashboard/hooks/useDashboard", () => ({
  useDashboard: () => ({
    symbol: "AAPL",
  }),
}));

vi.mock("../../currency/hooks/useCurrency", () => ({
  useCurrency: () => ({
    preferredCurrency: "USD",
  }),
}));

vi.mock("../components/ChatMessageContent", () => ({
  default: ({ content }: { content: string }) => <p>{content}</p>,
}));

vi.mock("../components/ChatFollowUpSuggestions", () => ({
  default: () => <div>Follow ups</div>,
}));

vi.mock("../../../components/ui/Modal", () => ({
  default: ({
    isOpen,
    children,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
  }) => (isOpen ? <div>{children}</div> : null),
}));

vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span>Icon</span>,
}));

describe("Chat", () => {
  beforeEach(() => {
    localStorage.clear();
    Element.prototype.scrollIntoView = vi.fn();

    vi.clearAllMocks();
  });

  it("renders empty chat state", () => {
    render(<Chat />);

    expect(screen.getByText("Start a conversation")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Ask about AAPL or your portfolio..."),
    ).toBeInTheDocument();
  });

  it("enables send button when message is entered", async () => {
    const user = userEvent.setup();

    render(<Chat />);

    const input = screen.getByPlaceholderText(
      "Ask about AAPL or your portfolio...",
    );

    await user.type(input, "Analyze my portfolio");

    expect(
      screen.getByRole("button", {
        name: /Send/,
      }),
    ).toBeEnabled();
  });

  it("sends message", async () => {
    const user = userEvent.setup();

    render(<Chat />);

    const input = screen.getByPlaceholderText(
      "Ask about AAPL or your portfolio...",
    );

    await user.type(input, "Analyze my portfolio");

    await user.click(
      screen.getByRole("button", {
        name: /Send/,
      }),
    );

    expect(mockSendMessage).toHaveBeenCalled();
  });

  it("opens clear chat modal", async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      "finsight-ai-chat",
      JSON.stringify([
        {
          id: "1",
          role: "user",
          content: "Hello",
        },
      ]),
    );

    render(<Chat />);

    await user.click(
      screen.getByRole("button", {
        name: /Clear chat/,
      }),
    );

    expect(
      screen.getByText("Are you sure you want to clear this conversation?"),
    ).toBeInTheDocument();
  });
});
