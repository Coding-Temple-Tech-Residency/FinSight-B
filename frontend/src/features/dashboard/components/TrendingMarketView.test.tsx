import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TrendingMarketView from "./TrendingMarketView";

const mockUseTrendingStocks = vi.fn();

vi.mock("../../market/hooks/useTrendingStocks", () => ({
  useTrendingStocks: () => mockUseTrendingStocks(),
}));

vi.mock("./TrendingCompanyCard", () => ({
  default: ({
    stock,
    featured,
  }: {
    stock: { company_name: string };
    featured?: boolean;
  }) => (
    <div>
      <span>{stock.company_name}</span>
      {featured && <span>Featured</span>}
    </div>
  ),
}));

describe("TrendingMarketView", () => {
  const stock = {
    rank: 1,
    symbol: "AAPL",
    company_name: "Apple",
    price: 200,
    change_amount: 10,
    percentage_change: 5,
    volume: 1000000,
    category: "gainer" as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseTrendingStocks.mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<TrendingMarketView />);

    expect(screen.getByText("Loading trending companies")).toBeInTheDocument();
  });

  it("renders error state and retries", async () => {
    const user = userEvent.setup();

    const refetch = vi.fn();

    mockUseTrendingStocks.mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error("Failed"),
      refetch,
    });

    render(<TrendingMarketView />);

    expect(screen.getByText("Trending data unavailable")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(refetch).toHaveBeenCalled();
  });

  it("renders empty state", () => {
    mockUseTrendingStocks.mockReturnValue({
      data: {
        topGainers: [],
        topLosers: [],
        mostActive: [],
        lastUpdated: null,
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<TrendingMarketView />);

    expect(screen.getByText("No trending companies found")).toBeInTheDocument();
  });

  it("renders trending companies", () => {
    mockUseTrendingStocks.mockReturnValue({
      data: {
        topGainers: [stock],
        topLosers: [],
        mostActive: [],
        lastUpdated: null,
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<TrendingMarketView />);

    expect(screen.getAllByText("Apple")).toHaveLength(2);
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("shows more stocks when clicking show more", async () => {
    const user = userEvent.setup();

    const stocks = Array.from({ length: 25 }, (_, index) => ({
      ...stock,
      rank: index + 1,
      symbol: `STOCK${index}`,
      company_name: `Company ${index}`,
    }));

    mockUseTrendingStocks.mockReturnValue({
      data: {
        topGainers: stocks,
        topLosers: [],
        mostActive: [],
        lastUpdated: null,
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<TrendingMarketView />);

    expect(screen.getByText("Showing 20 of 25")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Show more" }));

    expect(screen.getByText("Showing 25 of 25")).toBeInTheDocument();
  });
});
