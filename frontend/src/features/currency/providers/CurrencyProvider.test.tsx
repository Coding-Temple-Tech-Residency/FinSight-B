import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import CurrencyProvider from "./CurrencyProvider";
import { useCurrency } from "../hooks/useCurrency";

const TestComponent = () => {
  const { preferredCurrency, setPreferredCurrency } = useCurrency();

  return (
    <div>
      <p>{preferredCurrency}</p>

      <button onClick={() => setPreferredCurrency("EUR")}>
        Change Currency
      </button>
    </div>
  );
};

describe("CurrencyProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("provides default USD currency", () => {
    render(
      <CurrencyProvider>
        <TestComponent />
      </CurrencyProvider>,
    );

    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  it("loads saved currency from localStorage", () => {
    localStorage.setItem("preferredCurrency", "EUR");

    render(
      <CurrencyProvider>
        <TestComponent />
      </CurrencyProvider>,
    );

    expect(screen.getByText("EUR")).toBeInTheDocument();
  });

  it("changes currency and saves it", async () => {
    const user = userEvent.setup();

    render(
      <CurrencyProvider>
        <TestComponent />
      </CurrencyProvider>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Change Currency",
      }),
    );

    expect(screen.getByText("EUR")).toBeInTheDocument();

    expect(localStorage.getItem("preferredCurrency")).toBe("EUR");
  });
});
