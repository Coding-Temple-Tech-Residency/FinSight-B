import { useDashboard } from "../../dashboard/hooks/useDashboard";

import StockSearchInput from "../../search/components/StockSearchInput";

import type { StockSearchResult } from "../types/stock";

const SYMBOL_PATTERN = /^[A-Z][A-Z0-9.-]{0,9}$/;

const StockSearch = () => {
  const { symbol, setSymbol } = useDashboard();

  const handleStockSelect = (stock: StockSearchResult) => {
    setSymbol(stock.symbol.trim().toUpperCase());
  };

  const handleSymbolSubmit = (submittedValue: string) => {
    const normalizedSymbol = submittedValue.split("—")[0].trim().toUpperCase();

    if (!SYMBOL_PATTERN.test(normalizedSymbol)) {
      return;
    }

    setSymbol(normalizedSymbol);
  };

  return (
    <StockSearchInput
      initialValue={symbol}
      placeholder="Search Apple, Microsoft, AAPL..."
      onSelect={handleStockSelect}
      onSymbolSubmit={handleSymbolSubmit}
    />
  );
};

export default StockSearch;
