import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import PortfolioHeader from "./PortfolioHeader";

describe("PortfolioHeader", () => {
  it("renders the header content", () => {
    render(<PortfolioHeader isCreating={false} onCreatePortfolio={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: "Portfolio" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Create and manage your investment portfolios and holdings.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Create Portfolio" }),
    ).toBeInTheDocument();
  });

  it("calls onCreatePortfolio when button is clicked", async () => {
    const user = userEvent.setup();
    const onCreatePortfolio = vi.fn();

    render(
      <PortfolioHeader
        isCreating={false}
        onCreatePortfolio={onCreatePortfolio}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Create Portfolio" }));

    expect(onCreatePortfolio).toHaveBeenCalled();
  });

  it("shows creating state", () => {
    render(<PortfolioHeader isCreating onCreatePortfolio={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Creating..." })).toBeDisabled();
  });
});
