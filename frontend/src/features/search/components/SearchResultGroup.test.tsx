import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import SearchResultGroup from "./SearchResultGroup";

vi.mock("../utils/getSearchResultIcon", () => ({
  getSearchResultIcon: () => ({}),
}));

vi.mock("../utils/getSearchResultColor", () => ({
  getSearchResultColor: () => "text-blue-500",
}));

vi.mock("../utils/highlightMatch", () => ({
  highlightMatch: (text: string) => text,
}));

vi.mock("./resultItem/SearchResultItem", () => ({
  default: ({
    title,
    subtitle,
    badge,
    trailing,
    onClick,
  }: {
    title: string;
    subtitle?: string;
    badge?: string;
    trailing?: string;
    onClick: () => void;
  }) => (
    <button onClick={onClick}>
      <span>{title}</span>
      {subtitle && <span>{subtitle}</span>}
      {badge && <span>{badge}</span>}
      {trailing && <span>{trailing}</span>}
    </button>
  ),
}));

const results = [
  {
    result: {
      id: "1",
      type: "stock" as const,
      title: "Apple Inc.",
      subtitle: "AAPL",
      badge: "NASDAQ",
      trailing: "$210.55",
    },
    index: 0,
  },
  {
    result: {
      id: "2",
      type: "stock" as const,
      title: "Tesla Inc.",
      subtitle: "TSLA",
      badge: "NASDAQ",
    },
    index: 1,
  },
];

describe("SearchResultGroup", () => {
  it("renders nothing when there are no results", () => {
    const { container } = render(
      <SearchResultGroup
        label="Stocks"
        query=""
        results={[]}
        activeIndex={0}
        onResultSelect={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the group label and results", () => {
    render(
      <SearchResultGroup
        label="Stocks"
        query=""
        results={results}
        activeIndex={0}
        onResultSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("Stocks")).toBeInTheDocument();
    expect(screen.getByText("Apple Inc.")).toBeInTheDocument();
    expect(screen.getByText("Tesla Inc.")).toBeInTheDocument();
  });

  it("calls onResultSelect when a result is clicked", async () => {
    const user = userEvent.setup();
    const onResultSelect = vi.fn();

    render(
      <SearchResultGroup
        label="Stocks"
        query=""
        results={results}
        activeIndex={0}
        onResultSelect={onResultSelect}
      />,
    );

    await user.click(screen.getByText("Apple Inc."));

    expect(onResultSelect).toHaveBeenCalledWith(results[0].result);
  });
});
