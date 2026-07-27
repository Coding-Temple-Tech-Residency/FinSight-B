import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import HoldingForm from "./HoldingForm";

describe("HoldingForm", () => {
  it("renders the form", () => {
    render(<HoldingForm isSubmitting={false} onSubmit={vi.fn()} />);

    expect(screen.getByLabelText("Symbol")).toBeInTheDocument();
    expect(screen.getByLabelText("Shares")).toBeInTheDocument();
    expect(screen.getByLabelText("Average buy price")).toBeInTheDocument();
    expect(screen.getByLabelText("Purchase currency")).toBeInTheDocument();
    expect(screen.getByLabelText("Purchase date")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Holding" }),
    ).toBeInTheDocument();
  });

  it("shows validation when symbol is missing", async () => {
    const user = userEvent.setup();

    render(<HoldingForm isSubmitting={false} onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText("Shares"), "10");
    await user.type(screen.getByLabelText("Average buy price"), "100");
    await user.click(screen.getByRole("button", { name: "Add Holding" }));

    expect(screen.getByText("Stock symbol is required.")).toBeInTheDocument();
  });

  it("calls onSubmit with valid values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<HoldingForm isSubmitting={false} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Symbol"), "aapl");
    await user.type(screen.getByLabelText("Shares"), "10");
    await user.type(screen.getByLabelText("Average buy price"), "100");

    await user.click(screen.getByRole("button", { name: "Add Holding" }));

    expect(onSubmit).toHaveBeenCalledWith({
      symbol: "AAPL",
      shares: 10,
      average_buy_price: 100,
      purchase_currency: "USD",
      purchased_at: null,
    });
  });

  it("calls onCancel", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <HoldingForm
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledOnce();
  });
});
