import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PortfolioSummary from "./PortfolioSummary";

describe("PortfolioSummary", () => {
  const portfolio = {
    id: 1,
    name: "Growth Portfolio",
    description: "Long term investments",
    currency: "USD",
    created_at: "2024-01-01",
    updated_at: "2024-01-15",
  } as never;

  it("renders loading state", () => {
    render(<PortfolioSummary portfolio={portfolio} holdings={[]} isLoading />);

    expect(screen.getAllByText("Loading...")).not.toHaveLength(0);
    expect(
      screen.getByRole("heading", { name: "Portfolio Details" }),
    ).toBeInTheDocument();
  });

  it("renders portfolio details", () => {
    render(
      <PortfolioSummary
        portfolio={portfolio}
        holdings={[]}
        isLoading={false}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Portfolio Details" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Growth Portfolio")).toBeInTheDocument();
    expect(screen.getByText("Long term investments")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  it("renders holdings summary", () => {
    render(
      <PortfolioSummary
        portfolio={portfolio}
        holdings={[
          {
            shares: 10,
            average_buy_price: 100,
            latest_price: 120,
          } as never,
        ]}
        isLoading={false}
      />,
    );

    expect(screen.getByText("Portfolio Value")).toBeInTheDocument();
    expect(screen.getByText("Total Cost Basis")).toBeInTheDocument();
    expect(screen.getByText("Total Gain/Loss")).toBeInTheDocument();
    expect(screen.getByText("Holdings")).toBeInTheDocument();

    expect(screen.getByText("1 of 1 priced")).toBeInTheDocument();
  });
});
