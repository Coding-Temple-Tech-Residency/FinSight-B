import { useState } from "react";

import type { CreateHoldingPayload, Holding } from "../types/holdings";

type HoldingFormProps = {
  holding?: Holding;
  isSubmitting: boolean;
  mutationError?: string;
  onSubmit: (payload: CreateHoldingPayload) => void;
  onCancel?: () => void;
};

const HoldingForm = ({
  holding,
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

  const [purchasedAt, setPurchasedAt] = useState(holding?.purchased_at ?? "");

  const [validationError, setValidationError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
      purchased_at: purchasedAt || null,
    });
  };

  return (
    <form className="holding-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="holding-symbol">Symbol</label>

        <input
          id="holding-symbol"
          type="text"
          value={symbol}
          disabled={Boolean(holding) || isSubmitting}
          maxLength={10}
          autoComplete="off"
          placeholder="AAPL"
          onChange={(event) => setSymbol(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="holding-shares">Shares</label>

        <input
          id="holding-shares"
          type="number"
          min="0.0001"
          step="0.0001"
          value={shares}
          disabled={isSubmitting}
          placeholder="10"
          onChange={(event) => setShares(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="holding-price">Average buy price</label>

        <input
          id="holding-price"
          type="number"
          min="0.01"
          step="0.01"
          value={averageBuyPrice}
          disabled={isSubmitting}
          placeholder="185.50"
          onChange={(event) => setAverageBuyPrice(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="holding-purchased-at">Purchase date</label>

        <input
          id="holding-purchased-at"
          type="date"
          value={purchasedAt}
          disabled={isSubmitting}
          onChange={(event) => setPurchasedAt(event.target.value)}
        />
      </div>

      {validationError && <p className="negative">{validationError}</p>}

      {mutationError && <p className="negative">{mutationError}</p>}

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
