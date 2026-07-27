import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Dashboard from "./Dashboard";

const mockUseDashboard = vi.fn();
const mockUseStockQuote = vi.fn();
const mockUseMarketHistory = vi.fn();
const mockUsePortfolios = vi.fn();
const mockUsePortfolioPerformance = vi.fn();

vi.mock("../hooks/useDashboard", () => ({
  useDashboard: () => mockUseDashboard(),
}));

vi.mock("../../market/hooks/useStockQuote", () => ({
  useStockQuote: () => mockUseStockQuote(),
}));

vi.mock("../../market/hooks/useMarketHistory", () => ({
  useMarketHistory: () => mockUseMarketHistory(),
}));

vi.mock("../../portfolio/hooks/usePortfolio", () => ({
  usePortfolios: () => mockUsePortfolios(),
}));

vi.mock("../hooks/usePortfolioPerformance", () => ({
  usePortfolioPerformance: () => mockUsePortfolioPerformance(),
}));

vi.mock("../components/DashboardHeader", () => ({
  default: () => <div>DashboardHeader</div>,
}));

vi.mock("../components/DashboardModeToggle", () => ({
  default: ({
    onChange,
  }: {
    onChange: (mode: "portfolio" | "trending") => void;
  }) => (
    <div>
      <button onClick={() => onChange("trending")}>Trending</button>
    </div>
  ),
}));

vi.mock("../components/DashboardMetrics", () => ({
  default: () => <div>DashboardMetrics</div>,
}));

vi.mock("../components/FinancialAssistantCard", () => ({
  default: () => <div>FinancialAssistantCard</div>,
}));

vi.mock("../components/PortfolioChart", () => ({
  default: () => <div>PortfolioChart</div>,
}));

vi.mock("../components/AIInsightCard", () => ({
  default: () => <div>AIInsightCard</div>,
}));

vi.mock("../components/HoldingsAllocation", () => ({
  default: () => <div>HoldingsAllocation</div>,
}));

vi.mock("../components/TopMoversCard", () => ({
  default: () => <div>TopMoversCard</div>,
}));

vi.mock("../components/WatchlistPreview", () => ({
  default: () => <div>WatchlistPreview</div>,
}));

vi.mock("../components/TrendingMarketView", () => ({
  default: () => <div>TrendingMarketView</div>,
}));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseDashboard.mockReturnValue({
      symbol: "AAPL",
    });

    mockUseStockQuote.mockReturnValue({
      data: {},
      isLoading: false,
      isError: false,
    });

    mockUseMarketHistory.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    mockUsePortfolios.mockReturnValue({
      data: [
        {
          id: 1,
          name: "My Portfolio",
        },
      ],
      isLoading: false,
      isError: false,
    });

    mockUsePortfolioPerformance.mockReturnValue({
      displaySummary: {
        currency: "USD",
        totalMarketValue: 1000,
        totalGainLoss: 100,
        totalGainLossPercent: 10,
        totalHoldings: 1,
        pricedHoldings: 1,
        currencyTotals: [],
      },
      isLoading: false,
      isFetching: false,
      isError: false,
    });
  });

  it("renders dashboard portfolio mode", () => {
    render(<Dashboard />);

    expect(screen.getByText("DashboardHeader")).toBeInTheDocument();

    expect(screen.getByText("DashboardMetrics")).toBeInTheDocument();

    expect(screen.getByText("FinancialAssistantCard")).toBeInTheDocument();

    expect(screen.queryByText("TrendingMarketView")).not.toBeInTheDocument();
  });

  it("switches to trending mode", async () => {
    const user = userEvent.setup();

    render(<Dashboard />);

    await user.click(
      screen.getByRole("button", {
        name: "Trending",
      }),
    );

    expect(screen.getByText("TrendingMarketView")).toBeInTheDocument();

    expect(screen.queryByText("DashboardMetrics")).not.toBeInTheDocument();
  });

  it("renders portfolio selector", () => {
    render(<Dashboard />);

    expect(screen.getByLabelText("Selected portfolio")).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "My Portfolio",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", {
        name: "My Portfolio",
      }),
    ).toBeInTheDocument();
  });

  it("shows updating portfolio data state", () => {
    mockUsePortfolioPerformance.mockReturnValue({
      displaySummary: {},
      isLoading: false,
      isFetching: true,
      isError: false,
    });

    render(<Dashboard />);

    expect(screen.getByText("Updating portfolio data...")).toBeInTheDocument();
  });
});
