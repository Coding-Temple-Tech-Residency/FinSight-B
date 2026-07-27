import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import CurrencySettings from "./CurrencySettings";

const mockSetPreferredCurrency = vi.fn();

vi.mock("../../currency/hooks/useCurrency", () => ({
  useCurrency: () => ({
    preferredCurrency: "USD",
    setPreferredCurrency: mockSetPreferredCurrency,
    supportedCurrencies: ["USD", "EUR", "GBP"],
  }),
}));

describe("CurrencySettings", () => {
  it("renders the currency settings", () => {
    render(<CurrencySettings />);

    expect(
      screen.getByRole("heading", { name: "Preferred Currency" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Choose the currency used to display your portfolio totals and performance.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the currency select", () => {
    render(<CurrencySettings />);

    expect(
      screen.getByRole("combobox", { name: "Preferred currency" }),
    ).toHaveValue("USD");
  });

  it("renders supported currencies", () => {
    render(<CurrencySettings />);

    expect(
      screen.getByRole("option", { name: "USD — US Dollar" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "EUR — Euro" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "GBP — British Pound" }),
    ).toBeInTheDocument();
  });

  it("changes the preferred currency", async () => {
    const user = userEvent.setup();

    render(<CurrencySettings />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Preferred currency" }),
      "EUR",
    );

    expect(mockSetPreferredCurrency).toHaveBeenCalledWith("EUR");
  });

  it("shows the current currency", () => {
    render(<CurrencySettings />);

    expect(
      screen.getByText("Current currency: USD — US Dollar"),
    ).toBeInTheDocument();
  });
});
