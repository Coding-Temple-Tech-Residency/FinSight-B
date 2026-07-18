import { useState } from "react";

import { useDashboard } from "../../dashboard/hooks/useDashboard";

const SYMBOL_PATTERN = /^[A-Z][A-Z0-9.-]{0,9}$/;

const StockSearch = () => {
  const { symbol, setSymbol } = useDashboard();

  const [value, setValue] = useState(symbol);
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
        placeholder="Search stock symbol..."
        onChange={(event) => {
          setValue(event.target.value);

          if (error) {
            setError("");
          }
        }}
      />

      <button type="submit">Search</button>

      {error && <p className="negative stock-search-error">{error}</p>}
    </form>
  );
};

export default StockSearch;
