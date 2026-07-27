import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import EmptyCard from "./EmptyCard";

describe("EmptyCard", () => {
  it("renders the default title and message", () => {
    render(<EmptyCard />);

    expect(screen.getByText("No data available")).toBeInTheDocument();

    expect(
      screen.getByText("There is currently nothing to display."),
    ).toBeInTheDocument();
  });

  it("renders a custom title and message", () => {
    render(
      <EmptyCard title="No Portfolio" message="Create your first portfolio." />,
    );

    expect(screen.getByText("No Portfolio")).toBeInTheDocument();

    expect(
      screen.getByText("Create your first portfolio."),
    ).toBeInTheDocument();
  });

  it("renders the action element", () => {
    render(<EmptyCard action={<button>Try Again</button>} />);

    expect(
      screen.getByRole("button", {
        name: "Try Again",
      }),
    ).toBeInTheDocument();
  });

  it("applies a custom class name", () => {
    const { container } = render(<EmptyCard className="custom-card" />);

    expect(container.firstChild).toHaveClass("custom-card");
  });
});
