import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import RecentStockSearches from "./RecentStockSearches";

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
  {
    symbol: "TSLA",
    company_name: "Tesla Inc.",
    exchange: "NASDAQ",
    company_logo_url: null,
  },
];

describe("RecentStockSearches", () => {
  it("renders the empty state", () => {
    render(
      <RecentStockSearches
        stocks={[]}
        activeIndex={0}
        onSelect={vi.fn()}
        onRemove={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    expect(screen.getByText("No recent stock searches")).toBeInTheDocument();

    expect(
      screen.getByText("Stocks you select will appear here for faster access."),
    ).toBeInTheDocument();
  });

  it("renders recent searches", () => {
    render(
      <RecentStockSearches
        stocks={stocks}
        activeIndex={0}
        onSelect={vi.fn()}
        onRemove={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    expect(screen.getByText("Recent")).toBeInTheDocument();
    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("TSLA")).toBeInTheDocument();
  });

  it("calls onSelect when a stock is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <RecentStockSearches
        stocks={stocks}
        activeIndex={0}
        onSelect={onSelect}
        onRemove={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    await user.click(screen.getByText("AAPL"));

    expect(onSelect).toHaveBeenCalledWith(stocks[0]);
  });

  it("calls onRemove when remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(
      <RecentStockSearches
        stocks={stocks}
        activeIndex={0}
        onSelect={vi.fn()}
        onRemove={onRemove}
        onClear={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Remove AAPL from recent searches",
      }),
    );

    expect(onRemove).toHaveBeenCalledWith("AAPL");
  });

  it("calls onClear when clear button is clicked", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(
      <RecentStockSearches
        stocks={stocks}
        activeIndex={0}
        onSelect={vi.fn()}
        onRemove={vi.fn()}
        onClear={onClear}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Clear",
      }),
    );

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
