import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PortfolioAnalytics from "./PortfolioAnalytics";

vi.mock("../utils/portfolioCalculations", () => ({
  calculatePortfolioPerformance: vi.fn(),
}));

import { calculatePortfolioPerformance } from "../utils/portfolioCalculations";

const mockedCalculatePortfolioPerformance = vi.mocked(
  calculatePortfolioPerformance,
);

describe("PortfolioAnalytics", () => {
  it("renders loading state", () => {
    render(<PortfolioAnalytics holdings={[]} isLoading />);

    expect(
      screen.getByText("Calculating portfolio analytics..."),
    ).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<PortfolioAnalytics holdings={[]} />);

    expect(screen.getByText("No analytics yet")).toBeInTheDocument();
    expect(
      screen.getByText("Add holdings to begin tracking portfolio performance."),
    ).toBeInTheDocument();
  });

  it("renders price unavailable state", () => {
    mockedCalculatePortfolioPerformance.mockReturnValue({
      pricedHoldings: 0,
      totalHoldings: 1,
    } as never);

    render(<PortfolioAnalytics holdings={[{} as never]} />);

    expect(screen.getByText("Price data unavailable")).toBeInTheDocument();
  });

  it("renders analytics data", () => {
    mockedCalculatePortfolioPerformance.mockReturnValue({
      pricedHoldings: 1,
      totalHoldings: 1,
      hasMixedCurrencies: false,
      currency: "USD",
      totalMarketValue: 1000,
      totalGainLoss: 100,
      totalGainLossPercent: 10,
      totalCostBasis: 900,
      largestHolding: {
        holding: { symbol: "AAPL" },
        marketValue: 1000,
      },
      bestPerformer: {
        holding: { symbol: "AAPL" },
        gainLossPercent: 10,
      },
      worstPerformer: {
        holding: { symbol: "TSLA" },
        gainLossPercent: -5,
      },
    } as never);

    render(<PortfolioAnalytics holdings={[{} as never]} />);

    expect(
      screen.getByRole("heading", { name: "Portfolio Analytics" }),
    ).toBeInTheDocument();

    expect(screen.getAllByText("AAPL")).toHaveLength(2);
    expect(screen.getByText("TSLA")).toBeInTheDocument();
  });
});
