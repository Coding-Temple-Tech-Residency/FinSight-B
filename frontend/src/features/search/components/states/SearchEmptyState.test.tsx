import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SearchEmptyState from "./SearchEmptyState";

describe("SearchEmptyState", () => {
  it("renders the default title and description", () => {
    render(<SearchEmptyState />);

    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(screen.getByText("No results found")).toBeInTheDocument();

    expect(screen.getByText("Try adjusting your search.")).toBeInTheDocument();
  });

  it("renders a custom title", () => {
    render(<SearchEmptyState title="No stocks found" />);

    expect(screen.getByText("No stocks found")).toBeInTheDocument();
  });

  it("renders a custom description", () => {
    render(<SearchEmptyState description="Search for another company." />);

    expect(screen.getByText("Search for another company.")).toBeInTheDocument();
  });

  it("does not render the description when it is null", () => {
    render(<SearchEmptyState description={null} />);

    expect(
      screen.queryByText("Try adjusting your search."),
    ).not.toBeInTheDocument();
  });
});
