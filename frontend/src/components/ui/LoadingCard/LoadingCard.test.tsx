import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import LoadingCard from "./LoadingCard";

describe("LoadingCard", () => {
  it("renders the default title", () => {
    render(<LoadingCard />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders a custom title", () => {
    render(<LoadingCard title="Loading Portfolio..." />);

    expect(screen.getByText("Loading Portfolio...")).toBeInTheDocument();
  });

  it("renders the loading placeholders", () => {
    const { container } = render(<LoadingCard />);

    const placeholders = container.querySelectorAll(".bg-white\\/10");

    expect(placeholders).toHaveLength(2);
  });
});
