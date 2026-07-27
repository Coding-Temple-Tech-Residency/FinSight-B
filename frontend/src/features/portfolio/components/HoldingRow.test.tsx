import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import HoldingRow from "./HoldingRow";

vi.mock("../utils/currencyFormatting", () => ({
  formatCurrency: vi.fn((value, currency) =>
    value === null ? "Unavailable" : `${currency} ${value}`,
  ),
  normalizeCurrencyCode: vi.fn((currency) => currency ?? "USD"),
  toFiniteNumber: vi.fn((value) => Number(value)),
}));

describe("HoldingRow", () => {
  const holding = {
    symbol: "AAPL",
    company_name: "Apple Inc.",
    shares: 10,
    average_buy_price: 100,
    average_buy_price_native: 100,
    latest_price: 120,
    purchase_currency: "USD",
    native_currency: "USD",
    purchased_at: "2024-01-01",
  } as never;

  it("renders the holding information", () => {
    render(
      <table>
        <tbody>
          <HoldingRow
            holding={holding}
            isUpdating={false}
            isDeleting={false}
            onEdit={vi.fn()}
            onDelete={vi.fn()}
          />
        </tbody>
      </table>,
    );

    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("Apple Inc.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  it("calls onEdit", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(
      <table>
        <tbody>
          <HoldingRow
            holding={holding}
            isUpdating={false}
            isDeleting={false}
            onEdit={onEdit}
            onDelete={vi.fn()}
          />
        </tbody>
      </table>,
    );

    await user.click(screen.getByRole("button", { name: "Edit" }));

    expect(onEdit).toHaveBeenCalledWith(holding);
  });

  it("calls onDelete", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <table>
        <tbody>
          <HoldingRow
            holding={holding}
            isUpdating={false}
            isDeleting={false}
            onEdit={vi.fn()}
            onDelete={onDelete}
          />
        </tbody>
      </table>,
    );

    await user.click(screen.getByRole("button", { name: "Remove" }));

    expect(onDelete).toHaveBeenCalledWith(holding);
  });

  it("shows loading button labels", () => {
    render(
      <table>
        <tbody>
          <HoldingRow
            holding={holding}
            isUpdating
            isDeleting
            onEdit={vi.fn()}
            onDelete={vi.fn()}
          />
        </tbody>
      </table>,
    );

    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();

    expect(screen.getByRole("button", { name: "Removing..." })).toBeDisabled();
  });
});
