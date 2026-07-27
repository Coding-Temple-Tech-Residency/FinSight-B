import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PortfolioChart from "./PortfolioChart";

import type { MarketHistory } from "../../market/types/market";

vi.mock("../../market/components/StockLineChart", () => ({
  default: ({ data }: { data: MarketHistory[] }) => (
    <div>StockLineChart {data.length}</div>
  ),
}));

describe("PortfolioChart", () => {
  it("renders chart title", () => {
    render(<PortfolioChart symbol="AAPL" isLoading={false} isError={false} />);

    expect(screen.getByText("AAPL Performance")).toBeInTheDocument();

    expect(screen.getByText("Daily")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<PortfolioChart symbol="AAPL" isLoading isError={false} />);

    expect(screen.getByText("Loading chart...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    render(<PortfolioChart symbol="AAPL" isLoading={false} isError />);

    expect(
      screen.getByText("Chart data is currently unavailable."),
    ).toBeInTheDocument();
  });

  it("renders empty history state", () => {
    render(
      <PortfolioChart
        symbol="AAPL"
        history={[]}
        isLoading={false}
        isError={false}
      />,
    );

    expect(
      screen.getByText("No historical data is available for AAPL."),
    ).toBeInTheDocument();
  });

  it("renders StockLineChart when history exists", () => {
    const history: MarketHistory[] = [
      {
        id: 1,
        stock_id: 1,
        timeframe: "daily",
        open_price: 190,
        high_price: 205,
        low_price: 185,
        close_price: 200,
        volume: 1000000,
        price_timestamp: "2026-01-01",
        created_at: "2026-01-01",
      },
    ];

    render(
      <PortfolioChart
        symbol="AAPL"
        history={history}
        isLoading={false}
        isError={false}
      />,
    );

    expect(screen.getByText("StockLineChart 1")).toBeInTheDocument();
  });
});
