import { useState } from "react";
import { useDashboard } from "../../dashboard/hooks/useDashboard";

const StockSearch = () => {
  const { symbol, setSymbol } = useDashboard();

  const [value, setValue] = useState(symbol);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextSymbol = value.trim().toUpperCase();

    if (!nextSymbol) return;

    setSymbol(nextSymbol);
    setValue(nextSymbol);
  };

  return (
    <form onSubmit={handleSubmit} className="stock-search">
      <input
        type="text"
        value={value}
        placeholder="Search stock symbol..."
        onChange={(e) => setValue(e.target.value)}
      />

      <button type="submit">Search</button>
    </form>
  );
};

export default StockSearch;
