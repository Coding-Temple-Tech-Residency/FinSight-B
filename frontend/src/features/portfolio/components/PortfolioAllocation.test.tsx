import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PortfolioAllocation from "./PortfolioAllocation";

vi.mock("../utils/currencyFormatting", () => ({
  formatCurrency: vi.fn((value, currency) => `${currency} ${value}`),
  normalizeCurrencyCode: vi.fn((currency) => currency ?? "USD"),
  toFiniteNumber: vi.fn((value) => Number(value)),
}));

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Pie: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Cell: () => <div />,
  Tooltip: () => <div />,
}));

describe("PortfolioAllocation", () => {
  it("renders loading state", () => {
    render(
      <PortfolioAllocation holdings={[]} portfolioCurrency="USD" isLoading />,
    );

    expect(
      screen.getByText("Loading portfolio allocation..."),
    ).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(
      <PortfolioAllocation
        holdings={[]}
        portfolioCurrency="USD"
        isLoading={false}
      />,
    );

    expect(screen.getByText("No holdings yet")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Add holdings to this portfolio to view its allocation.",
      ),
    ).toBeInTheDocument();
  });

  it("renders allocation legend", () => {
    render(
      <PortfolioAllocation
        holdings={[
          {
            id: 1,
            symbol: "AAPL",
            company_name: "Apple Inc.",
            shares: 10,
            latest_price: 100,
            native_currency: "USD",
          } as never,
        ]}
        portfolioCurrency="USD"
        isLoading={false}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Holdings Allocation" }),
    ).toBeInTheDocument();
    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("Apple Inc.")).toBeInTheDocument();
  });
});
