import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import StockSuggestionsDropdown from "./StockSuggestionsDropdown";

vi.mock("../utils/highlightMatch", () => ({
  highlightMatch: (text: string) => text,
}));

vi.mock("../utils/mapStockToSearchResult", () => ({
  mapStockToSearchResult: (stock: {
    symbol: string;
    company_name: string;
    exchange?: string;
    company_logo_url?: string | null;
  }) => ({
    id: stock.symbol,
    title: stock.company_name,
    subtitle: stock.symbol,
    badge: stock.exchange,
    image: stock.company_logo_url,
  }),
}));

vi.mock("./states/SearchLoadingState", () => ({
  default: ({ message }: { message: string }) => <div>{message}</div>,
}));

vi.mock("./states/SearchErrorState", () => ({
  default: ({ title, message }: { title: string; message: string }) => (
    <>
      <div>{title}</div>
      <div>{message}</div>
    </>
  ),
}));

vi.mock("./states/SearchEmptyState", () => ({
  default: ({ title, description }: { title: string; description: string }) => (
    <>
      <div>{title}</div>
      <div>{description}</div>
    </>
  ),
}));

vi.mock("./resultItem/SearchResultItem", () => ({
  default: ({
    title,
    subtitle,
    badge,
    onClick,
  }: {
    title: string;
    subtitle?: string;
    badge?: string;
    onClick: () => void;
  }) => (
    <button onClick={onClick}>
      <span>{title}</span>
      {subtitle && <span>{subtitle}</span>}
      {badge && <span>{badge}</span>}
    </button>
  ),
}));

const stocks = [
  {
    symbol: "AAPL",
    company_name: "Apple Inc.",
    exchange: "NASDAQ",
    company_logo_url: null,
  },
];

describe("StockSuggestionsDropdown", () => {
  it("renders loading state", () => {
    render(
      <StockSuggestionsDropdown
        query="App"
        results={[]}
        activeIndex={0}
        isLoading
        isError={false}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Searching companies and symbols..."),
    ).toBeInTheDocument();
  });

  it("renders error state", () => {
    render(
      <StockSuggestionsDropdown
        query="App"
        results={[]}
        activeIndex={0}
        isLoading={false}
        isError
        errorMessage="Search failed"
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("Stock search is unavailable")).toBeInTheDocument();

    expect(screen.getByText("Search failed")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(
      <StockSuggestionsDropdown
        query="App"
        results={[]}
        activeIndex={0}
        isLoading={false}
        isError={false}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("No matching stocks found")).toBeInTheDocument();
  });

  it("renders search results", () => {
    render(
      <StockSuggestionsDropdown
        query="App"
        results={stocks}
        activeIndex={0}
        isLoading={false}
        isError={false}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("Apple Inc.")).toBeInTheDocument();
    expect(screen.getByText("AAPL")).toBeInTheDocument();
  });

  it("calls onSelect when a result is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <StockSuggestionsDropdown
        query="App"
        results={stocks}
        activeIndex={0}
        isLoading={false}
        isError={false}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByText("Apple Inc."));

    expect(onSelect).toHaveBeenCalledWith(stocks[0]);
  });
});
