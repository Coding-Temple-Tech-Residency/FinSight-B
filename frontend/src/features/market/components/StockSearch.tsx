import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDashboard } from "../../dashboard/hooks/useDashboard";

const SYMBOL_PATTERN = /^[A-Z][A-Z0-9.-]{0,9}$/;

type StockSearchProps = {
  initialSymbol?: string;
};

const StockSearch = ({ initialSymbol }: StockSearchProps) => {
  const navigate = useNavigate();
  const { symbol, setSymbol } = useDashboard();

  const startingSymbol = initialSymbol?.trim().toUpperCase() || symbol;

  const [value, setValue] = useState(startingSymbol);
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextSymbol = value.trim().toUpperCase();

    if (!nextSymbol) {
      setError("Enter a stock symbol.");
      return;
    }

    if (!SYMBOL_PATTERN.test(nextSymbol)) {
      setError("Enter a valid stock symbol.");
      return;
    }

    setError("");
    setSymbol(nextSymbol);
    setValue(nextSymbol);

    navigate(`/dashboard/market?symbol=${encodeURIComponent(nextSymbol)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="stock-search">
      <label htmlFor="stock-symbol-search" className="sr-only">
        Stock symbol
      </label>

      <input
        id="stock-symbol-search"
        type="text"
        value={value}
        maxLength={10}
        autoComplete="off"
        spellCheck={false}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "stock-symbol-search-error" : undefined}
        placeholder="Search stock symbol..."
        onChange={(event) => {
          setValue(event.target.value);

          if (error) {
            setError("");
          }
        }}
      />

      <button type="submit">Search</button>

      {error && (
        <p
          id="stock-symbol-search-error"
          className="negative stock-search-error"
          role="alert"
        >
          {error}
        </p>
      )}
    </form>
  );
};

export default StockSearch;
