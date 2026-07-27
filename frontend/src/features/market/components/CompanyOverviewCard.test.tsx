import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CompanyOverviewCard from "./CompanyOverviewCard";

describe("CompanyOverviewCard", () => {
  const quote = {
    symbol: "AAPL",
    company_name: "Apple Inc.",
    company_logo_url: null,
    industry: "Technology",
    exchange: "NASDAQ",
    currency: "USD",
    last_refreshed_at: "2024-01-01T12:00:00Z",
  } as never;

  it("renders loading state", () => {
    render(<CompanyOverviewCard loading quote={undefined} />);

    expect(screen.getByRole("article")).toHaveAttribute("aria-busy", "true");
  });

  it("renders empty state when quote is unavailable", () => {
    render(<CompanyOverviewCard loading={false} quote={undefined} />);

    expect(
      screen.getByRole("heading", { name: "Company overview" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Company information is currently unavailable."),
    ).toBeInTheDocument();
  });

  it("renders company information", () => {
    render(<CompanyOverviewCard loading={false} quote={quote} />);

    expect(
      screen.getByRole("heading", { name: "Apple Inc." }),
    ).toBeInTheDocument();

    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("Technology")).toBeInTheDocument();
    expect(screen.getByText("NASDAQ")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  it("renders error state", () => {
    render(<CompanyOverviewCard loading={false} isError quote={quote} />);

    expect(
      screen.getByText("Company information is currently unavailable."),
    ).toBeInTheDocument();
  });
});
