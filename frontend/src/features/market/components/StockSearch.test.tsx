import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import StockSearch from "./StockSearch";

const navigate = vi.fn();
const setSymbol = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigate,
}));

vi.mock("../../dashboard/hooks/useDashboard", () => ({
  useDashboard: () => ({
    symbol: "TSLA",
    setSymbol,
  }),
}));

const mockStockSearchInput = vi.fn();

vi.mock("../../search/components/StockSearchInput", () => ({
  default: (props: {
    initialValue: string;
    placeholder: string;
    onSelect: (stock: { symbol: string; company_name: string }) => void;
    onSymbolSubmit: (symbol: string) => void;
  }) => {
    mockStockSearchInput(props);

    return (
      <div>
        <button
          onClick={() =>
            props.onSelect({
              symbol: "AAPL",
              company_name: "Apple Inc.",
            })
          }
        >
          Select Stock
        </button>

        <button onClick={() => props.onSymbolSubmit("AAPL")}>
          Submit Symbol
        </button>
      </div>
    );
  },
}));

vi.mock("./StockDetailsModal", () => ({
  default: ({
    stock,
    isOpen,
    onClose,
    onViewMarket,
  }: {
    stock: { symbol: string } | null;
    isOpen: boolean;
    onClose: () => void;
    onViewMarket: (symbol: string) => void;
  }) => (
    <div>
      <p>{isOpen ? "Modal Open" : "Modal Closed"}</p>
      <p>{stock?.symbol}</p>

      <button onClick={onClose}>Close Modal</button>

      <button onClick={() => stock && onViewMarket(stock.symbol)}>
        View Market
      </button>
    </div>
  ),
}));

describe("StockSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("passes initial symbol to StockSearchInput", () => {
    render(<StockSearch initialSymbol=" msft " />);

    expect(mockStockSearchInput).toHaveBeenCalledWith(
      expect.objectContaining({
        initialValue: "MSFT",
      }),
    );
  });

  it("uses dashboard symbol when no initial symbol is provided", () => {
    render(<StockSearch />);

    expect(mockStockSearchInput).toHaveBeenCalledWith(
      expect.objectContaining({
        initialValue: "TSLA",
      }),
    );
  });

  it("opens the stock details modal after selecting a stock", async () => {
    const user = userEvent.setup();

    render(<StockSearch />);

    await user.click(screen.getByRole("button", { name: "Select Stock" }));

    expect(screen.getByText("Modal Open")).toBeInTheDocument();
    expect(screen.getByText("AAPL")).toBeInTheDocument();
  });

  it("closes the modal", async () => {
    const user = userEvent.setup();

    render(<StockSearch />);

    await user.click(screen.getByRole("button", { name: "Select Stock" }));
    await user.click(screen.getByRole("button", { name: "Close Modal" }));

    expect(screen.getByText("Modal Closed")).toBeInTheDocument();
  });

  it("submits a symbol and navigates to the market page", async () => {
    const user = userEvent.setup();

    render(<StockSearch />);

    await user.click(screen.getByRole("button", { name: "Submit Symbol" }));

    expect(setSymbol).toHaveBeenCalledWith("AAPL");
    expect(navigate).toHaveBeenCalledWith("/dashboard/market?symbol=AAPL");
  });

  it("opens the market page from the modal", async () => {
    const user = userEvent.setup();

    render(<StockSearch />);

    await user.click(screen.getByRole("button", { name: "Select Stock" }));
    await user.click(screen.getByRole("button", { name: "View Market" }));

    expect(setSymbol).toHaveBeenCalledWith("AAPL");
    expect(navigate).toHaveBeenCalledWith("/dashboard/market?symbol=AAPL");
  });
});
