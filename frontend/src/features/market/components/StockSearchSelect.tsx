import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import { useQuery } from "@tanstack/react-query";

import { searchStocks } from "../../../api/marketDataApi";
import type { StockSearchResult } from "../types/stock";

type StockSearchSelectProps = {
  selectedStock: StockSearchResult | null;
  onSelect: (stock: StockSearchResult) => void;
  onClear: () => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
};

const SEARCH_DELAY = 300;
const RESULT_LIMIT = 8;

const StockSearchSelect = ({
  selectedStock,
  onSelect,
  onClear,
  disabled = false,
  label = "Company or stock symbol",
  placeholder = "Search Apple, Microsoft, AAPL...",
}: StockSearchSelectProps) => {
  const inputId = useId();
  const listboxId = useId();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, SEARCH_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        containerRef.current &&
        !containerRef.current.contains(target)
      ) {
        setIsFocused(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const {
    data: results = [],
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["stock-search-select", debouncedQuery],
    queryFn: () => searchStocks(debouncedQuery, RESULT_LIMIT),
    enabled: !disabled && !selectedStock && debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  const showDropdown =
    isFocused && !disabled && !selectedStock && debouncedQuery.length >= 2;

  const getCompanyName = (stock: StockSearchResult) => {
    return stock.company_name?.trim() || stock.symbol.toUpperCase();
  };

  const handleSelect = (stock: StockSearchResult) => {
    onSelect({
      ...stock,
      symbol: stock.symbol.trim().toUpperCase(),
    });

    setQuery("");
    setDebouncedQuery("");
    setIsFocused(false);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    onClear();

    setQuery("");
    setDebouncedQuery("");
    setIsFocused(false);
    setActiveIndex(-1);

    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || results.length === 0) {
      if (event.key === "Escape") {
        setIsFocused(false);
        setActiveIndex(-1);
      }

      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((currentIndex) => {
        if (currentIndex >= results.length - 1) {
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
          return results.length - 1;
        }

        return currentIndex - 1;
      });

      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();

      const selectedResult = results[activeIndex];

      if (selectedResult) {
        handleSelect(selectedResult);
      }

      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();

      setIsFocused(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-semibold">
        {label}
      </label>

      {selectedStock ? (
        <div className="flex min-h-13 items-center justify-between gap-4 rounded-lg border border-(--accent-primary) bg-(--bg-primary) px-4 py-3">
          <div className="min-w-0">
            <strong className="block truncate">
              {getCompanyName(selectedStock)}
            </strong>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-(--bg-secondary) px-2 py-1 text-xs font-bold text-(--accent-primary)">
                {selectedStock.symbol.toUpperCase()}
              </span>

              {selectedStock.exchange && (
                <span className="text-xs opacity-60">
                  {selectedStock.exchange}
                </span>
              )}
            </div>
          </div>

          {!disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold"
            >
              Change
            </button>
          )}
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            id={inputId}
            name="stock-search"
            type="search"
            role="combobox"
            value={query}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={showDropdown}
            aria-activedescendant={
              activeIndex >= 0
                ? `${listboxId}-option-${activeIndex}`
                : undefined
            }
            onFocus={() => setIsFocused(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsFocused(true);
              setActiveIndex(-1);
            }}
            onKeyDown={handleInputKeyDown}
            className="w-full rounded-lg border border-white/10 bg-(--bg-primary) px-4 py-3 outline-none focus:border-(--accent-primary) disabled:cursor-not-allowed disabled:opacity-50"
          />

          {showDropdown && (
            <div
              id={listboxId}
              role="listbox"
              className="absolute top-full left-0 z-50 mt-2 max-h-80 w-full overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-(--bg-primary) p-2 shadow-2xl"
            >
              {(isLoading || isFetching) && (
                <p className="px-3 py-4 text-sm opacity-70" role="status">
                  Searching companies...
                </p>
              )}

              {isError && (
                <p className="px-3 py-4 text-sm text-red-500" role="alert">
                  Unable to search stocks. Please try again.
                </p>
              )}

              {!isLoading &&
                !isFetching &&
                !isError &&
                results.length === 0 && (
                  <p className="px-3 py-4 text-sm opacity-70">
                    No matching companies found.
                  </p>
                )}

              {!isError &&
                results.map((stock, index) => {
                  const companyName = getCompanyName(stock);
                  const isActive = index === activeIndex;

                  return (
                    <button
                      id={`${listboxId}-option-${index}`}
                      key={`${stock.symbol}-${stock.exchange ?? index}`}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => handleSelect(stock)}
                      className={`flex w-full items-center justify-between gap-4 rounded-lg px-3 py-3 text-left transition ${
                        isActive
                          ? "bg-(--bg-secondary)"
                          : "hover:bg-(--bg-secondary)"
                      }`}
                    >
                      <div className="min-w-0">
                        <strong className="block truncate">
                          {companyName}
                        </strong>

                        {stock.exchange && (
                          <span className="block truncate text-xs opacity-60">
                            {stock.exchange}
                          </span>
                        )}
                      </div>

                      <span className="shrink-0 rounded-md bg-(--bg-secondary) px-2 py-1 text-sm font-bold text-(--accent-primary)">
                        {stock.symbol.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StockSearchSelect;
