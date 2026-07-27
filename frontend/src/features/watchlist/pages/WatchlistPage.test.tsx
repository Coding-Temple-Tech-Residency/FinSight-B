import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import WatchlistPage from "./WatchlistPage";

vi.mock("../hooks/useWatchlist", () => ({
  useWatchlist: () => ({
    data: [],
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
  useAddToWatchlist: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  }),
  useRemoveFromWatchlist: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
    variables: undefined,
  }),
}));

vi.mock("../../insights/hooks/useAIInsights", () => ({
  useAIInsights: () => ({
    data: [],
  }),
  useGenerateStockAIInsight: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
    reset: vi.fn(),
    variables: undefined,
  }),
}));

vi.mock("../../../components/ui/Modal", () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe("WatchlistPage", () => {
  it("renders the page heading and description", () => {
    render(<WatchlistPage />);

    expect(
      screen.getByRole("heading", { name: "Watchlist" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Track stocks you want to monitor and generate AI analysis.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "+ Add Stock" }),
    ).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<WatchlistPage />);

    expect(
      screen.getByRole("heading", { name: "Your watchlist is empty" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Add a stock symbol to begin monitoring its latest price.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Add Your First Stock" }),
    ).toBeInTheDocument();
  });

  it("opens the add stock form", async () => {
    const user = userEvent.setup();

    render(<WatchlistPage />);

    await user.click(screen.getByRole("button", { name: "+ Add Stock" }));

    expect(
      screen.getByRole("textbox", { name: "Stock symbol" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("spinbutton", { name: /Alert price/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Add to Watchlist" }),
    ).toBeInTheDocument();
  });

  it("closes the add stock form", async () => {
    const user = userEvent.setup();

    render(<WatchlistPage />);

    await user.click(screen.getByRole("button", { name: "+ Add Stock" }));

    expect(
      screen.getByRole("textbox", { name: "Stock symbol" }),
    ).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "Cancel" })[1]);

    expect(
      screen.queryByRole("textbox", { name: "Stock symbol" }),
    ).not.toBeInTheDocument();
  });

  it("disables the add button when stock symbol is empty", async () => {
    const user = userEvent.setup();

    render(<WatchlistPage />);

    await user.click(screen.getByRole("button", { name: "+ Add Stock" }));

    expect(
      screen.getByRole("button", { name: "Add to Watchlist" }),
    ).toBeDisabled();
  });

  it("enables the add button after entering a stock symbol", async () => {
    const user = userEvent.setup();

    render(<WatchlistPage />);

    await user.click(screen.getByRole("button", { name: "+ Add Stock" }));

    await user.type(
      screen.getByRole("textbox", { name: "Stock symbol" }),
      "AAPL",
    );

    expect(
      screen.getByRole("button", { name: "Add to Watchlist" }),
    ).toBeEnabled();
  });

  it("shows the alert price input after opening the form", async () => {
    const user = userEvent.setup();

    render(<WatchlistPage />);

    await user.click(screen.getByRole("button", { name: "+ Add Stock" }));

    expect(
      screen.getByRole("spinbutton", { name: /Alert price/i }),
    ).toBeInTheDocument();
  });
});
