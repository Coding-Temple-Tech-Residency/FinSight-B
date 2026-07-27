import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import StockSearchInput from "./StockSearchInput";

vi.mock("../hooks/useDebouncedValue", () => ({
  useDebouncedValue: (value: string) => value,
}));

vi.mock("../hooks/useSearchHistory", () => ({
  useSearchHistory: () => ({
    recentStocks: [],
    addRecentStock: vi.fn(),
    removeRecentStock: vi.fn(),
    clearRecentStocks: vi.fn(),
  }),
}));

vi.mock("../hooks/useStockSearch", () => ({
  useStockSearch: () => ({
    data: [],
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
  }),
}));

vi.mock("./RecentStockSearches", () => ({
  default: () => <div>Recent Searches</div>,
}));

vi.mock("./StockSuggestionsDropdown", () => ({
  default: () => <div>Suggestions</div>,
}));

describe("StockSearchInput", () => {
  const onSelect = vi.fn();
  const onSymbolSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the search input", () => {
    render(
      <StockSearchInput onSelect={onSelect} onSymbolSubmit={onSymbolSubmit} />,
    );

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("renders a custom placeholder", () => {
    render(
      <StockSearchInput placeholder="Search stocks..." onSelect={onSelect} />,
    );

    expect(screen.getByPlaceholderText("Search stocks...")).toBeInTheDocument();
  });

  it("shows the clear button after typing", async () => {
    const user = userEvent.setup();

    render(<StockSearchInput onSelect={onSelect} />);

    await user.type(screen.getByRole("searchbox"), "Apple");

    expect(
      screen.getByRole("button", {
        name: "Clear stock search",
      }),
    ).toBeInTheDocument();
  });

  it("clears the input when clear button is clicked", async () => {
    const user = userEvent.setup();

    render(<StockSearchInput onSelect={onSelect} />);

    const input = screen.getByRole("searchbox");

    await user.type(input, "Apple");

    await user.click(
      screen.getByRole("button", {
        name: "Clear stock search",
      }),
    );

    expect(input).toHaveValue("");
  });

  it("calls onSymbolSubmit when submitting a symbol", async () => {
    const user = userEvent.setup();

    render(
      <StockSearchInput onSelect={onSelect} onSymbolSubmit={onSymbolSubmit} />,
    );

    await user.type(screen.getByRole("searchbox"), "AAPL");

    await user.click(
      screen.getByRole("button", {
        name: "Search",
      }),
    );

    expect(onSymbolSubmit).toHaveBeenCalledWith("AAPL");
  });
});
