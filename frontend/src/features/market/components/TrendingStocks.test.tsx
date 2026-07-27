import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TrendingStocks from "./TrendingStocks";

const navigate = vi.fn();
const setSymbol = vi.fn();
const refetch = vi.fn();

const mockUseTrendingStocks = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigate,
}));

vi.mock("../../dashboard/hooks/useDashboard", () => ({
  useDashboard: () => ({
    setSymbol,
  }),
}));

vi.mock("../hooks/useTrendingStocks", () => ({
  useTrendingStocks: () => mockUseTrendingStocks(),
}));

describe("TrendingStocks", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal("scrollTo", vi.fn());
  });

  it("renders loading state", () => {
    mockUseTrendingStocks.mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: false,
      isError: false,
      error: null,
      refetch,
    });

    render(<TrendingStocks />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Loading trending stocks...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockUseTrendingStocks.mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error("Failed to load"),
      refetch,
    });

    render(<TrendingStocks />);

    expect(screen.getByText("Trending stocks unavailable")).toBeInTheDocument();

    expect(screen.getByText("Failed to load")).toBeInTheDocument();
  });

  it("calls refetch when Try again is clicked", async () => {
    const user = userEvent.setup();

    mockUseTrendingStocks.mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error("Failed to load"),
      refetch,
    });

    render(<TrendingStocks />);

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(refetch).toHaveBeenCalled();
  });

  it("renders trending stock groups", () => {
    mockUseTrendingStocks.mockReturnValue({
      data: {
        lastUpdated: "2024-01-01T12:00:00Z",
        topGainers: [
          {
            rank: 1,
            symbol: "AAPL",
            company_name: "Apple Inc.",
            price: 200,
            percentage_change: 5,
            volume: 1000000,
          },
        ],
        topLosers: [],
        mostActive: [],
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch,
    });

    render(<TrendingStocks />);

    expect(
      screen.getByRole("heading", { name: "Top Gainers" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Top Losers" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Most Active" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Apple Inc.")).toBeInTheDocument();
  });

  it("shows refreshing indicator", () => {
    mockUseTrendingStocks.mockReturnValue({
      data: {
        lastUpdated: "2024-01-01T12:00:00Z",
        topGainers: [],
        topLosers: [],
        mostActive: [],
      },
      isLoading: false,
      isFetching: true,
      isError: false,
      error: null,
      refetch,
    });

    render(<TrendingStocks />);

    expect(screen.getByText("Refreshing...")).toBeInTheDocument();
  });

  it("navigates to market page when a stock is selected", async () => {
    const user = userEvent.setup();

    mockUseTrendingStocks.mockReturnValue({
      data: {
        lastUpdated: "2024-01-01T12:00:00Z",
        topGainers: [
          {
            rank: 1,
            symbol: "AAPL",
            company_name: "Apple Inc.",
            price: 200,
            percentage_change: 5,
            volume: 1000000,
          },
        ],
        topLosers: [],
        mostActive: [],
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch,
    });

    render(<TrendingStocks />);

    await user.click(
      screen.getByRole("button", {
        name: /View Apple Inc\. \(AAPL\) market data/i,
      }),
    );

    expect(setSymbol).toHaveBeenCalledWith("AAPL");
    expect(navigate).toHaveBeenCalledWith("/dashboard/market?symbol=AAPL");
  });
});
