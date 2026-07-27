import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import HoldingsAllocation from "./HoldingsAllocation";

const mockUseHoldings = vi.fn();
const mockUseCurrency = vi.fn();
const mockUseCurrencyConversions = vi.fn();

vi.mock("../../portfolio/hooks/useHoldings", () => ({
  useHoldings: () => mockUseHoldings(),
}));

vi.mock("../../currency/hooks/useCurrency", () => ({
  useCurrency: () => mockUseCurrency(),
  useCurrencyConversions: () => mockUseCurrencyConversions(),
}));

vi.mock("recharts", () => ({
  Cell: () => <div>Cell</div>,
  Pie: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Tooltip: () => <div>Tooltip</div>,
}));

describe("HoldingsAllocation", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseCurrency.mockReturnValue({
      preferredCurrency: "USD",
    });

    mockUseCurrencyConversions.mockReturnValue({
      conversions: [],
      hasConversions: false,
      isLoading: false,
      isFetching: false,
      isError: false,
      errors: [],
    });
  });

  it("renders loading state", () => {
    mockUseHoldings.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
      error: null,
    });

    render(<HoldingsAllocation portfolioId={1} />);

    expect(
      screen.getByText("Loading holdings allocation..."),
    ).toBeInTheDocument();
  });

  it("renders no portfolio state", () => {
    mockUseHoldings.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<HoldingsAllocation />);

    expect(screen.getByText("No portfolio available")).toBeInTheDocument();
  });

  it("renders empty holdings state", () => {
    mockUseHoldings.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<HoldingsAllocation portfolioId={1} />);

    expect(screen.getByText("No holdings yet")).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockUseHoldings.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      error: new Error("Failed loading holdings"),
    });

    render(<HoldingsAllocation portfolioId={1} />);

    expect(screen.getByText("Failed loading holdings")).toBeInTheDocument();
  });

  it("renders allocation legend when holdings are available", () => {
    mockUseHoldings.mockReturnValue({
      data: [
        {
          id: 1,
          symbol: "AAPL",
          company_name: "Apple",
          shares: 10,
          latest_price: 200,
          native_currency: "USD",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    });

    mockUseCurrencyConversions.mockReturnValue({
      conversions: [
        {
          convertedAmount: 2000,
        },
      ],
      hasConversions: true,
      isLoading: false,
      isFetching: false,
      isError: false,
      errors: [],
    });

    render(<HoldingsAllocation portfolioId={1} />);

    expect(screen.getByText("Apple")).toBeInTheDocument();

    expect(screen.getByText("Allocation converted to USD")).toBeInTheDocument();
  });
});
