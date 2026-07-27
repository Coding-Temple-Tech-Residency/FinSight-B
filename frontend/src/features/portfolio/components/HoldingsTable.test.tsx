import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HoldingsTable from "./HoldingsTable";

vi.mock("./HoldingRow", () => ({
  default: ({ holding }: { holding: { symbol: string } }) => (
    <tr>
      <td>{holding.symbol}</td>
    </tr>
  ),
}));

describe("HoldingsTable", () => {
  it("renders the table headings", () => {
    render(<HoldingsTable holdings={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("Asset")).toBeInTheDocument();
    expect(screen.getByText("Shares")).toBeInTheDocument();
    expect(screen.getByText("Purchase Price")).toBeInTheDocument();
    expect(screen.getByText("Latest Price")).toBeInTheDocument();
    expect(screen.getByText("Market Value")).toBeInTheDocument();
    expect(screen.getByText("Gain/Loss")).toBeInTheDocument();
    expect(screen.getByText("Purchased")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders holding rows", () => {
    render(
      <HoldingsTable
        holdings={[
          {
            id: 1,
            symbol: "AAPL",
          } as never,
          {
            id: 2,
            symbol: "TSLA",
          } as never,
        ]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("TSLA")).toBeInTheDocument();
  });
});
