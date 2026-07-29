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
    reset: vi.fn(),
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
vi.mock("../../market/components/StockSearchSelect", () => ({
  default: ({
    selectedStock,
    onSelect,
  }: {
    selectedStock: { symbol: string } | null;
    onSelect: (stock: { symbol: string; company_name: string }) => void;
  }) => (
    <div>
      <label htmlFor="stock-search">Company or stock symbol</label>
      <input
        id="stock-search"
        aria-label="Company or stock symbol"
        value={selectedStock?.symbol ?? ""}
        onChange={(event) =>
          onSelect({
            symbol: event.target.value,
            company_name: event.target.value,
          })
        }
      />
    </div>
  ),
}));
describe("WatchlistPage", () => {
  it("renders the page heading and description", () => {
    render(<WatchlistPage />);

    expect(
      screen.getByRole("heading", { name: "Watchlist" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Track companies you want to monitor and generate AI analysis.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "+ Add Company" }),
    ).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<WatchlistPage />);

    expect(
      screen.getByRole("heading", { name: "Your watchlist is empty" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Search for a company or stock symbol to begin monitoring its latest price.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Add Your First Company" }),
    ).toBeInTheDocument();
  });

  it("opens the add stock form", async () => {
    const user = userEvent.setup();

    render(<WatchlistPage />);

    await user.click(screen.getByRole("button", { name: "+ Add Company" }));

    expect(
      screen.getByRole("textbox", { name: "Company or stock symbol" }),
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

    await user.click(screen.getByRole("button", { name: "+ Add Company" }));

    expect(
      screen.getByRole("textbox", { name: "Company or stock symbol" }),
    ).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "Cancel" })[1]);

    expect(
      screen.queryByRole("textbox", { name: "Company or stock symbol" }),
    ).not.toBeInTheDocument();
  });

  it("disables the add button when stock symbol is empty", async () => {
    const user = userEvent.setup();

    render(<WatchlistPage />);

    await user.click(screen.getByRole("button", { name: "+ Add Company" }));

    expect(
      screen.getByRole("button", { name: "Add to Watchlist" }),
    ).toBeDisabled();
  });

  it("enables the add button after entering a stock symbol", async () => {
    const user = userEvent.setup();

    render(<WatchlistPage />);

    await user.click(screen.getByRole("button", { name: "+ Add Company" }));

    await user.type(
      screen.getByRole("textbox", { name: "Company or stock symbol" }),
      "AAPL",
    );

    expect(
      screen.getByRole("button", { name: "Add to Watchlist" }),
    ).toBeEnabled();
  });

  it("shows the alert price input after opening the form", async () => {
    const user = userEvent.setup();

    render(<WatchlistPage />);

    await user.click(screen.getByRole("button", { name: "+ Add Company" }));

    expect(
      screen.getByRole("spinbutton", { name: /Alert price/i }),
    ).toBeInTheDocument();
  });
});
