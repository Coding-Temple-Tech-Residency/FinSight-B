import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import StockQuoteCard from "./StockQuoteCard";

describe("StockQuoteCard", () => {
  const quote = {
    symbol: "AAPL",
    company_name: "Apple Inc.",
    latest_price: 200,
    last_refreshed_at: "2024-01-01T12:00:00Z",
  } as never;

  it("renders loading state", () => {
    render(<StockQuoteCard loading quote={undefined} />);

    expect(screen.getByText("Loading quote...")).toBeInTheDocument();
  });

  it("renders unavailable state", () => {
    render(<StockQuoteCard loading={false} quote={undefined} />);

    expect(screen.getByText("Stock Quote")).toBeInTheDocument();
    expect(screen.getByText("Unavailable")).toBeInTheDocument();
  });

  it("renders stock quote information", () => {
    render(<StockQuoteCard loading={false} quote={quote} />);

    expect(screen.getByText("AAPL · Apple Inc.")).toBeInTheDocument();

    expect(screen.getByText("$200.00")).toBeInTheDocument();

    expect(screen.getByText("Last updated")).toBeInTheDocument();
  });

  it("renders error state", () => {
    render(<StockQuoteCard loading={false} quote={quote} isError />);

    expect(screen.getByText("Stock Quote")).toBeInTheDocument();
    expect(screen.getByText("Unavailable")).toBeInTheDocument();
  });
});
