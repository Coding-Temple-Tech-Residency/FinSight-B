import { useState } from "react";

import type { CreateHoldingPayload, Holding } from "../types/holdings";

type HoldingFormProps = {
  holding?: Holding;
  isSubmitting: boolean;
  onSubmit: (payload: CreateHoldingPayload) => void;
  onCancel?: () => void;
};

const HoldingForm = ({
  holding,
  isSubmitting,
  onSubmit,
  onCancel,
}: HoldingFormProps) => {
  const [symbol, setSymbol] = useState(holding?.symbol ?? "");
  const [quantity, setQuantity] = useState(
    holding ? String(holding.quantity) : "",
  );
  const [averagePrice, setAveragePrice] = useState(
    holding ? String(holding.average_price) : "",
  );
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedSymbol = symbol.trim().toUpperCase();
    const parsedQuantity = Number(quantity);
    const parsedPrice = Number(averagePrice);

    if (!normalizedSymbol) {
      setError("Stock symbol is required.");
      return;
    }

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("Average price must be greater than zero.");
      return;
    }

    setError("");

    onSubmit({
      symbol: normalizedSymbol,
      quantity: parsedQuantity,
      average_price: parsedPrice,
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
          disabled={Boolean(holding)}
          onChange={(event) => setSymbol(event.target.value)}
          placeholder="AAPL"
        />
      </div>

      <div>
        <label htmlFor="holding-quantity">Quantity</label>

        <input
          id="holding-quantity"
          type="number"
          min="0"
          step="any"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="holding-price">Average price</label>

        <input
          id="holding-price"
          type="number"
          min="0"
          step="0.01"
          value={averagePrice}
          onChange={(event) => setAveragePrice(event.target.value)}
        />
      </div>

      {error && <p className="negative">{error}</p>}

      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel}>
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
