import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import MetricCard from "./MetricCard";

describe("MetricCard", () => {
  it("renders metric label and value", () => {
    render(<MetricCard label="Total Portfolio Value" value="$10,000.00" />);

    expect(screen.getByText("Total Portfolio Value")).toBeInTheDocument();

    expect(screen.getByText("$10,000.00")).toBeInTheDocument();
  });

  it("renders value caption", () => {
    render(
      <MetricCard
        label="Portfolio"
        value="$10,000"
        valueCaption="Combined in USD"
      />,
    );

    expect(screen.getByText("Combined in USD")).toBeInTheDocument();
  });

  it("renders positive change", () => {
    render(<MetricCard label="Profit" value="$500" change="+5%" positive />);

    expect(screen.getByText("+5%")).toBeInTheDocument();
  });

  it("renders negative change", () => {
    render(
      <MetricCard label="Profit" value="-$100" change="-2%" positive={false} />,
    );

    expect(screen.getByText("-2%")).toBeInTheDocument();
  });

  it("renders breakdown items", () => {
    render(
      <MetricCard
        label="Portfolio Value"
        value="$10,000"
        breakdownLabel="Original currency totals"
        breakdown={[
          {
            id: "usd",
            label: "USD",
            value: "$5,000",
          },
          {
            id: "eur",
            label: "EUR",
            value: "€5,000",
          },
        ]}
      />,
    );

    expect(screen.getByText("Original currency totals")).toBeInTheDocument();

    expect(screen.getByText("USD")).toBeInTheDocument();

    expect(screen.getByText("$5,000")).toBeInTheDocument();

    expect(screen.getByText("EUR")).toBeInTheDocument();

    expect(screen.getByText("€5,000")).toBeInTheDocument();
  });
});
