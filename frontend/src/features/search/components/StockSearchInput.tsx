import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";

import type { StockSearchResult } from "../../market/types/stock";

import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useSearchHistory } from "../hooks/useSearchHistory";
import { useStockSearch } from "../hooks/useStockSearch";

import RecentStockSearches from "./RecentStockSearches";
import StockSuggestionsDropdown from "./StockSuggestionsDropdown";

interface StockSearchInputProps {
  initialValue?: string;
  placeholder?: string;
  resultLimit?: number;
  onSelect: (stock: StockSearchResult) => void;
  onSymbolSubmit?: (symbol: string) => void;
}

const MINIMUM_QUERY_LENGTH = 2;
const EMPTY_STOCK_RESULTS: StockSearchResult[] = [];

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to search stocks.";
};

const StockSearchInput = ({
  initialValue = "",
  placeholder = "Search company or symbol...",
  resultLimit = 6,
  onSelect,
  onSymbolSubmit,
}: StockSearchInputProps) => {
  const inputId = useId();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { recentStocks, addRecentStock, removeRecentStock, clearRecentStocks } =
    useSearchHistory();

  const debouncedQuery = useDebouncedValue(query, 300);
  const normalizedDebouncedQuery = debouncedQuery.trim();

  const hasTypedQuery = query.trim().length > 0;

  const hasValidSearchQuery =
    normalizedDebouncedQuery.length >= MINIMUM_QUERY_LENGTH;

  const stockSearchQuery = useStockSearch(
    normalizedDebouncedQuery,
    resultLimit,
  );

  const results = stockSearchQuery.data ?? EMPTY_STOCK_RESULTS;

  const dropdownResults = hasTypedQuery ? results : recentStocks;

  const shouldShowDropdown =
    isFocused && isDropdownOpen && (!hasTypedQuery || hasValidSearchQuery);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!containerRef.current?.contains(target)) {
        setIsDropdownOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const closeDropdown = () => {
    setIsDropdownOpen(false);
    setActiveIndex(-1);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextQuery = event.target.value;

    setQuery(nextQuery);
    setActiveIndex(-1);
    setIsDropdownOpen(true);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsDropdownOpen(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSelect = (stock: StockSearchResult) => {
    const normalizedStock = {
      ...stock,
      symbol: stock.symbol.trim().toUpperCase(),
    };

    setQuery(`${normalizedStock.symbol} — ${normalizedStock.company_name}`);

    addRecentStock(normalizedStock);
    closeDropdown();
    onSelect(normalizedStock);
  };

  const handleClear = () => {
    setQuery("");
    setActiveIndex(-1);
    setIsDropdownOpen(true);
    inputRef.current?.focus();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (activeIndex >= 0 && activeIndex < dropdownResults.length) {
      handleSelect(dropdownResults[activeIndex]);
      return;
    }

    const exactSymbolMatch = results.find(
      (stock) => stock.symbol.toLowerCase() === query.trim().toLowerCase(),
    );

    if (exactSymbolMatch) {
      handleSelect(exactSymbolMatch);
      return;
    }

    const normalizedSymbol = query.split("—")[0].trim().toUpperCase();

    if (!normalizedSymbol) {
      inputRef.current?.focus();
      return;
    }

    onSymbolSubmit?.(normalizedSymbol);
    closeDropdown();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDropdown();
      return;
    }

    if (!shouldShowDropdown || dropdownResults.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((currentIndex) => {
        if (currentIndex >= dropdownResults.length - 1) {
          return 0;
        }

        return currentIndex + 1;
      });

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((currentIndex) => {
        if (currentIndex <= 0) {
          return dropdownResults.length - 1;
        }

        return currentIndex - 1;
      });

      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(dropdownResults.length - 1);
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      handleSelect(dropdownResults[activeIndex]);
    }
  };

  const activeDescendant = (() => {
    if (activeIndex < 0 || !dropdownResults[activeIndex]) {
      return undefined;
    }

    const activeStock = dropdownResults[activeIndex];

    return hasTypedQuery
      ? `stock-search-result-${activeStock.symbol}`
      : `recent-stock-result-${activeStock.symbol}`;
  })();

  return (
    <div ref={containerRef} className="relative w-full">
      <form className="stock-search" role="search" onSubmit={handleSubmit}>
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          aria-hidden="true"
          className="shrink-0 opacity-55"
        />

        <label htmlFor={inputId} className="sr-only">
          Search stock company or symbol
        </label>

        <input
          ref={inputRef}
          id={inputId}
          type="search"
          value={query}
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-controls={
            shouldShowDropdown ? "stock-search-suggestions" : undefined
          }
          aria-expanded={shouldShowDropdown}
          aria-activedescendant={activeDescendant}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />

        {query && (
          <button
            type="button"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-transparent
              text-(--text-primary)
              opacity-60
              transition
              hover:bg-(--bg-primary)
              hover:opacity-100
            "
            aria-label="Clear stock search"
            onClick={handleClear}
          >
            <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
          </button>
        )}

        <button type="submit">Search</button>
      </form>

      {shouldShowDropdown && (
        <div
          id="stock-search-suggestions"
          className="
            absolute
            top-[calc(100%+0.5rem)]
            left-0
            z-200
            max-h-[min(420px,calc(100vh-180px))]
            w-full
            overflow-y-auto
            rounded-2xl
            border
            border-white/10
            bg-(--bg-primary)
            shadow-2xl
          "
        >
          {!hasTypedQuery ? (
            <RecentStockSearches
              stocks={recentStocks}
              activeIndex={activeIndex}
              onSelect={handleSelect}
              onRemove={removeRecentStock}
              onClear={clearRecentStocks}
            />
          ) : (
            <StockSuggestionsDropdown
              query={normalizedDebouncedQuery}
              results={results}
              activeIndex={activeIndex}
              isLoading={
                stockSearchQuery.isLoading || stockSearchQuery.isFetching
              }
              isError={stockSearchQuery.isError}
              errorMessage={
                stockSearchQuery.isError
                  ? getErrorMessage(stockSearchQuery.error)
                  : undefined
              }
              onSelect={handleSelect}
              renderContainer={false}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearchInput;
