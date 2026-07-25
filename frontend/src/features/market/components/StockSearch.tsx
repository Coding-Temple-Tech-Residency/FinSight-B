import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { StockSearchResult } from "../types/stock";

import { useDashboard } from "../../dashboard/hooks/useDashboard";
import StockSearchInput from "../../search/components/StockSearchInput";
import StockDetailsModal from "./StockDetailsModal";

type StockSearchProps = {
  initialSymbol?: string;
};

const StockSearch = ({ initialSymbol }: StockSearchProps) => {
  const navigate = useNavigate();
  const { symbol, setSymbol } = useDashboard();
  const [selectedStock, setSelectedStock] =
    useState<StockSearchResult | null>(null);

  const startingSymbol = initialSymbol?.trim().toUpperCase() || symbol;

  const openMarketPage = (nextSymbol: string) => {
    const normalizedSymbol = nextSymbol.trim().toUpperCase();

    if (!normalizedSymbol) {
      return;
    }

    setSelectedStock(null);
    setSymbol(normalizedSymbol);
    navigate(
      `/dashboard/market?symbol=${encodeURIComponent(normalizedSymbol)}`,
    );
  };

  const handleSelect = (stock: StockSearchResult) => {
    setSelectedStock(stock);
  };

  return (
    <>
      <StockSearchInput
        initialValue={startingSymbol}
        placeholder="Search company name or stock symbol..."
        onSelect={handleSelect}
        onSymbolSubmit={openMarketPage}
      />

      <StockDetailsModal
        stock={selectedStock}
        isOpen={Boolean(selectedStock)}
        onClose={() => setSelectedStock(null)}
        onViewMarket={openMarketPage}
      />
    </>
  );
};

export default StockSearch;
