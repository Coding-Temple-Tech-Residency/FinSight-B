import type { ChangeEvent } from "react";

import { useCurrency } from "../../currency/hooks/useCurrency";
import type { SupportedCurrency } from "../../currency/types/currency";

const CURRENCY_NAMES: Record<SupportedCurrency, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  CHF: "Swiss Franc",
  CAD: "Canadian Dollar",
  AUD: "Australian Dollar",
};

const CurrencySettings = () => {
  const { preferredCurrency, setPreferredCurrency, supportedCurrencies } =
    useCurrency();

  const handleCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPreferredCurrency(event.target.value as SupportedCurrency);
  };

  return (
    <article className="settings-card">
      <div className="settings-card-header">
        <div>
          <h2>Preferred Currency</h2>

          <p>
            Choose the currency used to display your portfolio totals and
            performance.
          </p>
        </div>

        <select
          id="preferred-currency"
          className="settings-select"
          value={preferredCurrency}
          onChange={handleCurrencyChange}
          aria-label="Preferred currency"
        >
          {supportedCurrencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency} — {CURRENCY_NAMES[currency]}
            </option>
          ))}
        </select>
      </div>

      <p className="settings-label">
        Current currency: {preferredCurrency} —{" "}
        {CURRENCY_NAMES[preferredCurrency]}
      </p>
    </article>
  );
};

export default CurrencySettings;
