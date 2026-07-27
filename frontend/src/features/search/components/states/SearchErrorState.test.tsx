import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SearchErrorState from "./SearchErrorState";

describe("SearchErrorState", () => {
  it("renders the default title and message", () => {
    render(<SearchErrorState />);

    expect(screen.getByRole("alert")).toBeInTheDocument();

    expect(screen.getByText("Search is unavailable")).toBeInTheDocument();

    expect(
      screen.getByText("The search service could not be reached."),
    ).toBeInTheDocument();
  });

  it("renders a custom title", () => {
    render(<SearchErrorState title="Unable to search" />);

    expect(screen.getByText("Unable to search")).toBeInTheDocument();
  });

  it("renders a custom message", () => {
    render(<SearchErrorState message="Something went wrong." />);

    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  it("renders the fallback message", () => {
    render(<SearchErrorState fallbackMessage="Please try again later." />);

    expect(screen.getByText("Please try again later.")).toBeInTheDocument();
  });

  it("does not render the message when it is null", () => {
    render(<SearchErrorState message={null} />);

    expect(
      screen.queryByText("The search service could not be reached."),
    ).not.toBeInTheDocument();
  });
});
