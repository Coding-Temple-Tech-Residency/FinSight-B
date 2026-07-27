import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import TrendingCompanyCard from "./TrendingCompanyCard";

import type { TrendingStock } from "../../market/types/trending";

describe("TrendingCompanyCard", () => {
  const stock: TrendingStock = {
    rank: 1,
    symbol: "AAPL",
    company_name: "Apple Inc.",
    price: 200,
    percentage_change: 5.25,
    volume: 1000000,
    change_amount: 10.5,
    category: "gainer",
  };

  it("renders trending company information", () => {
    render(<TrendingCompanyCard stock={stock} />);

    expect(screen.getByText("Apple Inc.")).toBeInTheDocument();

    expect(screen.getByText("AAPL")).toBeInTheDocument();

    expect(screen.getByText("#1 Top gainer")).toBeInTheDocument();

    expect(screen.getByText("$200.00")).toBeInTheDocument();

    expect(screen.getByText("+5.25%")).toBeInTheDocument();

    expect(screen.getByText("Volume: 1,000,000")).toBeInTheDocument();

    expect(screen.getByText("+10.50")).toBeInTheDocument();
  });

  it("renders loser category", () => {
    render(
      <TrendingCompanyCard
        stock={{
          ...stock,
          category: "loser",
          percentage_change: -3.5,
        }}
      />,
    );

    expect(screen.getAllByText("Top loser").length).toBeGreaterThan(0);

    expect(screen.getByText("-3.50%")).toBeInTheDocument();
  });

  it("renders most active category", () => {
    render(
      <TrendingCompanyCard
        stock={{
          ...stock,
          category: "active",
        }}
      />,
    );

    expect(screen.getAllByText("Most active").length).toBeGreaterThan(0);
  });

  it("renders unavailable values", () => {
    render(
      <TrendingCompanyCard
        stock={{
          ...stock,
          price: null,
          percentage_change: null,
          volume: null,
          change_amount: null,
        }}
      />,
    );

    expect(screen.getAllByText("Unavailable").length).toBeGreaterThan(0);

    expect(screen.getByText("Volume: Unavailable")).toBeInTheDocument();

    expect(screen.getByText("Change unavailable")).toBeInTheDocument();
  });

  it("applies featured class when featured is true", () => {
    const { container } = render(
      <TrendingCompanyCard stock={stock} featured />,
    );

    expect(container.firstChild).toHaveClass("trending-company-card-featured");
  });
});
