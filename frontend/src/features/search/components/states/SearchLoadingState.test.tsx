import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SearchLoadingState from "./SearchLoadingState";

describe("SearchLoadingState", () => {
  it("renders the default loading message", () => {
    render(<SearchLoadingState />);

    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(screen.getByText("Searching...")).toBeInTheDocument();
  });

  it("renders a custom loading message", () => {
    render(<SearchLoadingState message="Loading stocks..." />);

    expect(screen.getByText("Loading stocks...")).toBeInTheDocument();
  });

  it("renders the loading spinner", () => {
    render(<SearchLoadingState />);

    expect(
      screen.getByRole("status").querySelector("span[aria-hidden='true']"),
    ).toBeInTheDocument();
  });
});
