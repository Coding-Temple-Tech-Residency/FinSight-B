import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import GuestHomePreview from "./GuestHomePreview";

vi.mock("./HomePreviewChart", () => ({
  default: () => <div>Home Preview Chart</div>,
}));

describe("GuestHomePreview", () => {
  it("renders dashboard demo preview", () => {
    render(<GuestHomePreview />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    expect(screen.getByText("Demo Preview")).toBeInTheDocument();
  });

  it("renders demo portfolio values", () => {
    render(<GuestHomePreview />);

    expect(screen.getByText("$28,560.00")).toBeInTheDocument();

    expect(screen.getByText("+2.45%")).toBeInTheDocument();

    expect(screen.getByText("Bullish")).toBeInTheDocument();
  });

  it("renders chart preview", () => {
    render(<GuestHomePreview />);

    expect(screen.getByText("Home Preview Chart")).toBeInTheDocument();
  });

  it("renders top movers and AI insight sections", () => {
    render(<GuestHomePreview />);

    expect(screen.getByText("Top Movers")).toBeInTheDocument();

    expect(screen.getByText("AAPL +2.35%")).toBeInTheDocument();

    expect(screen.getByText("NVDA +3.21%")).toBeInTheDocument();

    expect(screen.getByText("MSFT -0.45%")).toBeInTheDocument();

    expect(screen.getByText("AI Insight")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Example AI-generated market insights will appear here.",
      ),
    ).toBeInTheDocument();
  });
});
