import { useState, type ChangeEvent, type FormEvent } from "react";

import type { CreateHoldingPayload, Holding } from "../types/holdings";

import "../styles/holding-form.css";
import {
  SUPPORTED_PORTFOLIO_CURRENCIES,
  type PortfolioCurrency,
} from "../../../constants/currencies";

type HoldingFormProps = {
  holding?: Holding;
  defaultCurrency?: string;
  isSubmitting: boolean;
  mutationError?: string;
  onSubmit: (payload: CreateHoldingPayload) => void;
  onCancel?: () => void;
};

const isSupportedCurrency = (value: string): value is PortfolioCurrency => {
  return SUPPORTED_PORTFOLIO_CURRENCIES.some(
    (currency) => currency.code === value,
  );
};

const getInitialCurrency = (
  holding: Holding | undefined,
  defaultCurrency: string,
): PortfolioCurrency => {
  const currency =
    holding?.purchase_currency?.trim().toUpperCase() ||
    defaultCurrency.trim().toUpperCase();

  return isSupportedCurrency(currency) ? currency : "USD";
};

const HoldingForm = ({
  holding,
  defaultCurrency = "USD",
  isSubmitting,
  mutationError,
  onSubmit,
  onCancel,
}: HoldingFormProps) => {
  const [symbol, setSymbol] = useState(holding?.symbol ?? "");

  const [shares, setShares] = useState(holding ? String(holding.shares) : "");

  const [averageBuyPrice, setAverageBuyPrice] = useState(
    holding ? String(holding.average_buy_price) : "",
  );

  const [purchaseCurrency, setPurchaseCurrency] = useState<PortfolioCurrency>(
    () => getInitialCurrency(holding, defaultCurrency),
  );

  const [purchasedAt, setPurchasedAt] = useState(
    holding?.purchased_at ? holding.purchased_at.slice(0, 10) : "",
  );

  const [validationError, setValidationError] = useState("");

  const clearValidationError = () => {
    if (validationError) {
      setValidationError("");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedSymbol = symbol.trim().toUpperCase();
    const parsedShares = Number(shares);
    const parsedAverageBuyPrice = Number(averageBuyPrice);

    if (!normalizedSymbol) {
      setValidationError("Stock symbol is required.");
      return;
    }

    if (!Number.isFinite(parsedShares) || parsedShares <= 0) {
      setValidationError("Shares must be greater than zero.");
      return;
    }

    if (!Number.isFinite(parsedAverageBuyPrice) || parsedAverageBuyPrice <= 0) {
      setValidationError("Average buy price must be greater than zero.");
      return;
    }

    setValidationError("");

    onSubmit({
      symbol: normalizedSymbol,
      shares: parsedShares,
      average_buy_price: parsedAverageBuyPrice,
      purchase_currency: purchaseCurrency,
      purchased_at: purchasedAt || null,
    });
  };

  const handleSymbolChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSymbol(event.target.value.toUpperCase());
    clearValidationError();
  };

  const handleSharesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShares(event.target.value);
    clearValidationError();
  };

  const handleAverageBuyPriceChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setAverageBuyPrice(event.target.value);
    clearValidationError();
  };

  const handlePurchaseCurrencyChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const currency = event.target.value;

    if (isSupportedCurrency(currency)) {
      setPurchaseCurrency(currency);
    }

    clearValidationError();
  };

  const handlePurchaseDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPurchasedAt(event.target.value);
  };

  return (
    <form className="holding-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="holding-symbol">Symbol</label>

        <input
          id="holding-symbol"
          name="holding-symbol"
          type="text"
          value={symbol}
          disabled={Boolean(holding) || isSubmitting}
          maxLength={20}
          autoComplete="off"
          placeholder="AAPL"
          onChange={handleSymbolChange}
        />
      </div>

      <div>
        <label htmlFor="holding-shares">Shares</label>

        <input
          id="holding-shares"
          name="holding-shares"
          type="number"
          min="0.0001"
          step="0.0001"
          value={shares}
          disabled={isSubmitting}
          placeholder="10"
          onChange={handleSharesChange}
        />
      </div>

      <div>
        <label htmlFor="holding-price">Average buy price</label>

        <input
          id="holding-price"
          name="holding-price"
          type="number"
          min="0.01"
          step="0.01"
          value={averageBuyPrice}
          disabled={isSubmitting}
          placeholder="185.50"
          onChange={handleAverageBuyPriceChange}
        />
      </div>

      <div>
        <label htmlFor="holding-purchase-currency">Purchase currency</label>

        <select
          id="holding-purchase-currency"
          name="holding-purchase-currency"
          value={purchaseCurrency}
          disabled={isSubmitting}
          onChange={handlePurchaseCurrencyChange}
        >
          {SUPPORTED_PORTFOLIO_CURRENCIES.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.code} — {currency.name}
            </option>
          ))}
        </select>

        <p className="metric-label">
          Select the currency used when you purchased the stock.
        </p>
      </div>

      {holding && (
        <div className="holding-currency-summary">
          <p>
            <span>Stock market currency:</span>{" "}
            <strong>{holding.native_currency}</strong>
          </p>

          {holding.purchase_currency !== holding.native_currency && (
            <p className="metric-label">
              FinSight will convert the purchase price from {purchaseCurrency}{" "}
              to {holding.native_currency}.
            </p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="holding-purchased-at">Purchase date</label>

        <input
          id="holding-purchased-at"
          name="holding-purchased-at"
          type="date"
          value={purchasedAt}
          disabled={isSubmitting}
          onChange={handlePurchaseDateChange}
        />
      </div>

      {validationError && (
        <p className="negative" role="alert">
          {validationError}
        </p>
      )}

      {mutationError && (
        <p className="negative" role="alert">
          {mutationError}
        </p>
      )}

      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : holding
              ? "Update Holding"
              : "Add Holding"}
        </button>
      </div>
    </form>
  );
};

export default HoldingForm;
