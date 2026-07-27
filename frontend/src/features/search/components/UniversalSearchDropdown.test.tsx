import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import UniversalSearchDropdown from "./UniversalSearchDropdown";

vi.mock("./SearchResultGroup", () => ({
  default: ({
    label,
    results,
  }: {
    label: string;
    results: Array<{ result: { title: string } }>;
  }) =>
    results.length ? (
      <div>
        <div>{label}</div>
        {results.map(({ result }) => (
          <div key={result.title}>{result.title}</div>
        ))}
      </div>
    ) : null,
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

const results = [
  {
    id: "1",
    type: "stock" as const,
    title: "Apple Inc.",
  },
  {
    id: "2",
    type: "portfolio" as const,
    title: "My Portfolio",
  },
];

describe("UniversalSearchDropdown", () => {
  it("renders loading state", () => {
    render(
      <UniversalSearchDropdown
        query="apple"
        results={[]}
        activeIndex={0}
        isLoading
        onResultSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("Searching FinSight...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    render(
      <UniversalSearchDropdown
        query="apple"
        results={[]}
        activeIndex={0}
        isError
        errorMessage="Search failed"
        onResultSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("Search is unavailable")).toBeInTheDocument();

    expect(screen.getByText("Search failed")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(
      <UniversalSearchDropdown
        query="apple"
        results={[]}
        activeIndex={0}
        onResultSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("No matching results found")).toBeInTheDocument();
  });

  it("renders grouped results", () => {
    render(
      <UniversalSearchDropdown
        query="apple"
        results={results}
        activeIndex={0}
        onResultSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("Stocks")).toBeInTheDocument();
    expect(screen.getByText("Portfolios")).toBeInTheDocument();
    expect(screen.getByText("Apple Inc.")).toBeInTheDocument();
    expect(screen.getByText("My Portfolio")).toBeInTheDocument();
  });

  it("calls onViewAll when button is clicked", async () => {
    const user = userEvent.setup();
    const onViewAll = vi.fn();

    render(
      <UniversalSearchDropdown
        query="apple"
        results={results}
        activeIndex={0}
        onResultSelect={vi.fn()}
        onViewAll={onViewAll}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /View all results for/i,
      }),
    );

    expect(onViewAll).toHaveBeenCalledTimes(1);
  });
});
