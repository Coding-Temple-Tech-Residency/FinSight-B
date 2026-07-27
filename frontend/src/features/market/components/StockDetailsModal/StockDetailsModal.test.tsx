import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import StockDetailsModal from "./StockDetailsModal";

vi.mock("../../../../components/ui/Modal", () => ({
  default: ({
    isOpen,
    title,
    children,
  }: {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
  }) =>
    isOpen ? (
      <div>
        <h2>{title}</h2>
        {children}
      </div>
    ) : null,
}));

describe("StockDetailsModal", () => {
  const onClose = vi.fn();
  const onViewMarket = vi.fn();

  const stock = {
    symbol: "AAPL",
    company_name: "Apple Inc.",
    company_logo_url: null,
    latest_price: 200,
    currency: "USD",
    exchange: "NASDAQ",
    industry: "Technology",
    is_enriched: true,
  } as never;

  it("renders nothing when stock is null", () => {
    const { container } = render(
      <StockDetailsModal
        stock={null}
        isOpen
        onClose={onClose}
        onViewMarket={onViewMarket}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders stock details", () => {
    render(
      <StockDetailsModal
        stock={stock}
        isOpen
        onClose={onClose}
        onViewMarket={onViewMarket}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Apple Inc. (AAPL)" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Technology")).toBeInTheDocument();
    expect(screen.getByText("NASDAQ")).toBeInTheDocument();
    expect(screen.getByText("Enriched")).toBeInTheDocument();
    expect(screen.getByText("$200.00")).toBeInTheDocument();
  });

  it("calls onClose when Close is clicked", async () => {
    const user = userEvent.setup();

    render(
      <StockDetailsModal
        stock={stock}
        isOpen
        onClose={onClose}
        onViewMarket={onViewMarket}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("calls onViewMarket when View full market data is clicked", async () => {
    const user = userEvent.setup();

    render(
      <StockDetailsModal
        stock={stock}
        isOpen
        onClose={onClose}
        onViewMarket={onViewMarket}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "View full market data",
      }),
    );

    expect(onViewMarket).toHaveBeenCalledWith("AAPL");
  });
});
