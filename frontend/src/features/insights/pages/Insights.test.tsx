import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Insights from "./Insights";

const refetch = vi.fn();
const mutateAsync = vi.fn();

const {
  mockUseAIInsights,
  mockUseDeleteAIInsight,
  mockUsePortfolios,
  mockUseGeneratePortfolioAIInsight,
  mockUseGenerateStockAIInsight,
} = vi.hoisted(() => ({
  mockUseAIInsights: vi.fn(),
  mockUseDeleteAIInsight: vi.fn(),
  mockUsePortfolios: vi.fn(),
  mockUseGeneratePortfolioAIInsight: vi.fn(),
  mockUseGenerateStockAIInsight: vi.fn(),
}));

vi.mock("../hooks/useAIInsights", () => ({
  useAIInsights: () => mockUseAIInsights(),
  useDeleteAIInsight: () => mockUseDeleteAIInsight(),
  useGeneratePortfolioAIInsight: () => mockUseGeneratePortfolioAIInsight(),
  useGenerateStockAIInsight: () => mockUseGenerateStockAIInsight(),
}));

vi.mock("../../portfolio/hooks/usePortfolio", () => ({
  usePortfolios: () => mockUsePortfolios(),
}));

vi.mock("../../search/components/StockSearchInput", () => ({
  default: () => <div>StockSearchInput</div>,
}));

vi.mock("../../../components/ui/LoadingCard", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("../../../components/ui/ErrorCard", () => ({
  default: ({ message }: { message: string }) => <div>{message}</div>,
}));

vi.mock("../../../components/ui/EmptyCard", () => ({
  default: ({ title, message }: { title: string; message: string }) => (
    <div>
      <p>{title}</p>
      <p>{message}</p>
    </div>
  ),
}));

vi.mock("../components/InsightCard", () => ({
  default: ({
    insight,
    onDelete,
  }: {
    insight: { id: number; summary: string };
    onDelete: (id: number) => void;
  }) => (
    <div>
      <span>{insight.summary}</span>
      <button onClick={() => onDelete(insight.id)}>Delete</button>
    </div>
  ),
}));

vi.mock("../components/DeleteInsightModal", () => ({
  default: ({
    isOpen,
    onClose,
    onConfirm,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }) =>
    isOpen ? (
      <div>
        <button onClick={onConfirm}>Confirm Delete</button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

describe("Insights", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUsePortfolios.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });

    mockUseDeleteAIInsight.mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      mutateAsync,
    });

    mockUseGeneratePortfolioAIInsight.mockReturnValue({
      isPending: false,
      mutateAsync: vi.fn(),
    });

    mockUseGenerateStockAIInsight.mockReturnValue({
      isPending: false,
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
      refetch,
    });

    render(<Insights />);

    expect(screen.getByText("Loading insights...")).toBeInTheDocument();
  });

  it("renders error state and retries", async () => {
    const user = userEvent.setup();

    mockUseAIInsights.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error("Failed"),
      refetch,
    });

    render(<Insights />);

    expect(screen.getByText("Failed")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /try again/i }));

    expect(refetch).toHaveBeenCalled();
  });

  it("renders empty state", () => {
    mockUseAIInsights.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch,
    });

    render(<Insights />);

    expect(screen.getByText("No AI insights")).toBeInTheDocument();
  });

  it("renders insights", () => {
    mockUseAIInsights.mockReturnValue({
      data: [
        {
          id: 1,
          summary: "Insight One",
        },
      ],
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch,
    });

    render(<Insights />);

    expect(screen.getByText("Insight One")).toBeInTheDocument();
  });

  it("opens delete modal and confirms deletion", async () => {
    const user = userEvent.setup();

    mutateAsync.mockResolvedValue(undefined);

    mockUseAIInsights.mockReturnValue({
      data: [
        {
          id: 1,
          summary: "Insight One",
        },
      ],
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch,
    });

    render(<Insights />);

    await user.click(screen.getByRole("button", { name: /delete/i }));

    await user.click(screen.getByRole("button", { name: /confirm delete/i }));

    expect(mutateAsync).toHaveBeenCalledWith(1);
  });
});
