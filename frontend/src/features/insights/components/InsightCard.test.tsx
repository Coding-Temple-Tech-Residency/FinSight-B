import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import InsightCard from "./InsightCard";

vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span>Icon</span>,
}));

vi.mock("../../../components/ui/Modal", () => ({
  default: ({
    isOpen,
    title,
    onClose,
    children,
  }: {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
  }) =>
    isOpen ? (
      <div>
        <h2>{title}</h2>
        <button onClick={onClose}>Close Modal</button>
        {children}
      </div>
    ) : null,
}));

vi.mock("../utils/insightFormatting", () => ({
  formatInsightDate: () => "Jan 1, 2024",
  getInsightTypeLabel: () => "Market Analysis",
  getSentimentLabel: () => "Positive",
}));

describe("InsightCard", () => {
  const insight = {
    id: 1,
    insight_type: "market_analysis",
    sentiment: "positive",
    summary: "AI generated summary",
    created_at: "2024-01-01",
    source: "OpenAI",
  } as never;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders insight information", () => {
    render(
      <InsightCard insight={insight} isDeleting={false} onDelete={vi.fn()} />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Market Analysis",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("AI generated summary")).toBeInTheDocument();

    expect(screen.getByText("Positive")).toBeInTheDocument();
    expect(screen.getByText("Source: OpenAI")).toBeInTheDocument();
  });

  it("opens modal when Read full insight is clicked", async () => {
    const user = userEvent.setup();

    render(
      <InsightCard insight={insight} isDeleting={false} onDelete={vi.fn()} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Read full insight",
      }),
    );

    expect(
      screen.getByRole("button", {
        name: "Close Modal",
      }),
    ).toBeInTheDocument();

    expect(screen.getAllByText("AI generated summary")).toHaveLength(2);
  });

  it("calls onDelete from delete icon", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <InsightCard insight={insight} isDeleting={false} onDelete={onDelete} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Delete Market Analysis",
      }),
    );

    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("calls onDelete from modal", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <InsightCard insight={insight} isDeleting={false} onDelete={onDelete} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Read full insight",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: /Delete insight/i,
      }),
    );

    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("shows deleting state", () => {
    render(<InsightCard insight={insight} isDeleting onDelete={vi.fn()} />);

    expect(screen.getByText("Deleting insight...")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Delete Market Analysis",
      }),
    ).toBeDisabled();
  });
});
