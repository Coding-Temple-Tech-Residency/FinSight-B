import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import DashboardModeToggle from "./DashboardModeToggle";

describe("DashboardModeToggle", () => {
  it("renders dashboard mode buttons", () => {
    render(<DashboardModeToggle mode="portfolio" onChange={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Portfolio" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Trending Market" }),
    ).toBeInTheDocument();
  });

  it("shows portfolio as active when mode is portfolio", () => {
    render(<DashboardModeToggle mode="portfolio" onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Portfolio" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    expect(
      screen.getByRole("button", { name: "Trending Market" }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("shows trending as active when mode is trending", () => {
    render(<DashboardModeToggle mode="trending" onChange={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Trending Market" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onChange when a mode button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DashboardModeToggle mode="portfolio" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Trending Market" }));

    expect(onChange).toHaveBeenCalledWith("trending");
  });
});
