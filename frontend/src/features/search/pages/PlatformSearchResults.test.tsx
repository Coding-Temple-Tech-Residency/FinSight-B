import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import PlatformSearchResults from "./PlatformSearchResults";

vi.mock("../hooks/useUniversalSearch", () => ({
  useUniversalSearch: () => ({
    data: [],
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
  }),
}));

vi.mock("../components/SearchForm", () => ({
  default: () => <div>Search Form</div>,
}));

vi.mock("../../market/components/StockDetailsModal", () => ({
  default: () => <div>Stock Details Modal</div>,
}));

vi.mock("../../../components/ui/EmptyCard", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe("PlatformSearchResults", () => {
  it("renders the search page", () => {
    render(
      <MemoryRouter>
        <PlatformSearchResults />
      </MemoryRouter>,
    );

    expect(screen.getByText("Universal Search")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Search FinSight" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Search across your dashboard, portfolios, watchlists, stocks, and AI tools.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("Search Form")).toBeInTheDocument();
    expect(screen.getByText("Stock Details Modal")).toBeInTheDocument();
  });
});
