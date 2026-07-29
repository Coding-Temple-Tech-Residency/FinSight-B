import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import HoldingForm from "./HoldingForm";

vi.mock("../../market/components/StockSearchSelect", () => ({
  default: ({
    selectedStock,
    onSelect,
  }: {
    selectedStock: { symbol: string } | null;
    onSelect: (stock: { symbol: string; company_name: string }) => void;
  }) => (
    <div>
      <label htmlFor="stock-search">Company or stock symbol</label>
      <input
        id="stock-search"
        aria-label="Company or stock symbol"
        value={selectedStock?.symbol ?? ""}
        onChange={(event) =>
          onSelect({
            symbol: event.target.value,
            company_name: event.target.value,
          })
        }
      />
    </div>
  ),
}));

const renderHoldingForm = (
  props: Partial<React.ComponentProps<typeof HoldingForm>> = {},
) => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <HoldingForm isSubmitting={false} onSubmit={vi.fn()} {...props} />
    </QueryClientProvider>,
  );
};

describe("HoldingForm", () => {
  it("renders the form", () => {
    renderHoldingForm();

    expect(
      screen.getByLabelText("Company or stock symbol"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Shares")).toBeInTheDocument();
    expect(screen.getByLabelText("Average buy price")).toBeInTheDocument();
    expect(screen.getByLabelText("Purchase currency")).toBeInTheDocument();
    expect(screen.getByLabelText("Purchase date")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Holding" }),
    ).toBeInTheDocument();
  });

  it("disables submit until a company is selected", () => {
    renderHoldingForm();

    expect(screen.getByRole("button", { name: "Add Holding" })).toBeDisabled();
  });

  it("calls onSubmit with valid values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderHoldingForm({ onSubmit });

    await user.type(screen.getByLabelText("Company or stock symbol"), "AAPL");
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

    renderHoldingForm({ onCancel });

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledOnce();
  });
});
