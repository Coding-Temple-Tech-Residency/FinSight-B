import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import MarketPage from "./MarketPage";

const mockUseSearchParams = vi.fn();
const mockUseDashboard = vi.fn();
const mockUseStockQuote = vi.fn();
const mockUseMarketHistory = vi.fn();

vi.mock("react-router-dom", () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

vi.mock("../../dashboard/hooks/useDashboard", () => ({
  useDashboard: () => mockUseDashboard(),
}));

vi.mock("../hooks/useStockQuote", () => ({
  useStockQuote: (symbol: string) => mockUseStockQuote(symbol),
}));

vi.mock("../hooks/useMarketHistory", () => ({
  useMarketHistory: (symbol: string, range: string) =>
    mockUseMarketHistory(symbol, range),
}));

vi.mock("../components/StockSearch", () => ({
  default: () => <div>StockSearch</div>,
}));

vi.mock("../components/StockQuoteCard", () => ({
  default: () => <div>QuoteCard</div>,
}));

vi.mock("../components/CompanyOverviewCard", () => ({
  default: () => <div>CompanyOverviewCard</div>,
}));

vi.mock("../components/StockLineChart", () => ({
  default: () => <div>StockLineChart</div>,
}));

vi.mock("../components/TrendingStocks", () => ({
  default: () => <div>TrendingStocks</div>,
}));

describe("MarketPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseDashboard.mockReturnValue({
      symbol: "",
    });

    mockUseSearchParams.mockReturnValue([new URLSearchParams()]);

    mockUseStockQuote.mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });

    mockUseMarketHistory.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });
  });

  it("renders empty state when no symbol exists", () => {
    render(<MarketPage />);

    expect(
      screen.getByRole("heading", {
        name: "Search for a stock",
      }),
    ).toBeInTheDocument();
  });

  it("renders market content when a symbol exists", () => {
    mockUseDashboard.mockReturnValue({
      symbol: "AAPL",
    });

    render(<MarketPage />);

    expect(screen.getByText("QuoteCard")).toBeInTheDocument();
    expect(screen.getByText("CompanyOverviewCard")).toBeInTheDocument();
    expect(screen.getByText("StockLineChart")).toBeInTheDocument();
    expect(screen.getByText("TrendingStocks")).toBeInTheDocument();
  });

  it("shows refreshing status", () => {
    mockUseDashboard.mockReturnValue({
      symbol: "AAPL",
    });

    mockUseStockQuote.mockReturnValue({
      data: {},
      isLoading: false,
      isFetching: true,
      isError: false,
      error: null,
    });

    mockUseMarketHistory.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });

    render(<MarketPage />);

    expect(screen.getByText("Refreshing…")).toBeInTheDocument();
  });

  it("shows quote error message", () => {
    mockUseDashboard.mockReturnValue({
      symbol: "AAPL",
    });

    mockUseStockQuote.mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error("Quote error"),
    });

    render(<MarketPage />);

    expect(screen.getByText("Quote error")).toBeInTheDocument();
  });

  it("shows history loading state", () => {
    mockUseDashboard.mockReturnValue({
      symbol: "AAPL",
    });

    mockUseMarketHistory.mockReturnValue({
      data: [],
      isLoading: true,
      isFetching: false,
      isError: false,
      error: null,
    });

    render(<MarketPage />);

    expect(screen.getByText("Loading price history...")).toBeInTheDocument();
  });

  it("shows history error state", () => {
    mockUseDashboard.mockReturnValue({
      symbol: "AAPL",
    });

    mockUseMarketHistory.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error("History error"),
    });

    render(<MarketPage />);

    expect(screen.getByText("Price history unavailable")).toBeInTheDocument();

    expect(screen.getByText("History error")).toBeInTheDocument();
  });
});
