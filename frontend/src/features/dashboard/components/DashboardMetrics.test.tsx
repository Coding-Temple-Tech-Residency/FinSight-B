import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Portfolio } from "../../portfolio/types/portfolio";
import type { StockQuote } from "../../market/types/stock";

import DashboardMetrics from "./DashboardMetrics";

vi.mock("./MetricCard", () => ({
  default: ({
    label,
    value,
    valueCaption,
    breakdownLabel,
    breakdown,
  }: {
    label: string;
    value: string;
    valueCaption?: string;
    breakdownLabel?: string;
    breakdown?: { id: string; label: string; value: string }[];
  }) => (
    <div>
      <p>{label}</p>
      <p>{value}</p>

      {valueCaption && <p>{valueCaption}</p>}

      {breakdownLabel && <p>{breakdownLabel}</p>}

      {breakdown?.map((item) => (
        <p key={item.id}>
          {item.label}: {item.value}
        </p>
      ))}
    </div>
  ),
}));

describe("DashboardMetrics", () => {
  const performance = {
    totalMarketValue: 10000,
    totalCostBasis: 9500,
    totalGainLoss: 500,
    totalGainLossPercent: 5,
    portfolioCount: 1,
    totalHoldings: 3,
    pricedHoldings: 3,
    unpricedHoldings: 0,
    currency: "USD",
    currencies: ["USD"],
    hasMixedCurrencies: false,
    currencyTotals: [],
    largestHolding: null,
    bestPerformer: null,
    worstPerformer: null,
    holdingPerformance: [],
  };

  const portfolio = {
    id: 1,
  } as Portfolio;

  const quote = {
    symbol: "AAPL",
    latest_price: 200,
    currency: "USD",
    company_name: "Apple",
  } as StockQuote;

  it("renders dashboard metrics", () => {
    render(
      <DashboardMetrics
        symbol="AAPL"
        quote={quote}
        quoteLoading={false}
        quoteError={false}
        portfolios={[portfolio]}
        portfolioLoading={false}
        portfolioError={false}
        performance={performance}
        performanceLoading={false}
        performanceError={false}
      />,
    );

    expect(screen.getByText("Portfolios")).toBeInTheDocument();

    expect(screen.getByText("Total Portfolio Value")).toBeInTheDocument();

    expect(screen.getByText("Total Profit / Loss")).toBeInTheDocument();

    expect(screen.getByText("Total Holdings")).toBeInTheDocument();

    expect(screen.getByText("Apple (AAPL) Price")).toBeInTheDocument();

    expect(screen.getByText("$200.00")).toBeInTheDocument();
  });

  it("renders loading states", () => {
    render(
      <DashboardMetrics
        symbol="AAPL"
        quoteLoading
        quoteError={false}
        portfolios={[]}
        portfolioLoading
        portfolioError={false}
        performance={performance}
        performanceLoading
        performanceError={false}
      />,
    );

    expect(screen.getAllByText("Loading...").length).toBeGreaterThan(0);
  });

  it("renders unavailable states on errors", () => {
    render(
      <DashboardMetrics
        symbol="TSLA"
        quoteLoading={false}
        quoteError
        portfolios={[]}
        portfolioLoading={false}
        portfolioError
        performance={performance}
        performanceLoading={false}
        performanceError
      />,
    );

    expect(screen.getAllByText("Unavailable").length).toBeGreaterThan(0);
  });

  it("renders currency breakdown when multiple currencies exist", () => {
    render(
      <DashboardMetrics
        symbol="AAPL"
        quoteLoading={false}
        quoteError={false}
        portfolios={[portfolio]}
        portfolioLoading={false}
        portfolioError={false}
        performance={{
          ...performance,
          currencyTotals: [
            {
              currency: "USD",
              marketValue: 1000,
              costBasis: 900,
              gainLoss: 100,
              holdingsCount: 1,
            },
            {
              currency: "EUR",
              marketValue: 2000,
              costBasis: 1800,
              gainLoss: 200,
              holdingsCount: 1,
            },
          ],
        }}
        performanceLoading={false}
        performanceError={false}
      />,
    );

    expect(screen.getAllByText("Original currency totals")).toHaveLength(2);

    expect(screen.getAllByText(/USD:/)).toHaveLength(2);

    expect(screen.getAllByText(/EUR:/)).toHaveLength(2);
  });
});
