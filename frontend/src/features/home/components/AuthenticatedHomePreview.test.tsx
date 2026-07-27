import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import AuthenticatedHomePreview from "./AuthenticatedHomePreview";

const mockUsePortfolios = vi.fn();
const mockUsePortfolioPerformance = vi.fn();

vi.mock("../../portfolio/hooks/usePortfolio", () => ({
  usePortfolios: () => mockUsePortfolios(),
}));

vi.mock("../../dashboard/hooks/usePortfolioPerformance", () => ({
  usePortfolioPerformance: (portfolios: unknown[]) =>
    mockUsePortfolioPerformance(portfolios),
}));

vi.mock("react-router-dom", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

vi.mock("./HomePreviewChart", () => ({
  default: () => <div>Home Preview Chart</div>,
}));

vi.mock("../../../components/ui/LoadingCard", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("../../../components/ui/ErrorCard", () => ({
  default: ({ message }: { message: string }) => <div>{message}</div>,
}));

vi.mock("../../../components/ui/EmptyCard", () => ({
  default: ({ title, message }: { title: string; message: string }) => (
    <div>
      <p>{title}</p>
      <p>{message}</p>
    </div>
  ),
}));

describe("AuthenticatedHomePreview", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUsePortfolios.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    mockUsePortfolioPerformance.mockReturnValue({
      summary: {
        currency: "USD",
        totalMarketValue: 10000,
        totalGainLoss: 1000,
        totalGainLossPercent: 10,
        hasMixedCurrencies: false,
        unpricedHoldings: 0,
        totalHoldings: 5,
      },
      isLoading: false,
      isFetching: false,
      isError: false,
    });
  });

  it("renders loading state", () => {
    mockUsePortfolios.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    });

    render(<AuthenticatedHomePreview />);

    expect(
      screen.getByText("Loading your portfolio overview..."),
    ).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockUsePortfolios.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
    });

    render(<AuthenticatedHomePreview />);

    expect(
      screen.getByText("Your portfolio overview is currently unavailable."),
    ).toBeInTheDocument();
  });

  it("renders empty state when no portfolios exist", () => {
    render(<AuthenticatedHomePreview />);

    expect(screen.getByText("No portfolios yet")).toBeInTheDocument();
  });

  it("renders portfolio overview when portfolios exist", () => {
    mockUsePortfolios.mockReturnValue({
      data: [
        {
          id: 1,
          name: "Growth Portfolio",
        },
      ],
      isLoading: false,
      isError: false,
    });

    render(<AuthenticatedHomePreview />);

    expect(screen.getByText("Your Dashboard")).toBeInTheDocument();

    expect(screen.getByText("$10,000.00")).toBeInTheDocument();

    expect(screen.getByText("$1,000.00")).toBeInTheDocument();

    expect(screen.getByText("Home Preview Chart")).toBeInTheDocument();
  });

  it("shows multiple currencies message", () => {
    mockUsePortfolios.mockReturnValue({
      data: [{ id: 1 }],
      isLoading: false,
      isError: false,
    });

    mockUsePortfolioPerformance.mockReturnValue({
      summary: {
        currency: "USD",
        totalMarketValue: 0,
        totalGainLoss: 0,
        totalGainLossPercent: 0,
        hasMixedCurrencies: true,
        unpricedHoldings: 0,
        totalHoldings: 2,
      },
      isLoading: false,
      isFetching: false,
      isError: false,
    });

    render(<AuthenticatedHomePreview />);

    expect(screen.getByText("Multiple currencies")).toBeInTheDocument();
  });
});
