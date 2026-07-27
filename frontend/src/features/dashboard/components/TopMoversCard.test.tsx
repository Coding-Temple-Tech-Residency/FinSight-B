import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import TopMoversCard from "./TopMoversCard";

const mockUseHoldings = vi.fn();
const mockCalculatePortfolioPerformance = vi.fn();

vi.mock("../../portfolio/hooks/useHoldings", () => ({
  useHoldings: () => mockUseHoldings(),
}));

vi.mock("../../portfolio/utils/portfolioCalculations", () => ({
  calculatePortfolioPerformance: (...args: unknown[]) =>
    mockCalculatePortfolioPerformance(...args),
}));

vi.mock("react-router-dom", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

describe("TopMoversCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockCalculatePortfolioPerformance.mockReturnValue({
      pricedHoldings: 1,
      holdingPerformance: [],
    });
  });

  it("renders loading state", () => {
    mockUseHoldings.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
      error: null,
    });

    render(<TopMoversCard portfolioId={1} />);

    expect(screen.getByText("Loading portfolio movers...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockUseHoldings.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      error: new Error("Failed"),
    });

    render(<TopMoversCard portfolioId={1} />);

    expect(screen.getByText("Unable to load movers")).toBeInTheDocument();

    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("renders no portfolio state", () => {
    mockUseHoldings.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<TopMoversCard />);

    expect(screen.getByText("No portfolio available")).toBeInTheDocument();
  });

  it("renders no holdings state", () => {
    mockUseHoldings.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<TopMoversCard portfolioId={1} />);

    expect(screen.getByText("No holdings yet")).toBeInTheDocument();
  });

  it("renders performance unavailable state", () => {
    mockUseHoldings.mockReturnValue({
      data: [
        {
          id: 1,
          symbol: "AAPL",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    });

    mockCalculatePortfolioPerformance.mockReturnValue({
      pricedHoldings: 0,
      holdingPerformance: [],
    });

    render(<TopMoversCard portfolioId={1} />);

    expect(screen.getByText("Performance unavailable")).toBeInTheDocument();
  });

  it("renders top gainers and losers", () => {
    mockUseHoldings.mockReturnValue({
      data: [
        {
          id: 1,
          symbol: "AAPL",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    });

    mockCalculatePortfolioPerformance.mockReturnValue({
      pricedHoldings: 2,
      holdingPerformance: [
        {
          holding: {
            id: 1,
            symbol: "AAPL",
            company_name: "Apple",
          },
          gainLossPercent: 10,
          shares: 5,
        },
        {
          holding: {
            id: 2,
            symbol: "TSLA",
            company_name: "Tesla",
          },
          gainLossPercent: -5,
          shares: 3,
        },
      ],
    });

    render(<TopMoversCard portfolioId={1} portfolioName="My Portfolio" />);

    expect(screen.getByText("Top Gainers")).toBeInTheDocument();

    expect(screen.getByText("Top Losers")).toBeInTheDocument();

    expect(screen.getByText("Apple")).toBeInTheDocument();

    expect(screen.getByText("Tesla")).toBeInTheDocument();

    expect(screen.getByText("+10.00%")).toBeInTheDocument();

    expect(screen.getByText("-5.00%")).toBeInTheDocument();
  });
});
