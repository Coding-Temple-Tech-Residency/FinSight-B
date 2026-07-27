import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AIInsightCard from "./AIInsightCard";

const mockUseAIInsights = vi.fn();
const mockUseGeneratePortfolioAIInsight = vi.fn();
const mockUseDeleteAIInsight = vi.fn();

vi.mock("../../insights/hooks/useAIInsights", () => ({
  useAIInsights: () => mockUseAIInsights(),
  useGeneratePortfolioAIInsight: () => mockUseGeneratePortfolioAIInsight(),
  useDeleteAIInsight: () => mockUseDeleteAIInsight(),
}));

vi.mock("../../insights/utils/insightFormatting", () => ({
  formatInsightDate: () => "Jan 1, 2026",
  getInsightTypeLabel: () => "Portfolio Analysis",
  getSentimentLabel: () => "Positive",
}));

vi.mock("../../../components/ui/Modal", () => ({
  default: ({
    isOpen,
    title,
    children,
    onClose,
  }: {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div>
        <h2>{title}</h2>
        <button onClick={onClose}>Close Modal</button>
        {children}
      </div>
    ) : null,
}));

vi.mock("../../insights/components/DeleteInsightModal", () => ({
  default: ({
    isOpen,
    onConfirm,
    onClose,
  }: {
    isOpen: boolean;
    onConfirm: () => void;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div>
        <button onClick={onConfirm}>Confirm Delete</button>
        <button onClick={onClose}>Cancel Delete</button>
      </div>
    ) : null,
}));

vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span>Icon</span>,
}));

vi.mock("react-router-dom", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

describe("AIInsightCard", () => {
  const insight = {
    id: 1,
    insight_type: "portfolio",
    portfolio_id: 10,
    sentiment: "positive",
    summary: "Portfolio is performing well.",
    created_at: "2026-01-01",
    source: "AI",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseGeneratePortfolioAIInsight.mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      mutateAsync: vi.fn(),
    });

    mockUseDeleteAIInsight.mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      mutateAsync: vi.fn(),
    });
  });

  it("renders loading state", () => {
    mockUseAIInsights.mockReturnValue({
      data: [],
      isLoading: true,
      isFetching: false,
      isError: false,
      error: null,
    });

    render(<AIInsightCard portfolioId={10} />);

    expect(
      screen.getByText("Loading portfolio insight..."),
    ).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockUseAIInsights.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error("Failed loading insights"),
    });

    render(<AIInsightCard portfolioId={10} />);

    expect(screen.getByText("Failed loading insights")).toBeInTheDocument();
  });

  it("renders empty insight state", () => {
    mockUseAIInsights.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });

    render(<AIInsightCard portfolioId={10} />);

    expect(
      screen.getByText(
        "Generate an AI analysis for the selected portfolio to see its latest insight.",
      ),
    ).toBeInTheDocument();
  });

  it("renders latest portfolio insight", () => {
    mockUseAIInsights.mockReturnValue({
      data: [insight],
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });

    render(<AIInsightCard portfolioId={10} />);

    expect(
      screen.getByText("Portfolio is performing well."),
    ).toBeInTheDocument();

    expect(screen.getByText("Source: AI")).toBeInTheDocument();

    expect(screen.getByText("Generate new insight")).toBeInTheDocument();
  });

  it("opens insight modal", async () => {
    const user = userEvent.setup();

    mockUseAIInsights.mockReturnValue({
      data: [insight],
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });

    render(<AIInsightCard portfolioId={10} />);

    await user.click(
      screen.getByRole("button", {
        name: "Read full insight",
      }),
    );

    expect(
      screen.getAllByRole("heading", {
        name: "Portfolio AI Insight",
      }),
    ).toHaveLength(2);
  });

  it("opens delete modal and confirms deletion", async () => {
    const user = userEvent.setup();

    const mutateAsync = vi.fn().mockResolvedValue(undefined);

    mockUseAIInsights.mockReturnValue({
      data: [insight],
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });

    mockUseDeleteAIInsight.mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      mutateAsync,
    });

    render(<AIInsightCard portfolioId={10} />);

    await user.click(
      screen.getByRole("button", {
        name: "Delete current portfolio insight",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Confirm Delete",
      }),
    );

    expect(mutateAsync).toHaveBeenCalledWith(1);
  });

  it("calls generate mutation", async () => {
    const user = userEvent.setup();

    const mutateAsync = vi.fn().mockResolvedValue(undefined);

    mockUseAIInsights.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });

    mockUseGeneratePortfolioAIInsight.mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      mutateAsync,
    });

    render(<AIInsightCard portfolioId={10} />);

    await user.click(
      screen.getByRole("button", {
        name: "Generate portfolio insight",
      }),
    );

    expect(mutateAsync).toHaveBeenCalledWith({
      portfolioId: 10,
    });
  });
});
