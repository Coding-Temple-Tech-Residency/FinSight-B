import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import DashboardHeader from "./DashboardHeader";

const mockUseCurrentUser = vi.fn();
const mockUseDashboard = vi.fn();

vi.mock("../../auth/hooks/useCurrentUser", () => ({
  useCurrentUser: () => mockUseCurrentUser(),
}));

vi.mock("../hooks/useDashboard", () => ({
  useDashboard: () => mockUseDashboard(),
}));

vi.mock("../../market/components/StockSearch", () => ({
  default: () => <div>StockSearch</div>,
}));

describe("DashboardHeader", () => {
  it("renders user greeting and stock search", () => {
    mockUseCurrentUser.mockReturnValue({
      data: {
        first_name: "Farah",
      },
      isLoading: false,
    });

    mockUseDashboard.mockReturnValue({
      symbol: "AAPL",
    });

    render(<DashboardHeader />);

    expect(screen.getByText(/Farah 👋/)).toBeInTheDocument();

    expect(
      screen.getByText("Viewing market data for AAPL."),
    ).toBeInTheDocument();

    expect(screen.getByText("StockSearch")).toBeInTheDocument();
  });

  it("renders loading greeting", () => {
    mockUseCurrentUser.mockReturnValue({
      data: null,
      isLoading: true,
    });

    mockUseDashboard.mockReturnValue({
      symbol: "TSLA",
    });

    render(<DashboardHeader />);

    expect(screen.getByText(/Good .* 👋/)).toBeInTheDocument();

    expect(
      screen.getByText("Viewing market data for TSLA."),
    ).toBeInTheDocument();
  });

  it("uses Investor when user has no first name", () => {
    mockUseCurrentUser.mockReturnValue({
      data: {},
      isLoading: false,
    });

    mockUseDashboard.mockReturnValue({
      symbol: "NVDA",
    });

    render(<DashboardHeader />);

    expect(screen.getByText(/Investor 👋/)).toBeInTheDocument();
  });
});
