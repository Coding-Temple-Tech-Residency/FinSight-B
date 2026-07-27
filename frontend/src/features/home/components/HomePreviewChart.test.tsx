import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePreviewChart from "./HomePreviewChart";

describe("HomePreviewChart", () => {
  it("renders the chart preview heading", () => {
    render(<HomePreviewChart />);

    expect(
      screen.getByText("Portfolio performance preview"),
    ).toBeInTheDocument();
  });

  it("renders the product demo badge", () => {
    render(<HomePreviewChart />);

    expect(screen.getByText("Product Demo")).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<HomePreviewChart />);

    expect(
      screen.getByText(
        "Explore an example of how FinSight displays portfolio performance, market history, investment activity, and AI-powered insights.",
      ),
    ).toBeInTheDocument();
  });
});
